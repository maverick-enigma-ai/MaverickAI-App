// services/runradar-service.ts
// ESM-safe, Vercel-ready. No `require()` anywhere.


import OpenAI from 'openai';

// TEMP: verify SDK version in Vercel
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import openaiPkg from 'openai/package.json' assert { type: 'json' };
console.log('OpenAI SDK version at runtime:', openaiPkg.version);


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
  return { vectorStoreId: store.id as string };
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

  if (!assistantId) {
    // No assistant configured; fall back to chat.
    return runWithChat(prompt);
  }

  const { vectorStoreId } = await uploadToVectorStore(files);

  // 1) Create an empty thread
  const thread = await client.beta.threads.create();
  const thread_id: string = thread.id;

  // 2) Thread with user's prompt
  await client.beta.threads.messages.create({
    thread_id,
    role: 'user',
    content: prompt,
  });

  // 3) Start the run (use explicit object signature)
  const run = await client.beta.threads.runs.create({
    thread_id,
    assistant_id: assistantId,
    ...(vectorStoreId
      ? {
          tool_resources: {
            file_search: { vector_store_ids: [vectorStoreId] },
          },
        }
      : {}),
  });
  const run_id: string = run.id;

  // 4) Poll until completed (explicit object signature)
  const start = Date.now();
  const timeoutMs = 90_000;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const current = await client.beta.threads.runs.retrieve({ thread_id, run_id });
    if (current.status === 'completed') break;
    if (current.status === 'failed' || current.status === 'cancelled' || current.status === 'expired') {
      throw new Error(`Assistant run ended with status=${current.status}`);
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error('Assistant run timed out');
    }
    await new Promise(r => setTimeout(r, 1200));
  }

  // 5) Fetch assistant messages (explicit object signature)
  const list = await client.beta.threads.messages.list({ thread_id, limit: 10 });

  const rawText = (list?.data ?? [])
    .filter((m: any) => m.role === 'assistant')
    .map((m: any) =>
      (m.content ?? [])
        .filter((c: any) => c.type === 'text' && c.text?.value)
        .map((c: any) => c.text.value)
        .join('\n')
    )
    .join('\n\n')
    .trim();

  const normalized = normalizeToRadarResult(rawText);
  return { ...normalized, rawText };
}

// ----------------------
// Chat fallback path
// ----------------------

async function runWithChat(prompt: string): Promise<RadarResult> {
  const client = getOpenAIClient();

  // Use a small, cost-effective model capable of structured output
  const resp = await client.chat.completions.create({
    model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are MaverickAI. Analyze the situation and return a concise JSON object with keys: powerScore, gravityScore, riskScore, confidence, tldr, whatsHappening, whyItMatters, narrativeSummary, actionItems (array of {text, section}). Keep numbers 0-100.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  const raw = resp.choices?.[0]?.message?.content ?? '';
  const normalized = normalizeToRadarResult(raw);

  return {
    ...normalized,
    rawText: raw,
  };
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
    // Keep server defensive — upstream code should validate, but avoid an empty call to OpenAI.
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
    return await runWithAssistant(prompt, files);
  }

  // Otherwise, use a simple chat completion (fast & reliable)
  return await runWithChat(prompt);
}
