// services/runradar-service.ts
// ESM-safe, Vercel-ready. No `require()` anywhere.

import OpenAI from 'openai';
import 'dotenv/config';

// ----------------------
// Types your API expects
// ----------------------

export type RadarActionItem = {
  text: string;
  section?: string | null;
  step_index?: number | null;
};

export type RadarResult = {
  // Scores (nullable if the model didn't return them)
  powerScore?: number | null;
  gravityScore?: number | null;
  riskScore?: number | null;
  confidence?: number | null;

  // Summaries
  tldr?: string | null;
  whatsHappening?: string | null;
  whyItMatters?: string | null;
  narrativeSummary?: string | null;

  // Structured items
  actionItems?: RadarActionItem[];

  // Raw content (for debugging)
  rawText?: string | null;
};

export type ServerAttachment =
  | { name: string; type?: string | null; bytes: ArrayBuffer | Uint8Array | Buffer }
  // if your pipeline passes base64 strings:
  | { name: string; type?: string | null; base64: string };

// ----------------------
// OpenAI client singleton
// ----------------------

let _openAIClient: OpenAI | null = null;

/**
 * Create (or reuse) a single OpenAI client instance.
 * Reads creds from environment (Vercel → Project Settings → Environment Variables).
 */
export function getOpenAIClient(): OpenAI {
  if (_openAIClient) return _openAIClient;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Don't proceed without credentials — this is the #1 cause of silent failures.
    throw new Error('OPENAI_API_KEY is missing (check Vercel env variables)');
  }

  const organization = process.env.OPENAI_ORG || undefined;
  _openAIClient = new OpenAI({ apiKey, organization });
  return _openAIClient;
}

// ----------------------
// Small helpers
// ----------------------

function toUint8Array(data: ArrayBuffer | Uint8Array | Buffer | string): Uint8Array {
  if (typeof data === 'string') {
    // treat as base64-encoded
    if (typeof Buffer !== 'undefined') {
      return new Uint8Array(Buffer.from(data, 'base64'));
    }
    // Browser-ish fallback
    const bin = atob(data);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }
  if (data instanceof Uint8Array) return data;
  if (typeof Buffer !== 'undefined' && data instanceof Buffer) return new Uint8Array(data);
  return new Uint8Array(data);
}

async function uploadToVectorStore(
  files: ServerAttachment[] | undefined | null
): Promise<{ vectorStoreId?: string }> {
  const client = getOpenAIClient() as any; // `.beta` namespace is available at runtime; TS typings can lag.

  if (!files || files.length === 0) return {};

  try {
    // Create a short-lived vector store for this run
    const store = await client.beta.vectorStores.create({ name: `radar-${Date.now()}` });

    // Upload as a single batch. The SDK accepts { files: { name, data }[] }.
    const uploadPayload = {
      files: files.map((f) => {
        const type = (f as any).type || 'application/octet-stream';
        const name = f.name || 'attachment.bin';

        if ('base64' in f && typeof f.base64 === 'string') {
          return {
            name,
            // The SDK supports raw bytes; pass Uint8Array
            data: toUint8Array(f.base64),
            type,
          };
        }
        return {
          name,
          data: 'bytes' in f ? toUint8Array(f.bytes) : new Uint8Array(),
          type,
        };
      }),
    };

    await client.beta.vectorStores.fileBatches.upload(store.id, uploadPayload);
    return { vectorStoreId: String(store.id) };
  } catch (e) {
    console.warn('[radar] vector store upload failed; continuing without files:', e);
    return {};
  }
}

// ----------------------
// OpenAI Assistants compat shims + logging
// (object-form first; fallback to positional if runtime uses old SDK)
// ----------------------

function _isPathParamError(err: unknown): boolean {
  const msg = String((err as any)?.message ?? err ?? '');
  return msg.includes('invalid segments') || msg.includes('not a valid path parameter');
}

// Some SDKs accept {}, others accept no args
async function _threadsCreate(client: any) {
  try { return await client.beta.threads.create({}); }
  catch { return await client.beta.threads.create(); }
}

async function _messagesCreate(client: any, thread_id: string, payload: any) {
  try { return await client.beta.threads.messages.create({ thread_id, ...payload }); }
  catch (e) {
    if (_isPathParamError(e)) return await client.beta.threads.messages.create(thread_id, payload);
    throw e;
  }
}

async function _runsCreate(client: any, thread_id: string, payload: any) {
  try { return await client.beta.threads.runs.create({ thread_id, ...payload }); }
  catch (e) {
    if (_isPathParamError(e)) return await client.beta.threads.runs.create(thread_id, payload);
    throw e;
  }
}

