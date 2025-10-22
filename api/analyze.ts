// /api/analyze (Next.js / Vercel serverless compatible)
// Thin wrapper around runradar-service.ts using Supabase anon + caller JWT (RLS-safe)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { runRadarServer } from '../services/runradar-service.js';
import type { RadarResult } from '../services/runradar-service.js';
import { randomUUID as nodeRandomUUID } from 'node:crypto';

// If you're deploying on Edge, you can keep this; otherwise remove it safely.
// export const config = { runtime: 'edge' };

// ---- ENV (anon-only; no service role here) ---------------------------------
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Optional: lock CORS to a single origin (recommended)
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_ORIGIN ?? '*';

// Small helper to generate a job id (Edge/Node safe)
const genJobId = () => {
  // Prefer Web Crypto; Node 18+ also exposes globalThis.crypto
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.randomUUID === 'function'
  ) {
    return globalThis.crypto.randomUUID();
  }
  // Fallback to Node's crypto
  if (typeof nodeRandomUUID === 'function') {
    return nodeRandomUUID();
  }
  // Ultra-fallback (never ideal, but avoids crash)
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

// Minimal CORS helper for preflight & response headers
function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // allow cleanup in catch when submission row already exists
  let jobId: string | undefined;

  try {
    // ---------------------------------------------------------------------------------
    // 1) Auth: use anon client + forward caller JWT so RLS applies as the user
    // ---------------------------------------------------------------------------------
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.authorization ?? '' } },
    });

    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    const authUser = authData.user;

    // ---------------------------------------------------------------------------------
    // 2) Validate input
    // ---------------------------------------------------------------------------------
    const { inputText, files, userEmail } = (req.body ?? {}) as {
      inputText?: string;
      files?: Array<any>;
      userEmail?: string | null;
    };

    if (!inputText || typeof inputText !== 'string' || inputText.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Invalid or missing inputText' });
    }

    // ---------------------------------------------------------------------------------
    // 3) Create submissions row (status = processing)
    // ---------------------------------------------------------------------------------
    jobId = genJobId();
    const nowIso = new Date().toISOString();

    {
      const { error } = await supabase.from('submissions').insert({
        job_id: jobId,
        user_id: authUser.id,
        email: userEmail ?? authUser.email ?? null,
        status: 'processing',
        analysis_id: null,
        created_at: nowIso,
        updated_at: nowIso,
      });
      if (error) throw new Error(`Failed to create submission: ${error.message}`);
    }

    // ---------------------------------------------------------------------------------
    // 4) Orchestrate analysis via runradar-service (single source of truth)
    // ---------------------------------------------------------------------------------
    const radar: RadarResult = await runRadarServer({
      inputText,
      files: Array.isArray(files) ? files : [],
    });

    // ---------------------------------------------------------------------------------
    // 5) Write analyses row
    // ---------------------------------------------------------------------------------
    {
      const { error } = await supabase
        .from('analyses')
        .insert({
          id: jobId, // primary key = jobId (optional but convenient)
          job_id: jobId,
          user_id: authUser.id,
          email: userEmail ?? authUser.email ?? null,
          input_text: inputText,

          power_score: radar.powerScore ?? null,
          gravity_score: radar.gravityScore ?? null,
          risk_score: radar.riskScore ?? null,
          confidence: radar.confidence ?? null,

          status: 'completed',
          error_json: null,

          created_at: nowIso,
          updated_at: new Date().toISOString(),
        });
      if (error) throw new Error(`Failed to create analysis: ${error.message}`);
    }

    // ---------------------------------------------------------------------------------
    // 6) Write action_items (if any)
    // ---------------------------------------------------------------------------------
    if (Array.isArray((radar as any).actionItems) && (radar as any).actionItems.length > 0) {
      const actionItems = (radar as any).actionItems as Array<{
        section?: string;
        text?: string;
      }>;

      const rows = actionItems.map((it, idx) => ({
        analysis_id: jobId,
        user_id: authUser.id,
        section: it.section ?? 'general',
        step_index: idx,
        step_text: it.text ?? '',
        completed: false,
        created_at: nowIso,
        updated_at: nowIso,
      }));

      const { error } = await supabase.from('action_items').insert(rows);
      if (error) {
        console.warn('action_items insert failed:', error.message);
      }
    }

    // ---------------------------------------------------------------------------------
    // 7) Flip submissions.status → 'completed' and link analysis_id
    // ---------------------------------------------------------------------------------
    {
      const { error } = await supabase
        .from('submissions')
        .update({
          status: 'completed',
          analysis_id: jobId,
          updated_at: new Date().toISOString(),
        })
        .eq('job_id', jobId)
        .eq('user_id', authUser.id);

      if (error) throw new Error(`Failed to finalize submission: ${error.message}`);
    }

    // ---------------------------------------------------------------------------------
    // 8) Return only the jobId (DB is the source of truth for the UI)
    // ---------------------------------------------------------------------------------
    return res.status(200).json({ success: true, jobId });
  } catch (err: any) {
    console.error('analyze.ts error:', err?.message || err);

    // Best-effort: try to mark submission as failed if we can recover user + jobId
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: req.headers.authorization ?? '' } },
      });
      const { data: authData } = await supabase.auth.getUser();
      const authUserId = authData?.user?.id;

      // If your client ever sends jobId back on retry, prefer that; else use the one we generated
      const maybeJobId =
        (req.body && (req.body.jobId as string)) || jobId || undefined;

      if (authUserId && maybeJobId) {
        await supabase
          .from('submissions')
          .update({
            status: 'failed',
            error_json: String(err?.message ?? err),
            updated_at: new Date().toISOString(),
          })
          .eq('job_id', maybeJobId)
          .eq('user_id', authUserId);
      }
    } catch (inner) {
      console.error('Secondary error during fail-safe update:', inner);
    }

    return res.status(500).json({
      success: false,
      error: err?.message ?? 'analysis_failed',
      message: 'Internal error while processing analysis',
    });
  }
}
