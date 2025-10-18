// components/DashboardScreen.tsx
// Displays analyzed results + Action Items grouped by section with global progress tracking.
// Now also persists overall % to Supabase (analyses.overall_completion).

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BRAND_COLORS, BRAND_STYLES} from '../utils/brand-colors';
import { ProcessedAnalysis } from '../services/runradar-service';
import {
  loadActionItemsForAnalysis,
  toggleActionItem,
  completionBySection,
  type ActionItemRow,
  type Section,
  updateOverallCompletion,        // ⬅️ NEW
} from '../services/action-items-service';

// --- BEGIN Imported props section from DashboardScreen.tsx (Figma) ---
// We keep our existing `analysisData` prop and add the rest exactly as in Figma.
type UserLite = {
  uid: string;
  email: string;
  paymentPlan: string;
  displayName?: string;
};
// Imported props from Figma (some may be unused right now)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DashboardScreenProps {
  analysisData: ProcessedAnalysis;   // keep existing name used in this file/app
  inputText?: string;
  uploadedFiles?: File[];
  isHistorical?: boolean;
  onGoHome?: () => void;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
  user?: UserLite;
}
// --- END Imported props section from DashboardScreen.tsx (Figma) ---

const SECTION_LABEL: Record<Section, string> = {
  immediate_move: 'Immediate Move',
  strategic_tool: 'Strategic Tool',
  analytical_check: 'Analytical Check',
  long_term_fix: 'Long-Term Fix',
};

function ProgressBadge({ pct }: { pct: number }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full"
      style={{
        color: '#fff',
        background:
          pct >= 100
            ? `${BRAND_COLORS.green}60`
            : pct >= 50
            ? `${BRAND_COLORS.cyan}40`
            : `${BRAND_COLORS.pink}40`,
        border: `1px solid ${BRAND_STYLES.glassCard.border}`,
      }}
    >
      {pct}% complete
    </span>
  );
}

//export default function DashboardScreen({ analysisData }: { analysisData: ProcessedAnalysis }) {