async function _runsRetrieve(client: any, thread_id: string, run_id: string) {
  try { return await client.beta.threads.runs.retrieve({ thread_id, run_id }); }
  catch (e) {
    if (_isPathParamError(e)) return await client.beta.threads.runs.retrieve(thread_id, run_id);
    throw e;
  }
}

async function _messagesList(client: any, thread_id: string, opts: any) {
  // Try the SDK’s current (v6.5.x) positional signature first.
  try {
    return await client.beta.threads.messages.list(thread_id, opts ?? {});
  } catch (e) {
    // Fallback to the older object-form signature.
    try {
      return await client.beta.threads.messages.list({ thread_id, ...(opts ?? {}) });
    } catch {
      throw e;
    }
  }
}


// ----------------------
// Assistants (beta) path
// ----------------------

async function runWithAssistant(
  prompt: string,
  files: ServerAttachment[] | undefined | null
): Promise<RadarResult> {
  const client = getOpenAIClient() as any;
  const assistantId = process.env.OPENAI_ASSISTANT_ID;

  console.log('[radar] path=assistants | assistant_id=', assistantId);

  if (!assistantId) {
    console.warn('[radar] no OPENAI_ASSISTANT_ID; falling back to chat');
    return runWithChat(prompt);
  }

  // Optional file context
  let vectorStoreId: string | undefined;
  try {
    const out = await uploadToVectorStore(files);
    vectorStoreId = out.vectorStoreId;
  } catch (e) {
    console.warn('[radar] vector store upload error; continuing without files:', e);
  }
  console.log('[radar] vectorStoreId=', vectorStoreId ?? 'none');

  // 1) Create thread (shim handles {} vs no-arg)
  const thread = await _threadsCreate(client);
  const thread_id: string = thread.id;
  console.log('[radar] created thread_id=', thread_id);

  // 2) Add user message (object-form → positional fallback if needed)
  await _messagesCreate(client, thread_id, {
    role: 'user',
    content: prompt,
  });
  console.log('[radar] message added to thread');

  // 3) Start run (object-form → positional fallback if needed)
  const run = await _runsCreate(client, thread_id, {
    assistant_id: assistantId,
    ...(vectorStoreId
      ? { tool_resources: { file_search: { vector_store_ids: [vectorStoreId] } } }
      : {}),
  });
  const run_id: string = run.id;
  console.log('[radar] started run_id=', run_id);

  // 4) Poll (object-form → positional fallback if needed)
  const timeoutMs = Number(process.env.RADAR_TIMEOUT_MS ?? 120_000);
  const t0 = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const current = await _runsRetrieve(client, thread_id, run_id);
    if (current.status === 'completed') break;
    if (['failed', 'cancelled', 'expired'].includes(current.status)) {
      throw new Error(`Assistant run ended with status=${current.status}`);
    }
    if (Date.now() - t0 > timeoutMs) throw new Error('Assistant run timed out');
    await new Promise(r => setTimeout(r, 1200));
  }
  console.log('[radar] assistant run completed');

  // 5) Read assistant messages (object-form → positional fallback if needed)
  const list = await _messagesList(client, thread_id, { order: 'desc', limit: 10 });

  const rawText = (list?.data ?? [])
    .filter((m: any) => m.role === 'assistant')
    .flatMap((m: any) =>
      (m.content ?? [])
        .filter((c: any) => c.type === 'text' && c.text?.value)
        .map((c: any) => c.text.value)
    )
    .join('\n\n')
    .trim();

  console.log('[radar] assistant.raw length=', rawText?.length ?? 0);

  if (!rawText) {
    return {
      powerScore: null,
      gravityScore: null,
      riskScore: null,
      confidence: null,
      tldr: 'No output received from Assistant.',
      whatsHappening: null,
      whyItMatters: null,
      narrativeSummary: null,
      actionItems: [],
      rawText: null,
    };
  }

  const normalized = normalizeToRadarResult(rawText);
  return { ...normalized, rawText };
}

// ----------------------
// Chat fallback path
// ----------------------

async function runWithChat(prompt: string): Promise<RadarResult> {
  const client = getOpenAIClient();
  const model = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini';

  console.log('[radar] path=chat | model=', model);

  const resp = await client.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content:
          'You are MaverickAI. Analyze the situation and return a concise JSON object with keys: powerScore, gravityScore, riskScore, confidence, tldr, whatsHappening, whyItMatters, narrativeSummary, actionItems (array of {text, section}). Keep numbers 0-100.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
  });

  const raw = resp.choices?.[0]?.message?.content ?? '';
  console.log('[radar] chat.raw length=', raw?.length ?? 0);

  const normalized = normalizeToRadarResult(raw);
  return { ...normalized, rawText: raw };
}

