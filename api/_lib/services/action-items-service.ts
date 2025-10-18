// services/action-items-service.ts
import { supabase } from '../utils/supabase/client';

export type Section =
  | 'immediate_move'
  | 'strategic_tool'
  | 'analytical_check'
  | 'long_term_fix';

export type ActionItemRow = {
  id: string;
  analysis_id: string;
  user_id: string | null;
  section: Section;
  step_index: number;
  step_text: string;
  completed: boolean;
  created_at: string;
  updated_at: string | null;
};

export async function loadActionItemsForAnalysis(
  analysisId: string
): Promise<ActionItemRow[]> {
  const { data, error } = await supabase
    .from('action_items')
    .select('*')
    .eq('analysis_id', analysisId)
    .order('section', { ascending: true })
    .order('step_index', { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []) as ActionItemRow[];
}

/** Toggle one item and persist */
export async function toggleActionItem(
  id: string,
  completed: boolean
): Promise<void> {
  const { error } = await supabase
    .from('action_items')
    .update({ completed, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

// services/action-items-service.ts
//import { supabase } from '../utils/supabase/client';

/** Save overall completion % onto analyses.overall_completion (0–100). */
export async function updateOverallCompletion(analysisId: string, pct: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('analyses')
      .update({
        overall_completion: Math.max(0, Math.min(100, Math.round(pct))),
        updated_at: new Date().toISOString(),
      })
      .eq('id', analysisId);

    // If the column doesn't exist yet, PostgREST returns a 400 w/ message about column not found.
    // We swallow it so the UI keeps working.
    if (error) {
      const m = (error.message || '').toLowerCase();
      if (m.includes('column') && m.includes('overall_completion')) {
        console.warn('[overall_completion] column not found — skipping save. Create it when ready.');
        return;
      }
      console.error('updateOverallCompletion error:', error);
    }
  } catch (e) {
    console.error('updateOverallCompletion exception:', e);
  }
}

/** Convenience: compute completion % per section */
export function completionBySection(items: ActionItemRow[]): Record<Section, number> {
  const sections: Section[] = [
    'immediate_move',
    'strategic_tool',
    'analytical_check',
    'long_term_fix',
  ];
  const out: Record<Section, number> = {
    immediate_move: 0, strategic_tool: 0, analytical_check: 0, long_term_fix: 0
  };

  for (const sec of sections) {
    const subset = items.filter(i => i.section === sec);
    if (subset.length === 0) { out[sec] = 0; continue; }
    const done = subset.filter(i => i.completed).length;
    out[sec] = Math.round((done / subset.length) * 100);
  }
  return out;
}
