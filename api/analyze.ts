// api/analyze.ts
// Server route that implements the "submission-first → analysis → completed" flow.

import { createClient } from '@supabase/supabase-js';
import { runRadarServer, type ServerAttachment } from '../services/runradar-service';

type Body = {
  inputText: string;
  userId: string;     // auth.users.id (uuid as string)
  userEmail: string;
  files?: any[];      // ignored in JSON mode unless you pre-upload and pass IDs/URLs
  jobId?: string;
  queryId?: string;
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method && req.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405);
  }

  let analysis_id: string | null = null;
  let job_id: string | null = null;

  try {
    // 0) Parse JWT (for RLS)
    const jwt = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || undefined;

    // 0a) Accept JSON or multipart/form-data
    const contentType = req.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');

    let inputText = '';
    let userId = '';
    let userEmail = '';
    let queryId: string | undefined;
    const serverFiles: ServerAttachment[] = [];

    if (isMultipart) {
      const form = await req.formData();
      inputText = String(form.get('inputText') || '');
      userId = String(form.get('userId') || '');
      userEmail = String(form.get('userEmail') || '');
      queryId = (form.get('queryId') || form.get('jobId')) as string | undefined;

      // Collect attachments
      for (const item of form.getAll('files')) {
        if (item instanceof File) {
          serverFiles.push({
            name: item.name,
            type: item.type || 'application/octet-stream',
            bytes: new Uint8Array(await item.arrayBuffer()),
          });
        }
      }
    } else {
      const body = (await req.json().catch(() => ({} as Body))) as Body;
      inputText = body.inputText || '';
      userId = body.userId || '';
      userEmail = body.userEmail || '';
      queryId = body.queryId || body.jobId;
    }

    job_id = queryId ?? crypto.randomUUID();

    if (!inputText?.trim()) return json({ ok: false, error: 'Missing inputText' }, 400);
    if (!userId)            return json({ ok: false, error: 'Missing userId' }, 400);
    if (!userEmail)         return json({ ok: false, error: 'Missing userEmail' }, 400);

    // Supabase client (RLS via user JWT)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      { global: jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : undefined }
    );

    // 1) Create SUBMISSION first (status=pending)
    {
      const { error } = await supabase.from('submissions').insert({
        analysis_id: null, // important for older generated types
        user_id: userId,
        email: userEmail,
        status: 'pending',
        input_querytext: inputText,
        job_id,
        query_id: job_id, // use job_id for parity
      });
      if (error) throw new Error(`Failed to create submission: ${error.message}`);
    }

    // 2) Flip submission → processing
    {
      const { error } = await supabase
        .from('submissions')
        .update({ status: 'processing', updated_at: new Date().toISOString() })
        .eq('job_id', job_id);
      if (error) throw new Error(`Failed to set submission to processing: ${error.message}`);
    }

    // 3) Create ANALYSIS placeholder
    {
      const { data, error } = await supabase
        .from('analyses')
        .insert({
          user_id: userId,
          email: userEmail,
          input_text: inputText,
          status: 'processing',
          is_ready: false,
          job_id,
          query_id: job_id, // use job_id for parity
          input_querytext: inputText,
          processing_started_at: new Date().toISOString(),
        })
        .select('id')
        .limit(1);

      if (error || !data?.length) throw new Error(`Failed to create analysis: ${error?.message}`);
      analysis_id = data[0].id;
    }

    // 4) Back-fill submission.analysis_id
    {
      const { error } = await supabase
        .from('submissions')
        .update({ analysis_id })
        .eq('job_id', job_id);
      if (error) throw new Error(`Failed to link submission to analysis: ${error.message}`);
    }

    // 5) Run analysis (server-only pipeline; no mocks)
    let result: Awaited<ReturnType<typeof runRadarServer>>;
    try {
      result = await runRadarServer({
        inputText,
        files: serverFiles,
      });
    } catch (e: any) {
      // Mark submission as error early and rethrow
      await supabase
        .from('submissions')
        .update({ status: 'error', updated_at: new Date().toISOString() })
        .eq('job_id', job_id);
      throw e;
    }

    // 6) Update ANALYSIS with results
    {
      const update: any = {
        status: 'completed',
        is_ready: true,
        processing_completed_at: new Date().toISOString(),

        // scores
        power_score: result.powerScore ?? null,
        gravity_score: result.gravityScore ?? null,
        risk_score: result.riskScore ?? null,
        issue_confidence_pct: result.confidence ?? null,

        // diagnoses (names aligned to DB)
        diagnosis_primary: result.diagnosis_primary ?? null,
        diagnosis_secondary: result.diagnosis_secondary ?? null,
        diagnosis_tertiary: result.diagnosis_tertiary ?? null,

        // narrative
        summary: result.tldr ?? null,
        tl_dr: result.tldr ?? null,
        whats_happening: result.whatsHappening ?? null,
        why_it_matters: result.whyItMatters ?? null,
        narrative_summary: result.narrativeSummary ?? null,
        immediate_move: result.immediateMove ?? null,
        strategic_tool: result.strategicTool ?? null,
        analytical_check: result.analyticalCheck ?? null,
        long_term_fix: result.longTermFix ?? null,

        // explanations (DB columns are *_expl)
        power_expl: result.powerExplanation ?? null,
        gravity_expl: result.gravityExplanation ?? null,
        risk_expl: result.riskExplanation ?? null,

        // radar
        radar_control: result.radar?.control ?? null,
        radar_gravity: result.radar?.gravity ?? null,
        radar_confidence: result.radar?.confidence ?? null,
        radar_stability: result.radar?.stability ?? null,
        radar_strategy: result.radar?.strategy ?? null,
        radar_red_1: result.radar_red_1 ?? null,
        radar_red_2: result.radar_red_2 ?? null,
        radar_red_3: result.radar_red_3 ?? null,

        // profile
        psychological_profile: result.psychologicalProfile ?? null,

        // visuals (optional if present)
        radar_url: result.radarUrl ?? null,
        chart_html: result.chartHtml ?? null,
        tugofwar_html: result.tugOfWarHtml ?? null,
        radar_html: result.radarHtml ?? null,
        risk_html: result.riskHtml ?? null,
      };

      const { error } = await supabase.from('analyses').update(update).eq('id', analysis_id!);
      if (error) throw new Error(`Failed to update analysis: ${error.message}`);
    }

    // 7) Insert ACTION ITEMS (if any)
    if (Array.isArray(result.actionItems) && result.actionItems.length > 0) {
      const allowed = new Set(['immediate_move','strategic_tool','analytical_check','long_term_fix']);
      const payload = result.actionItems
        .filter((ai) => allowed.has(ai.section))
        .map((ai, idx) => ({
          analysis_id: analysis_id!,
          user_id: userId,
          section: ai.section,
          step_index: idx,
          step_text: ai.text,
          completed: false,
        }));

      const { error } = await supabase.from('action_items').insert(payload);
      if (error) console.error('Failed to insert action_items:', error);
    }

    // 8) Mark SUBMISSION → completed
    {
      const { error } = await supabase
        .from('submissions')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('job_id', job_id);
      if (error) throw new Error(`Failed to set submission to completed: ${error.message}`);
    }

    // 9) Return essentials (UI reads analysis from Supabase)
    return json({
      ok: true,
      jobId: job_id,
      analysisId: analysis_id,
    });
  } catch (err: any) {
    console.error('analyze.ts error:', err?.message || err);

    // Best-effort error recording
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
      );
      if (analysis_id) {
        await supabase
          .from('analyses')
          .update({
            status: 'error',
            is_ready: false,
            error_json: { message: String(err?.message || err) } as any,
          })
          .eq('id', analysis_id);
      }
      if (job_id) {
        await supabase
          .from('submissions')
          .update({ status: 'error', updated_at: new Date().toISOString() })
          .eq('job_id', job_id);
      }
    } catch (e) {
      console.error('failed to persist error state:', e);
    }

    return json({ ok: false, error: String(err?.message || err), jobId: job_id, analysisId: analysis_id }, 500);
  }
}

/** tiny helper */
function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
