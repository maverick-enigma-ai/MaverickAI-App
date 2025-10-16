/**
 * 🎯 DATABASE ADAPTER (Supabase)
 * - Returns Dashboard-friendly ProcessedAnalysis objects
 * - Maps snake_case DB rows → camelCase UI fields (incl. psychologicalProfile)
 */

import { supabase } from '../supabase/client';
import type { ProcessedAnalysis } from '../types/runradar-api.ts';

export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Map a raw Supabase analyses row → ProcessedAnalysis for the Dashboard */
function rowToProcessed(a: any): ProcessedAnalysis {
  const p = a?.psychological_profile || null;

  return {
    // Identifiers
    id: a.id,
    jobId: a.job_id ?? a.query_id ?? a.id,
    userId: a.user_id,

    // Display
    title: a.tl_dr || a.input_querytext?.slice(0, 60) || 'Analysis',
    inputText: a.input_querytext || '',
    summary: a.tl_dr || '',

    // Metrics
    powerScore: Number(a.power_score ?? a.radar_power ?? 0),
    gravityScore: Number(a.gravity_score ?? a.radar_gravity ?? 0),
    riskScore: Number(a.risk_score ?? a.radar_risk ?? 0),
    confidenceLevel: Number(a.confidence_level ?? a.issue_confidence_pct ?? 0),

    // Content
    whatsHappening: a.whats_happening || '',
    whyItMatters: a.why_it_matters || '',
    narrativeSummary: a.narrative_summary || '',

    // Moves
    immediateMove: a.immediate_move || '',
    strategicTool: a.strategic_tool || '',
    analyticalCheck: a.analytical_check || '',
    longTermFix: a.long_term_fix || '',

    // Explanations (support legacy *_expl as fallback)
    powerExplanation: a.power_explanation ?? a.power_expl ?? '',
    gravityExplanation: a.gravity_explanation ?? a.gravity_expl ?? '',
    riskExplanation: a.risk_explanation ?? a.risk_expl ?? '',

    // Classifications
    issueType: a.issue_type || '',
    issueCategory: a.issue_category || '',
    issueLayer: a.issue_layer || '',

    // Diagnostics
    diagnosticState: a.diagnostic_state || '',
    diagnosticSoWhat: a.diagnostic_so_what || '',

    // 🧠 Psychological profile (JSONB → camelCase)
    psychologicalProfile: p
      ? {
          primaryMotivation: p.primary_motivation || '',
          motivationEvidence: p.motivation_evidence || '',
          hiddenDriver: p.hidden_driver || '',
          hiddenDriverSignal: p.hidden_driver_signal || '',
          emotionalState: p.emotional_state || '',
          emotionalEvidence: p.emotional_evidence || '',
          powerDynamic: p.power_dynamic || '',
          powerDynamicEvidence: p.power_dynamic_evidence || '',
        }
      : null,

    // Diagnoses
    diagnosisPrimary: a.diagnosis_primary || '',
    diagnosisSecondary: a.diagnosis_secondary || '',
    diagnosisTertiary: a.diagnosis_tertiary || '',

    // Red flags + visuals (optional)
    radarRed1: a.radar_red_1 || null,
    radarRed2: a.radar_red_2 || null,
    radarRed3: a.radar_red_3 || null,
    tacticalMoves: a.tactical_moves || '',

    radarUrl: a.radar_url || undefined,
    chartHtml: a.chart_html || undefined,
    tugOfWarHtml: a.tugofwar_html || undefined,
    radarHtml: a.radar_html || undefined,
    riskHtml: a.risk_html || undefined,

    // Status
    status: (a.status as 'processing' | 'completed' | 'failed') ?? 'completed',
    isReady: !!a.is_ready,

    // Timestamps
    createdAt: a.created_at,
    updatedAt: a.updated_at,
    processedAt: a.processing_completed_at || undefined,
  };
}

class DatabaseAdapter {
  /** Get a single analysis as a ProcessedAnalysis (for Dashboard) */
  async getAnalysisById(id: string): Promise<DatabaseResult<ProcessedAnalysis>> {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return { success: false, error: error.message };
      if (!data) return { success: false, error: 'Not found' };

      return { success: true, data: rowToProcessed(data) };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  /** Get all analyses for a user (newest first) as ProcessedAnalysis[] */
  async getAnalysesByUserId(
    userId: string
  ): Promise<DatabaseResult<ProcessedAnalysis[]>> {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return { success: false, error: error.message };

      const normalized = (data || []).map(rowToProcessed);
      return { success: true, data: normalized };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  /** Create submission row (nullable analysis_id supported) */
  async createSubmission(payload: any): Promise<DatabaseResult<any>> {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert(payload)
        .select()
        .single();
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  /** Update a submission by job_id or analysis_id */
  async updateSubmissionByJobId(jobId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('job_id', jobId)
        .select()
        .single();
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  /** Get user payment plan (defaults to free) */
  async getUserPaymentPlan(userId: string): Promise<DatabaseResult<string>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('payment_plan')
        .eq('id', userId)
        .single();

      if (error || !data) return { success: true, data: 'free' };
      return { success: true, data: data.payment_plan || 'free' };
    } catch {
      return { success: true, data: 'free' };
    }
  }
}

export const db = new DatabaseAdapter();
