import "./chunk-3RG5ZIWI.js";

// utils/supabase/client.ts
import { createClient } from "@supabase/supabase-js";
var SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://aoedthlhvpxvxahpvnwy.supabase.co";
var SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
var supabaseInstance = null;
function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }
  return supabaseInstance;
}
var supabase = getSupabaseClient();

// services/action-items-service.ts
async function loadActionItemsForAnalysis(analysisId) {
  const { data, error } = await supabase.from("action_items").select("*").eq("analysis_id", analysisId).order("section", { ascending: true }).order("step_index", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}
async function toggleActionItem(id, completed) {
  const { error } = await supabase.from("action_items").update({ completed, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}
async function updateOverallCompletion(analysisId, pct) {
  try {
    const { error } = await supabase.from("analyses").update({
      overall_completion: Math.max(0, Math.min(100, Math.round(pct))),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", analysisId);
    if (error) {
      const m = (error.message || "").toLowerCase();
      if (m.includes("column") && m.includes("overall_completion")) {
        console.warn("[overall_completion] column not found \u2014 skipping save. Create it when ready.");
        return;
      }
      console.error("updateOverallCompletion error:", error);
    }
  } catch (e) {
    console.error("updateOverallCompletion exception:", e);
  }
}
function completionBySection(items) {
  const sections = [
    "immediate_move",
    "strategic_tool",
    "analytical_check",
    "long_term_fix"
  ];
  const out = {
    immediate_move: 0,
    strategic_tool: 0,
    analytical_check: 0,
    long_term_fix: 0
  };
  for (const sec of sections) {
    const subset = items.filter((i) => i.section === sec);
    if (subset.length === 0) {
      out[sec] = 0;
      continue;
    }
    const done = subset.filter((i) => i.completed).length;
    out[sec] = Math.round(done / subset.length * 100);
  }
  return out;
}
export {
  completionBySection,
  loadActionItemsForAnalysis,
  toggleActionItem,
  updateOverallCompletion
};
