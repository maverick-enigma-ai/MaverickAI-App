import {
  __require
} from "./chunk-3RG5ZIWI.js";

// services/runradar-service.ts
function getEnv(name) {
  if (typeof process !== "undefined" && process?.env) return process.env[name];
  if (typeof Deno !== "undefined" && Deno?.env?.get) return Deno.env.get(name);
  return void 0;
}
function requireEnv(name) {
  const v = getEnv(name);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}
async function tryImport(modulePath) {
  try {
    return await import(modulePath);
  } catch {
    return null;
  }
}
async function loadServices() {
  const filesSvc = await tryImport("../services/openai-files-service") || await tryImport("./openai-files-service") || await tryImport("../utils/openai-files-service");
  const directSvc = await tryImport("../services/openai-direct-service") || await tryImport("./openai-direct-service") || await tryImport("../utils/openai-direct-service");
  const parserSvc = await tryImport("../services/openai-response-parser") || await tryImport("./openai-response-parser") || await tryImport("../utils/openai-response-parser");
  const upload = filesSvc?.uploadFilesToOpenAI ?? filesSvc?.uploadFiles ?? filesSvc?.upload ?? void 0;
  const analyze = directSvc?.createAnalysis ?? directSvc?.analyzeWithOpenAI ?? directSvc?.analyzeTextWithFiles ?? void 0;
  const parse = parserSvc?.parseOpenAIResponse ?? parserSvc?.parseResponse ?? void 0;
  return { upload, analyze, parse };
}
function toRadarResult(anyResult) {
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
      strategy: radar.strategy
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
    actionItems: Array.isArray(r.actionItems) ? r.actionItems : void 0,
    sources_confirmed: r.sources_confirmed,
    references: r.references,
    latency_ms: r.latency_ms
  };
}
var _OpenAIClient = null;
function getOpenAIClient() {
  if (_OpenAIClient) return _OpenAIClient;
  const OpenAI = __require("openai");
  const apiKey = requireEnv("OPENAI_API_KEY");
  const organization = getEnv("OPENAI_ORG");
  _OpenAIClient = new OpenAI({ apiKey, organization });
  return _OpenAIClient;
}
async function uploadToVectorStore(files) {
  if (!files?.length) return {};
  const client = getOpenAIClient();
  const store = await client.beta.vectorStores.create({ name: `query-${Date.now()}` });
  await client.beta.vectorStores.fileBatches.upload(
    store.id,
    {
      files: files.map((f) => ({
        name: f.name,
        type: f.type || "application/octet-stream",
        data: f.bytes
      }))
    }
  );
  return { vectorStoreId: store.id };
}
async function runAssistantFlow(prompt, vectorStoreId) {
  const client = getOpenAIClient();
  const assistantId = getEnv("OPENAI_ASSISTANT_ID");
  if (!assistantId) return null;
  const thread = await client.beta.threads.create({
    messages: [{ role: "user", content: prompt }]
  });
  const permanent = getEnv("OPENAI_VECTOR_STORE_ID");
  const stores = [vectorStoreId, permanent].filter(Boolean);
  if (stores.length) {
    await client.beta.threads.update(thread.id, {
      tool_resources: { file_search: { vector_store_ids: stores } }
    });
  }
  const run = await client.beta.threads.runs.create(thread.id, {
    assistant_id: assistantId,
    tool_choice: "auto"
  });
  let status = run.status;
  while (status === "queued" || status === "in_progress" || status === "requires_action") {
    await new Promise((r) => setTimeout(r, 700));
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
async function runDirectChatFlow(prompt) {
  const client = getOpenAIClient();
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });
  return completion.choices?.[0]?.message?.content ?? "";
}
async function orchestrateWithOpenAI(args) {
  const t0 = Date.now();
  let vectorStoreId;
  if (args.files?.length) {
    const up = await uploadToVectorStore(args.files);
    vectorStoreId = up.vectorStoreId;
  }
  const hasAssistant = !!getEnv("OPENAI_ASSISTANT_ID");
  const raw = hasAssistant ? await runAssistantFlow(args.inputText, vectorStoreId) : await runDirectChatFlow(args.inputText);
  const latency_ms = Date.now() - t0;
  try {
    const parserMod = await tryImport("../services/openai-response-parser") || await tryImport("./openai-response-parser") || await tryImport("../utils/openai-response-parser");
    const parsed = parserMod?.parseOpenAIResponse ? await parserMod.parseOpenAIResponse(raw) : raw;
    const out = toRadarResult(parsed);
    out.latency_ms = out.latency_ms ?? latency_ms;
    out.sources_confirmed = out.sources_confirmed ?? true;
    return out;
  } catch {
    const text = typeof raw === "string" ? raw : Array.isArray(raw) ? raw.map((c) => c?.text?.value ? c.text.value : String(c)).join("\n") : JSON.stringify(raw ?? "");
    return {
      tldr: text.slice(0, 1200),
      narrativeSummary: text.slice(0, 2e3),
      sources_confirmed: true,
      latency_ms
    };
  }
}
async function runRadarServer(args) {
  requireEnv("OPENAI_API_KEY");
  {
    const { upload: upload2, analyze: analyze2 } = await loadServices();
    const needsBuiltin = !analyze2 || // no analyzer available
    !!args.files?.length && !upload2;
    if (needsBuiltin) {
      return await orchestrateWithOpenAI({ inputText: args.inputText, files: args.files });
    }
  }
  const { upload, analyze, parse } = await loadServices();
  assert(analyze, "openai-direct-service.createAnalysis (or equivalent) not found");
  let fileIds = void 0;
  if (args.files?.length) {
    assert(upload, "openai-files-service.uploadFiles[ToOpenAI] not found");
    const uploaded = await upload(
      args.files.map((f) => ({ name: f.name, type: f.type || "application/octet-stream", data: f.bytes }))
    );
    fileIds = Array.isArray(uploaded) ? uploaded : uploaded?.fileIds ?? void 0;
  }
  const raw = await analyze({ text: args.inputText, fileIds });
  const parsed = parse ? await parse(raw) : raw;
  return toRadarResult(parsed);
}
export {
  runRadarServer
};
