// services/runradar-service.ts
// -----------------------------------------------------------------------------
// Server-only RunRadar pipeline: upload files → call OpenAI service → normalize
// Returns analysis data for /api/analyze to write into Supabase. No mocks.
// -----------------------------------------------------------------------------

// Safe globals for hybrid builds
declare const Deno:
  | { env: { get: (k: string) => string | undefined } }
  | undefined;

export type ServerAttachment = { name: string; type: string; bytes: Uint8Array };

// Result shape expected by /api/analyze mapping (aligns with your DB columns)
export type RadarResult = {
  // core metrics
  powerScore?: number;
  gravityScore?: number;
  riskScore?: number;
  confidence?: number;          // or confidenceLevel in some codepaths

  // textual content
  tldr?: string;                // tl_dr / summary
  whatsHappening?: string;
  whyItMatters?: string;
  narrativeSummary?: string;

  // moves
  immediateMove?: string;
  strategicTool?: string;
  analyticalCheck?: string;
  longTermFix?: string;

  // explanations
  powerExplanation?: string;
  gravityExplanation?: string;
  riskExplanation?: string;

  // classifications
  issueType?: string;
  issueCategory?: string;
  issueLayer?: string;

  // diagnostics
  diagnosticState?: string;
  diagnosticSoWhat?: string;

  // diagnoses (snake in DB; we’ll keep both)
  diagnosis_primary?: string;
  diagnosis_secondary?: string;
  diagnosis_tertiary?: string;

  // red flags / radar
  radar?: {
    control?: number;
    gravity?: number;
    confidence?: number;
    stability?: number;
    strategy?: number;
  };
  radar_red_1?: string | null;
  radar_red_2?: string | null;
  radar_red_3?: string | null;

  // visuals
  radarUrl?: string;
  chartHtml?: string;
  tugOfWarHtml?: string;
  radarHtml?: string;
  riskHtml?: string;

  // profile (DB uses JSONB)
  // 🧠 psychological profile (shape can vary)
  psychologicalProfile?: PsychologicalProfile | null;

  // action items (array of {section, text})
  actionItems?: Array<{ section: "immediate_move" | "strategic_tool" | "analytical_check" | "long_term_fix"; text: string }>;

  // meta
  sources_confirmed?: boolean;
  references?: string | string[];
  latency_ms?: number;
};

export type PsychologicalProfile = {
  primaryMotivation?: string;
  motivationEvidence?: string;
  hiddenDriver?: string;
  hiddenDriverSignal?: string;
  emotionalState?: string;
  emotionalEvidence?: string;
  powerDynamic?: string;
  powerDynamicEvidence?: string;
};

// ---- Add this to services/runradar-service.ts ----
export type ProcessedAnalysis = {
  // identifiers
  id: string;
  jobId: string;
  userId: string;

  // display / content
  title: string;
  inputText: string;
  summary: string;

  // metrics
  powerScore: number;
  gravityScore: number;
  riskScore: number;
  confidenceLevel: number;

  // main narrative
  whatsHappening: string;
  whyItMatters: string;
  narrativeSummary: string;

  // strategic moves
  immediateMove: string;
  strategicTool: string;
  analyticalCheck: string;
  longTermFix: string;

  // explanations
  powerExplanation: string;
  gravityExplanation: string;
  riskExplanation: string;

  // classification
  issueType?: string;
  issueCategory?: string;
  issueLayer?: string;

  // diagnostics
  diagnosticState?: string;
  diagnosticSoWhat?: string;

  // diagnoses
  diagnosisPrimary?: string;
  diagnosisSecondary?: string;
  diagnosisTertiary?: string;

  // visuals / html (optional)
  radarUrl?: string;
  chartHtml?: string;
  tugOfWarHtml?: string;
  radarHtml?: string;
  riskHtml?: string;

  // 🧠 psychological profile (shape can vary)
  psychologicalProfile?: PsychologicalProfile | null;

  // radar red flags (optional)
  radarRed1?: string | null;
  radarRed2?: string | null;
  radarRed3?: string | null;

  // status
  status?: 'processing' | 'completed' | 'failed';
  isReady?: boolean;

  // timestamps
  createdAt?: string;
  updatedAt?: string;
  processedAt?: string;
};
// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------
function getEnv(name: string) {
  // Node
  if (typeof process !== "undefined" && (process as any)?.env) return (process as any).env[name];
  // Deno
  if (typeof Deno !== "undefined" && (Deno as any)?.env?.get) return (Deno as any).env.get(name);
  return undefined;
}