export default function DashboardScreen({
  analysisData,
  inputText,
  uploadedFiles,
  isHistorical,
  onGoHome,
  onTabChange,
  activeTab,
  user,
}: DashboardScreenProps) {
// ---- display switches ----
  const show = {
    kpis: true,
    classification: true,
    diagnosis: true,
    psychProfile: true,
    narrative: true,
    strategicPlan: true,
    actionItems: true,
    visuals: false,
    attachments: true,
    export: true,
  } as const;

  const [items, setItems] = useState<ActionItemRow[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoadingItems(true);
        const rows = await loadActionItemsForAnalysis(analysisData.id);
        setItems(rows);
      } catch (e: any) {
        setError(e?.message || 'Failed to load action items');
      } finally {
        setLoadingItems(false);
      }
    })();
  }, [analysisData.id]);

  // ---- derived state ----
  const grouped = useMemo(() => {
    const g: Record<Section, ActionItemRow[]> = {
      immediate_move: [],
      strategic_tool: [],
      analytical_check: [],
      long_term_fix: [],
    };
    for (const it of items) g[it.section]?.push(it);
    return g;
  }, [items]);

  const sectionPct = useMemo(() => completionBySection(items), [items]);
  const overallPct = useMemo(() => {
    const vals = Object.values(sectionPct);
    if (vals.length === 0) return 0;
    const sum = vals.reduce((a, b) => a + b, 0);
    return Math.round(sum / vals.length);
  }, [sectionPct]);

  // ---- persist overall % (debounced, optimistic) ----
  const saveTimer = useRef<number | null>(null);
  const lastSaved = useRef<number | null>(null);

  useEffect(() => {
    // avoid saving same value repeatedly
    if (lastSaved.current === overallPct) return;

    // debounce 600ms
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      await updateOverallCompletion(analysisData.id, overallPct);
      lastSaved.current = overallPct;
    }, 600);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [overallPct, analysisData.id]);

  // ---- actions ----
  const onToggle = async (id: string, next: boolean) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, completed: next } : i)));
    try {
      await toggleActionItem(id, next);
    } catch (e) {
      setItems(prev => prev.map(i => (i.id === id ? { ...i, completed: !next } : i)));
      console.error(e);
    }
  };

  const clean = (s?: string | null) => (s?.trim() ? s.trim() : '');
  const sev = (n?: number) => (n == null ? 'Unknown' : n >= 75 ? 'HIGH' : n >= 50 ? 'MEDIUM' : 'LOW');

  return (
    <div className="p-8 space-y-6">
      {/* KPI cards */}
      {show.kpis && (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Power', val: analysisData.powerScore, color: BRAND_COLORS.pink },
            { label: 'Gravity', val: analysisData.gravityScore, color: BRAND_COLORS.cyan },
            { label: 'Risk', val: analysisData.riskScore, color: BRAND_COLORS.gold },
          ].map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-6 border bg-white/5"
              style={{ borderColor: `${k.color}30` }}
            >
              <h3 className="text-white font-semibold mb-2">{k.label}</h3>
              <p className="text-2xl text-white mb-1">{k.val ?? '--'}%</p>
              <p className="text-white/70 text-sm">{sev(k.val)}</p>
            </motion.div>
          ))}
        </section>
      )}

      {/* Overall Progress */}
      {show.actionItems && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Overall Completion</h3>
            <span className="text-xs text-white/70">{overallPct}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${overallPct}%`,
                background: `linear-gradient(to right, ${BRAND_COLORS.pink}, ${BRAND_COLORS.purple})`,
              }}
            />
          </div>
        </section>
      )}

      {/* Classification */}
      {show.classification && (
        <section className="flex flex-wrap gap-3">
          {analysisData.issueType && (
            <span className="text-xs text-white/80 px-3 py-2 rounded-full bg-pink-500/20 border border-pink-500/30">
              {clean(analysisData.issueType)}
            </span>
          )}
          {analysisData.issueCategory && (
            <span className="text-xs text-white/80 px-3 py-2 rounded-full bg-purple-500/20 border border-purple-500/30">
              {clean(analysisData.issueCategory)}
            </span>
          )}
          {analysisData.issueLayer && (
            <span className="text-xs text-white/80 px-3 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30">
              {clean(analysisData.issueLayer)}
            </span>
          )}
        </section>
      )}

      {/* Narrative */}
      {show.narrative && (
        <section className="space-y-4">
          {analysisData.whatsHappening && (
            <div>
              <h3 className="text-white font-semibold mb-1">What’s Happening</h3>
              <p className="text-white/80">{analysisData.whatsHappening}</p>
            </div>
          )}
          {analysisData.whyItMatters && (
            <div>
              <h3 className="text-white font-semibold mb-1">Why It Matters</h3>
              <p className="text-white/80">{analysisData.whyItMatters}</p>
            </div>
          )}
          {analysisData.narrativeSummary && (
            <div>
              <h3 className="text-white font-semibold mb-1">Narrative Summary</h3>
              <p className="text-white/80">{analysisData.narrativeSummary}</p>
            </div>
          )}
        </section>
      )}

      {/* Strategic headline moves */}
      {show.strategicPlan && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisData.immediateMove && (
            <div className="rounded-xl p-4 border border-pink-500/20 bg-white/5">
              <h3 className="text-white font-semibold mb-1">Immediate Move</h3>
              <p className="text-white/80">{analysisData.immediateMove}</p>
            </div>
          )}
          {analysisData.strategicTool && (
            <div className="rounded-xl p-4 border border-purple-500/20 bg-white/5">
              <h3 className="text-white font-semibold mb-1">Strategic Tool</h3>
              <p className="text-white/80">{analysisData.strategicTool}</p>
            </div>
          )}
          {analysisData.analyticalCheck && (
            <div className="rounded-xl p-4 border border-cyan-500/20 bg-white/5">
              <h3 className="text-white font-semibold mb-1">Analytical Check</h3>
              <p className="text-white/80">{analysisData.analyticalCheck}</p>
            </div>
          )}
          {analysisData.longTermFix && (
            <div className="rounded-xl p-4 border border-yellow-500/20 bg-white/5">
              <h3 className="text-white font-semibold mb-1">Long-Term Fix</h3>
              <p className="text-white/80">{analysisData.longTermFix}</p>
            </div>
          )}
        </section>
      )}

      {/* Action Items */}
      {show.actionItems && (
        <section className="space-y-6">
          {(['immediate_move', 'strategic_tool', 'analytical_check', 'long_term_fix'] as Section[]).map(sec => {
            const list = grouped[sec];
            const pct = sectionPct[sec];
            if (!list || list.length === 0) return null;

            return (
              <div key={sec} className="rounded-2xl p-4 border bg-white/5" style={{ borderColor: `${BRAND_STYLES.glassCard.border}` }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold">{SECTION_LABEL[sec]}</h4>
                  <ProgressBadge pct={pct} />
                </div>
                {loadingItems ? (
                  <p className="text-white/60 text-sm">Loading…</p>
                ) : error ? (
                  <p className="text-red-300 text-sm">{error}</p>
                ) : (
                  <ul className="space-y-2">
                    {list.map(item => (
                      <li key={item.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={e => onToggle(item.id, e.currentTarget.checked)}
                        />
                        <span className="text-white/80">{item.step_text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      )}

      {show.export && (
        <div className="pt-6">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold"
          >
            Export to PDF
          </button>
        </div>
      )}
    </div>
  );
}
