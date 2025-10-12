/**
 * Action Items Service
 * Manages completion tracking for strategic action steps
 */

import { getSupabaseClient } from '../utils/supabase/client';

export interface ActionItem {
  id: string;
  analysis_id: string;
  user_id: string;
  section: 'immediate_move' | 'strategic_tool' | 'analytical_check' | 'long_term_fix';
  step_index: number;
  step_text: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActionItemCreate {
  analysis_id: string;
  user_id: string;
  section: 'immediate_move' | 'strategic_tool' | 'analytical_check' | 'long_term_fix';
  step_index: number;
  step_text: string;
}

export interface SectionCompletion {
  section: string;
  total: number;
  completed: number;
  percentage: number;
}

/**
 * Parse text into actionable steps
 */
export function parseActionSteps(text: string): string[] {
  if (!text) return [];
  
  // Split by newlines
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  
  // Clean up bullet markers and numbering
  return lines.map(line => {
    // Remove bullets, numbers, dashes
    return line.replace(/^[•\-\*\d+\.)\]]\s*/, '').trim();
  }).filter(line => line.length > 0);
}

/**
 * Get action items for an analysis
 */
export async function getActionItems(analysisId: string): Promise<ActionItem[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('action_items')
    .select('*')
    .eq('analysis_id', analysisId)
    .order('section')
    .order('step_index');
  
  if (error) {
    console.error('Error fetching action items:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Create action items for an analysis
 */
export async function createActionItems(items: ActionItemCreate[]): Promise<ActionItem[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('action_items')
    .insert(items)
    .select();
  
  if (error) {
    console.error('Error creating action items:', error);
    throw error;
  }
  
  return data || [];
}

/**
 * Toggle action item completion
 */
export async function toggleActionItem(itemId: string, completed: boolean): Promise<void> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('action_items')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null
    })
    .eq('id', itemId);
  
  if (error) {
    console.error('Error toggling action item:', error);
    throw error;
  }
}

/**
 * Calculate completion percentage for each section
 */
export function calculateSectionCompletion(items: ActionItem[]): SectionCompletion[] {
  const sections = ['immediate_move', 'strategic_tool', 'analytical_check', 'long_term_fix'];
  
  return sections.map(section => {
    const sectionItems = items.filter(item => item.section === section);
    const total = sectionItems.length;
    const completed = sectionItems.filter(item => item.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      section,
      total,
      completed,
      percentage
    };
  });
}

/**
 * Initialize action items for a new analysis
 */
export async function initializeActionItems(
  analysisId: string,
  userId: string,
  strategicMoves: {
    immediateMove?: string;
    strategicTool?: string;
    analyticalCheck?: string;
    longTermFix?: string;
  }
): Promise<void> {
  const items: ActionItemCreate[] = [];
  
  // Parse each section
  if (strategicMoves.immediateMove) {
    const steps = parseActionSteps(strategicMoves.immediateMove);
    steps.forEach((step, index) => {
      items.push({
        analysis_id: analysisId,
        user_id: userId,
        section: 'immediate_move',
        step_index: index,
        step_text: step
      });
    });
  }
  
  if (strategicMoves.strategicTool) {
    const steps = parseActionSteps(strategicMoves.strategicTool);
    steps.forEach((step, index) => {
      items.push({
        analysis_id: analysisId,
        user_id: userId,
        section: 'strategic_tool',
        step_index: index,
        step_text: step
      });
    });
  }
  
  if (strategicMoves.analyticalCheck) {
    const steps = parseActionSteps(strategicMoves.analyticalCheck);
    steps.forEach((step, index) => {
      items.push({
        analysis_id: analysisId,
        user_id: userId,
        section: 'analytical_check',
        step_index: index,
        step_text: step
      });
    });
  }
  
  if (strategicMoves.longTermFix) {
    const steps = parseActionSteps(strategicMoves.longTermFix);
    steps.forEach((step, index) => {
      items.push({
        analysis_id: analysisId,
        user_id: userId,
        section: 'long_term_fix',
        step_index: index,
        step_text: step
      });
    });
  }
  
  // Create all items
  if (items.length > 0) {
    await createActionItems(items);
  }
}

/**
 * Get overall completion percentage
 */
export function getOverallCompletion(items: ActionItem[]): number {
  if (items.length === 0) return 0;
  const completed = items.filter(item => item.completed).length;
  return Math.round((completed / items.length) * 100);
}