// ----------------------
// Normalization
// ----------------------

function normalizeToRadarResult(raw: string): RadarResult {
  if (!raw) {
    return {
      tldr: null,
      whatsHappening: null,
      whyItMatters: null,
      narrativeSummary: null,
      powerScore: null,
      gravityScore: null,
      riskScore: null,
      confidence: null,
      actionItems: [],
      rawText: null,
    };
  }

  // Try to find a JSON block in the text (assistant/chat may return text + code fences)
  const jsonMatch =
    raw.match(/```json\s*([\s\S]*?)\s*```/i) ||
    raw.match(/```\s*([\s\S]*?)\s*```/i) ||
    raw.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1] ?? jsonMatch[0]);
      return {
        powerScore: coerceNum(parsed.powerScore),
        gravityScore: coerceNum(parsed.gravityScore),
        riskScore: coerceNum(parsed.riskScore),
        confidence: coerceNum(parsed.confidence),
        tldr: coerceStr(parsed.tldr),
        whatsHappening: coerceStr(parsed.whatsHappening),
        whyItMatters: coerceStr(parsed.whyItMatters),
        narrativeSummary: coerceStr(parsed.narrativeSummary),
        actionItems: Array.isArray(parsed.actionItems)
          ? parsed.actionItems.map((it: any, i: number) => ({
              text: coerceStr(it?.text) ?? '',
              section: it?.section ?? null,
              step_index: typeof it?.step_index === 'number' ? it.step_index : i,
            }))
          : [],
        rawText: raw,
      };
    } catch {
      // Fall through to heuristic parse below
    }
  }

  // Heuristic fallback if no clean JSON detected
  const tldr = pickLine(raw, /(?:^|\n)tl;?dr[:\-]\s*(.+)/i);
  const whats = pickLine(raw, /(?:^|\n)what'?s?\s+happening[:\-]\s*(.+)/i);
  const why = pickLine(raw, /(?:^|\n)why\s+it\s+matters[:\-]\s*(.+)/i);
  const summary = pickLine(raw, /(?:^|\n)narrative\s+summary[:\-]\s*(.+)/i);

  const items: RadarActionItem[] = [];
  const actionBlock = raw.split(/action\s+items[:\-]/i)[1];
  if (actionBlock) {
    actionBlock
      .split(/\n/)
      .map((s) => s.trim())
      .filter((s) => s && /^[\-\*\d\.]/.test(s))
      .forEach((line, idx) => {
        const txt = line.replace(/^[\-\*\d\.\s]+/, '').trim();
        if (txt) items.push({ text: txt, step_index: idx });
      });
  }

  return {
    powerScore: null,
    gravityScore: null,
    riskScore: null,
    confidence: null,
    tldr: tldr ?? null,
    whatsHappening: whats ?? null,
    whyItMatters: why ?? null,
    narrativeSummary: summary ?? null,
    actionItems: items,
    rawText: raw,
  };
}

function coerceNum(v: any): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function coerceStr(v: any): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function pickLine(text: string, re: RegExp): string | null {
  const m = text.match(re);
  return m?.[1]?.trim() ?? null;
}

// ----------------------
// Public API
// ----------------------

/**
 * Main orchestrator called by /api/analyze.ts
 * - Optionally uploads files to a vector store
 * - Runs via Assistant (if OPENAI_ASSISTANT_ID is set), otherwise Chat fallback
 * - Returns a normalized RadarResult
 */
export async function runRadarServer(args: {
  inputText: string;
  files?: ServerAttachment[]; // optional
}): Promise<RadarResult> {
  const prompt = args.inputText?.trim() ?? '';
  const files = args.files ?? [];

  if (!prompt) {
    console.warn('[radar] runRadarServer called with empty input');
    return {
      powerScore: null,
      gravityScore: null,
      riskScore: null,
      confidence: null,
      tldr: 'No input provided.',
      whatsHappening: null,
      whyItMatters: null,
      narrativeSummary: null,
      actionItems: [],
      rawText: null,
    };
  }

  // Prefer Assistants if configured (gives you tool and vector-store features)
  if (process.env.OPENAI_ASSISTANT_ID) {
    console.log('[radar] → Using Assistants API path');
    return await runWithAssistant(prompt, files);
  }

  // Otherwise, use a simple chat completion (fast & reliable)
  console.log('[radar] → Using Chat API fallback path');
  return await runWithChat(prompt);
}
