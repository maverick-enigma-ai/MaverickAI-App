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
  if (typeof process !== "undefined" && process?.env) return process.env[name];
  // Deno
  if (typeof Deno !== "undefined" && Deno?.env?.get) return Deno.env.get(name);
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
    filesSvc?.uploadFilesToOpenAI ??
    filesSvc?.uploadFiles ??
    filesSvc?.upload ??
    undefined;

  const analyze: AnalyzeFn =
    directSvc?.createAnalysis ??
    directSvc?.analyzeWithOpenAI ??
    directSvc?.analyzeTextWithFiles ??
    undefined;

  const parse: ParseFn =
    parserSvc?.parseOpenAIResponse ??
    parserSvc?.parseResponse ??
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