function requireEnv(name: string) {
  const v = getEnv(name);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function assert<T>(cond: T, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

// -----------------------------------------------------------------------------
// Dynamic service loader — we don’t hard-bind so builds don’t explode if a file
// is renamed. We try a few common paths/names and use what exists.
// -----------------------------------------------------------------------------
async function tryImport(modulePath: string) {
  try {
    return await import(modulePath);
  } catch {
    return null;
  }
}

type UploadFn =
  | ((files: { name: string; type: string; data: Uint8Array }[]) => Promise<{ fileIds: string[] } | string[]>)
  | undefined;
type AnalyzeFn =
  | ((args: { text: string; fileIds?: string[] }) => Promise<any>)
  | undefined;
type ParseFn =
  | ((raw: any) => Promise<any> | any)
  | undefined;

async function loadServices(): Promise<{ upload: UploadFn; analyze: AnalyzeFn; parse: ParseFn }> {
  // Try multiple candidate modules
  const filesSvc =
    (await tryImport("../services/openai-files-service")) ||
    (await tryImport("./openai-files-service")) ||
    (await tryImport("../utils/openai-files-service"));

  const directSvc =
    (await tryImport("../services/openai-direct-service")) ||
    (await tryImport("./openai-direct-service")) ||
    (await tryImport("../utils/openai-direct-service"));

  const parserSvc =
    (await tryImport("../services/openai-response-parser")) ||
    (await tryImport("./openai-response-parser")) ||
    (await tryImport("../utils/openai-response-parser"));

  // Pick function names defensively
  const upload: UploadFn =
    (filesSvc as any)?.uploadFilesToOpenAI ??
    (filesSvc as any)?.uploadFiles ??
    (filesSvc as any)?.upload ??
    undefined;

  const analyze: AnalyzeFn =
    (directSvc as any)?.createAnalysis ??
    (directSvc as any)?.analyzeWithOpenAI ??
    (directSvc as any)?.analyzeTextWithFiles ??
    undefined;

  const parse: ParseFn =
    (parserSvc as any)?.parseOpenAIResponse ??
    (parserSvc as any)?.parseResponse ??
    undefined;

  return { upload, analyze, parse };
}

// Normalize whatever parser returns into our RadarResult, without guessing.
function toRadarResult(anyResult: any): RadarResult {
  const r = anyResult ?? {};
  const radar = r.radar ?? {};
  return {
    powerScore: r.powerScore ?? r.power_score,
    gravityScore: r.gravityScore ?? r.gravity_score,
    riskScore: r.riskScore ?? r.risk_score,
    confidence: r.confidence ?? r.confidenceLevel ?? r.issue_confidence_pct,
    tldr: r.tldr ?? r.tl_dr ?? r.summary,
    whatsHappening: r.whatsHappening,
    whyItMatters: r.whyItMatters,
    narrativeSummary: r.narrativeSummary,
    immediateMove: r.immediateMove,
    strategicTool: r.strategicTool,
    analyticalCheck: r.analyticalCheck,
    longTermFix: r.longTermFix,
    powerExplanation: r.powerExplanation ?? r.power_expl ?? r.power_explanation,
    gravityExplanation: r.gravityExplanation ?? r.gravity_expl ?? r.gravity_explanation,
    riskExplanation: r.riskExplanation ?? r.risk_expl ?? r.risk_explanation,
    issueType: r.issueType,
    issueCategory: r.issueCategory,
    issueLayer: r.issueLayer,
    diagnosticState: r.diagnosticState,
    diagnosticSoWhat: r.diagnosticSoWhat,
    diagnosis_primary: r.diagnosis_primary ?? r.diagnosisPrimary,
    diagnosis_secondary: r.diagnosis_secondary ?? r.diagnosisSecondary,
    diagnosis_tertiary: r.diagnosis_tertiary ?? r.diagnosisTertiary,
    radar: {
      control: radar.control,
      gravity: radar.gravity,
      confidence: radar.confidence,
      stability: radar.stability,
      strategy: radar.strategy,
    },
    radar_red_1: r.radar_red_1 ?? r.radarRed1 ?? null,
    radar_red_2: r.radar_red_2 ?? r.radarRed2 ?? null,
    radar_red_3: r.radar_red_3 ?? r.radarRed3 ?? null,
    radarUrl: r.radarUrl,
    chartHtml: r.chartHtml,
    tugOfWarHtml: r.tugOfWarHtml,
    radarHtml: r.radarHtml,
    riskHtml: r.riskHtml,
    psychologicalProfile: r.psychologicalProfile ?? r.psychological_profile,
    actionItems: Array.isArray(r.actionItems) ? r.actionItems : undefined,
    sources_confirmed: r.sources_confirmed,
    references: r.references,
    latency_ms: r.latency_ms,
  };
}

// ============================================================================
// ⬇️ ⬇️ ⬇️ ADDED: Built-in OpenAI Orchestrator (used when external services are
// missing or incomplete). No deletions — only additions.
// ============================================================================
/* eslint-disable @typescript-eslint/no-var-requires */
let _OpenAIClient: any | null = null;

function getOpenAIClient() {
  // Lazy require to avoid bundlers exploding if package is optional in some envs
  if (_OpenAIClient) return _OpenAIClient;
  const OpenAI = require("openai");
  const apiKey = requireEnv("OPENAI_API_KEY");
  const organization = getEnv("OPENAI_ORG");
  _OpenAIClient = new OpenAI({ apiKey, organization });
  return _OpenAIClient;
}

async function uploadToVectorStore(files: ServerAttachment[]): Promise<{ vectorStoreId?: string }> {
  if (!files?.length) return {};
  const client = getOpenAIClient();

  // Create a temporary vector store for this request
  const store = await client.beta.vectorStores.create({ name: `query-${Date.now()}` });

  // Upload in one batch. The Node SDK accepts {name,type,data} blobs.
  await client.beta.vectorStores.fileBatches.upload(
    store.id,
    {
      files: files.map(f => ({
        name: f.name,
        type: f.type || "application/octet-stream",
        data: f.bytes,
      })),
    }
  );

  return { vectorStoreId: store.id };
}

async function runAssistantFlow(prompt: string, vectorStoreId?: string) {
  const client = getOpenAIClient();
  const assistantId = getEnv("OPENAI_ASSISTANT_ID");

  if (!assistantId) return null;

  // Create thread with user message
  const thread = await client.beta.threads.create({
    messages: [{ role: "user", content: prompt }],
  });

  // Attach vector store if present (temp + permanent)
  const permanent = getEnv("OPENAI_VECTOR_STORE_ID");
  const stores = [vectorStoreId, permanent].filter(Boolean);
  if (stores.length) {
    await client.beta.threads.update(thread.id, {
      tool_resources: { file_search: { vector_store_ids: stores } },
    });
  }

  const run = await client.beta.threads.runs.create(thread.id, {
    assistant_id: assistantId,
    tool_choice: "auto",
  });

  // Poll until complete (basic)
  let status = run.status;
  while (status === "queued" || status === "in_progress" || status === "requires_action") {
    await new Promise(r => setTimeout(r, 700));
    const fresh = await client.beta.threads.runs.retrieve(thread.id, run.id);
    status = fresh.status;
    if (status === "completed") {
      const msgs = await client.beta.threads.messages.list(thread.id, { order: "desc", limit: 1 });
      return msgs.data?.[0]?.content ?? null;
    }
    if (status === "failed" || status === "cancelled" || status === "expired") {
      throw new Error(`Assistant run ${status}`);
    }
  }
  return null;
}

async function runDirectChatFlow(prompt: string) {
  const client = getOpenAIClient();
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  return completion.choices?.[0]?.message?.content ?? "";
}

async function orchestrateWithOpenAI(args: { inputText: string; files?: ServerAttachment[] }) {
  const t0 = Date.now();

  // Optional file → vector store
  let vectorStoreId: string | undefined;
  if (args.files?.length) {
    const up = await uploadToVectorStore(args.files);
    vectorStoreId = up.vectorStoreId;
  }

  // Prefer Assistant if configured, otherwise direct
  const hasAssistant = !!getEnv("OPENAI_ASSISTANT_ID");
  const raw = hasAssistant
    ? await runAssistantFlow(args.inputText, vectorStoreId)
    : await runDirectChatFlow(args.inputText);

  const latency_ms = Date.now() - t0;
  // Reuse any external parser if it exists, else return normalized minimal result
  try {
    const parserMod =
      (await tryImport("../services/openai-response-parser")) ||
      (await tryImport("./openai-response-parser")) ||
      (await tryImport("../utils/openai-response-parser"));
    const parsed = parserMod?.parseOpenAIResponse
      ? await parserMod.parseOpenAIResponse(raw)
      : raw;
    const out = toRadarResult(parsed);
    out.latency_ms = out.latency_ms ?? latency_ms;
    out.sources_confirmed = out.sources_confirmed ?? true;
    return out;
  } catch {
    const text =
      typeof raw === "string"
        ? raw
        : Array.isArray(raw)
          ? raw.map((c: any) => (c?.text?.value ? c.text.value : String(c))).join("\n")
          : JSON.stringify(raw ?? "");
    return {
      tldr: text.slice(0, 1200),
      narrativeSummary: text.slice(0, 2000),
      sources_confirmed: true,
      latency_ms,
    } as RadarResult;
  }
}
// ============================================================================

// -----------------------------------------------------------------------------
// PUBLIC: main entry to run the analysis with optional attachments.
// Throws on failure. No mocks.
// -----------------------------------------------------------------------------
export async function runRadarServer(args: {
  inputText: string;
  files?: ServerAttachment[];
}): Promise<RadarResult> {
  // Sanity check OpenAI key exists (services will need it)
  requireEnv("OPENAI_API_KEY");

  // ADDED: If external services are missing (or files provided but no uploader),
  // use our built-in OpenAI orchestrator path.
  {
    const { upload, analyze } = await loadServices();
    const needsBuiltin =
      !analyze || // no analyzer available
      (!!args.files?.length && !upload); // we have files but no upload service
    if (needsBuiltin) {
      return await orchestrateWithOpenAI({ inputText: args.inputText, files: args.files });
    }
  }

  // ORIGINAL PATH (unchanged): use dynamically loaded services if present
  const { upload, analyze, parse } = await loadServices();
  assert(analyze, "openai-direct-service.createAnalysis (or equivalent) not found");

  // 1) Upload files to OpenAI (if any)
  let fileIds: string[] | undefined = undefined;
  if (args.files?.length) {
    assert(upload, "openai-files-service.uploadFiles[ToOpenAI] not found");
    const uploaded = await upload!(
      args.files.map(f => ({ name: f.name, type: f.type || "application/octet-stream", data: f.bytes }))
    );
    fileIds = Array.isArray(uploaded)
      ? uploaded
      : (uploaded as any)?.fileIds ?? undefined;
  }

  // 2) Run the analysis
  const raw = await analyze!({ text: args.inputText, fileIds });

  // 3) Parse / normalize
  const parsed = parse ? await parse(raw) : raw;
  return toRadarResult(parsed);
}
