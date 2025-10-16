// runradar-api.ts
// -----------------------------------------------------------------------------
// Unified RunRadar API helper for /api/analyze and Dashboard integration.
// Produces normalized results compatible with Database + Dashboard components.
// -----------------------------------------------------------------------------

export type RadarResult = {
  // Core metrics
  powerScore: number;
  gravityScore: number;
  riskScore: number;
  confidence: number;

  // Summary + content
  tldr: string;
  whatsHappening: string;
  whyItMatters: string;
  narrativeSummary: string;

  // Strategic moves
  immediateMove: string;
  strategicTool: string;
  analyticalCheck: string;
  longTermFix: string;

  // Explanations
  powerExplanation: string;
  gravityExplanation: string;
  riskExplanation: string;

  // Classifications
  issueType: string;
  issueCategory: string;
  issueLayer: string;

  // Diagnostics
  diagnosticState: string;
  diagnosticSoWhat: string;

  // 🧠 Psychological profile
  psychologicalProfile: {
    primary_motivation: string;
    motivation_evidence: string;
    hidden_driver: string;
    hidden_driver_signal: string;
    emotional_state: string;
    emotional_evidence: string;
    power_dynamic: string;
    power_dynamic_evidence: string;
  } | null;

  // 🩺 Diagnoses
  diagnosis_primary: string;
  diagnosis_secondary: string;
  diagnosis_tertiary: string;

  // 🚩 Radar red flags
  radar_red_1: string | null;
  radar_red_2: string | null;
  radar_red_3: string | null;

  // 🧭 Radar values
  radar: {
    control: number;
    gravity: number;
    confidence: number;
    stability: number;
    strategy: number;
  };

  // 📊 Visualizations
  radarUrl?: string;
  chartHtml?: string;
  tugOfWarHtml?: string;
  radarHtml?: string;
  riskHtml?: string;

  // Action items
  actionItems: Array<{
    section: "immediate_move" | "strategic_tool" | "analytical_check" | "long_term_fix";
    text: string;
  }>;

  // Meta
  sources_confirmed?: boolean;
  references?: string;
  latency_ms?: number;
};

// -----------------------------------------------------------------------------
// Core handler (mock implementation — replace with OpenAI or Make.com call)
// -----------------------------------------------------------------------------

export async function runRadar(args: {
  input_querytext: string;
  query_id?: string;
  attachments?: any[];
}): Promise<RadarResult> {
  const { input_querytext } = args;
  console.log("🧠 Running RunRadar analysis on:", input_querytext.slice(0, 100));

  // --- MOCK RESPONSE for build/test ---
  const result: RadarResult = {
    powerScore: 72,
    gravityScore: 63,
    riskScore: 38,
    confidence: 82,

    tldr: "Team power dynamics indicate a subtle control imbalance, masked by cooperative language.",
    whatsHappening:
      "The subject describes recurring tension rooted in influence competition. Polite language conceals status jockeying.",
    whyItMatters:
      "Unchecked, this dynamic erodes trust and decision velocity — especially when authority cues are ambiguous.",
    narrativeSummary:
      "You’re in a classic strategic drift: shared goals, conflicting signals. Influence is shifting beneath verbal alignment.",

    immediateMove: "State expectations explicitly in the next meeting — no emotional charge.",
    strategicTool: "Use the Frame Reversal technique to shift implicit authority.",
    analyticalCheck: "Track tone shifts when you set deadlines or boundaries.",
    longTermFix: "Rebuild equilibrium via mutual visibility, not performance policing.",

    powerExplanation:
      "Power score reflects tactical command but limited narrative control.",
    gravityExplanation:
      "Gravity score shows moderate relational cohesion with emerging resistance.",
    riskExplanation:
      "Risk score highlights latent instability in informal hierarchies.",

    issueType: "Power Dynamic Drift",
    issueCategory: "Team Alignment",
    issueLayer: "Relational / Political",

    diagnosticState: "Influence imbalance emerging",
    diagnosticSoWhat:
      "Power equilibrium deteriorating — early containment advised.",

    psychologicalProfile: {
      primary_motivation: "Recognition",
      motivation_evidence: "Seeks validation via subtle intellectual dominance.",
      hidden_driver: "Fear of irrelevance",
      hidden_driver_signal: "Defensiveness when challenged publicly.",
      emotional_state: "Guarded but attentive",
      emotional_evidence: "High sensitivity to tone and word choice.",
      power_dynamic: "Perceived asymmetry (advisor vs. gatekeeper)",
      power_dynamic_evidence: "Micro-interruptions and reframing mid-conversation.",
    },

    diagnosis_primary: "Frame Containment Failure",
    diagnosis_secondary: "Authority Dilution",
    diagnosis_tertiary: "Psychological Drift",

    radar_red_1: "Over-intellectualization of conflict.",
    radar_red_2: "Emotional suppression under ‘professionalism’.",
    radar_red_3: "Control anxiety disguised as perfectionism.",

    radar: {
      control: 68,
      gravity: 61,
      confidence: 79,
      stability: 72,
      strategy: 65,
    },

    radarUrl: "/images/mock-radar.svg",
    chartHtml: "<div>Radar Mock Chart</div>",
    tugOfWarHtml: "<div>Tug of War Visualization</div>",
    radarHtml: "<div>Radar Visualization</div>",
    riskHtml: "<div>Risk Visualization</div>",

    actionItems: [
      { section: "immediate_move", text: "Define a single decision-owner for each deliverable." },
      { section: "strategic_tool", text: "Run the 3-Minute Diagnostic Challenge weekly." },
    ],

    sources_confirmed: true,
    references: "Internal meeting transcripts; stakeholder interviews.",
    latency_ms: 3500,
  };

  console.log("✅ RunRadar mock result generated successfully");
  return result;
}
