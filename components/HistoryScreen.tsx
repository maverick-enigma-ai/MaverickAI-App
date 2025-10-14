import { useState, useEffect } from 'react';
import { Clock, FileText, Image, Paperclip, TrendingUp, Loader2 } from 'lucide-react';
import { BrandHeader } from './BrandHeader';
import { supabase } from '../utils/supabase/client';
import { ProcessedAnalysis } from '../types/runradar-api';
import { BRAND_COLORS } from '../utils/brand-colors';

interface HistoryScan {
  id: string;
  title: string;
  date: string;
  type: 'document' | 'image' | 'text';
  powerScore: number;
  gravityScore: number;
  riskScore: number;
  confidenceLevel: number;
  summary: string;
  whatsHappening: string;
  whyItMatters: string;
  immediateMove: string;
  strategicTool: string;
  radarRed1: string;
  radarRed2: string;
  radarRed3: string;
  issueType: string;
  issueCategory: string;
  issueLayer: string;
  files: { name: string; type: string }[];
  text: string;
  // Complete analysis for dashboard view
  fullAnalysis?: ProcessedAnalysis;
}

interface HistoryScreenProps {
  onViewScan: (scan: HistoryScan) => void;
  userId: string;
}

export function HistoryScreen({ onViewScan, userId }: HistoryScreenProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'week' | 'month'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [historicalScans, setHistoricalScans] = useState<HistoryScan[]>([]);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        console.log('📚 Fetching history for user:', userId);
        
        // Calculate date filter
        let dateFilter: string | null = null;
        if (selectedPeriod === 'week') {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          dateFilter = weekAgo.toISOString();
        } else if (selectedPeriod === 'month') {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          dateFilter = monthAgo.toISOString();
        }
        
        // Query analyses table
        let query = supabase
          .from('analyses')
          .select('*')
          .eq('user_id', userId)
          .eq('is_ready', true)
          .order('created_at', { ascending: false });
        
        if (dateFilter) {
          query = query.gte('created_at', dateFilter);
        }
        
        const { data: analyses, error } = await query;
        
        if (error) {
          console.error('❌ Error fetching history:', error);
          setHistoricalScans([]);
          return;
        }
        
        console.log(`✅ Found ${analyses?.length || 0} completed analyses`);
        
        // Convert to HistoryScan format with ALL fields (using correct Supabase column names)
        const convertedScans: HistoryScan[] = (analyses || []).map((analysis) => ({
          id: analysis.id,
          title: analysis.tl_dr?.substring(0, 50) + '...' || analysis.input_querytext?.substring(0, 50) + '...' || 'Untitled Analysis',
          date: analysis.created_at,
          type: 'text' as const,
          powerScore: parseFloat(analysis.power_score) || 0,
          gravityScore: parseFloat(analysis.gravity_score) || 0,
          riskScore: parseFloat(analysis.risk_score) || 0,
          confidenceLevel: parseFloat(analysis.issue_confidence_pct) || 0,
          summary: analysis.tl_dr || analysis.whats_happening || 'No summary available',
          whatsHappening: analysis.whats_happening || '',
          whyItMatters: analysis.why_it_matters || '',
          immediateMove: analysis.immediate_move || '',
          strategicTool: analysis.strategic_tool || '',
          radarRed1: '',
          radarRed2: '',
          radarRed3: '',
          issueType: analysis.issue_type || '',
          issueCategory: analysis.issue_category || '',
          issueLayer: analysis.issue_layer || '',
          files: [],
          text: analysis.input_querytext || '',
          // Store complete analysis for dashboard view
          fullAnalysis: {
            id: analysis.id,
            jobId: analysis.job_id || analysis.id,
            userId: analysis.user_id,
            title: analysis.tl_dr?.substring(0, 50) + '...' || 'Analysis',
            inputText: analysis.input_querytext || '',
            summary: analysis.tl_dr || '',
            powerScore: parseFloat(analysis.power_score) || 0,
            gravityScore: parseFloat(analysis.gravity_score) || 0,
            riskScore: parseFloat(analysis.risk_score) || 0,
            confidenceLevel: parseFloat(analysis.issue_confidence_pct) || 0,
            whatsHappening: analysis.whats_happening || '',
            whyItMatters: analysis.why_it_matters || '',
            narrativeSummary: analysis.narrative_summary || '',
            immediateMove: analysis.immediate_move || '',
            strategicTool: analysis.strategic_tool || '',
            analyticalCheck: analysis.analytical_check || '',
            longTermFix: analysis.long_term_fix || '',
            powerExplanation: analysis.power_expl || '',
            gravityExplanation: analysis.gravity_expl || '',
            riskExplanation: analysis.risk_expl || '',
            issueType: analysis.issue_type || '',
            issueCategory: analysis.issue_category || '',
            issueLayer: analysis.issue_layer || '',
            radarUrl: analysis.radar_url || undefined,
            chartHtml: analysis.chart_html || undefined,
            tugOfWarHtml: analysis.tugofwar_html || undefined,
            radarHtml: analysis.radar_html || undefined,
            riskHtml: analysis.risk_html || undefined,
            status: analysis.status as 'processing' | 'completed' | 'failed' || 'completed',
            isReady: analysis.is_ready || false,
            createdAt: analysis.created_at,
            updatedAt: analysis.updated_at
          }
        }));
        
        setHistoricalScans(convertedScans);
      } catch (error) {
        console.error('❌ Exception fetching history:', error);
        setHistoricalScans([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchHistory();
    }
  }, [selectedPeriod, userId]);

  // Mock historical data for fallback
  const getMockHistoricalScans = (): HistoryScan[] => [
    {
      id: '1',
      title: 'Board Meeting Dynamics',
      date: '2024-01-15',
      type: 'document',
      powerScore: 8.7,
      gravityScore: 6.3,
      riskScore: 3.2,
      summary: 'High-tension negotiation with subtle power plays detected',
      files: [{ name: 'board_meeting_transcript.pdf', type: 'pdf' }],
      text: 'Analysis of board meeting conversation dynamics and power structures...'
    },
    {
      id: '2', 
      title: 'Client Email Thread',
      date: '2024-01-12',
      type: 'text',
      powerScore: 6.4,
      gravityScore: 8.1,
      riskScore: 5.7,
      summary: 'Complex emotional manipulation patterns identified',
      files: [],
      text: 'Email conversation between client and partner showing psychological pressure tactics...'
    },
    {
      id: '3',
      title: 'Leadership Photo Analysis',
      date: '2024-01-10',
      type: 'image',
      powerScore: 7.2,
      gravityScore: 4.9,
      riskScore: 2.1,
      summary: 'Body language reveals hierarchical positioning',
      files: [{ name: 'team_photo.jpg', type: 'image' }],
      text: 'Analysis of team photograph showing unconscious power positioning and group dynamics...'
    },
    {
      id: '4',
      title: 'Contract Negotiation',
      date: '2024-01-08',
      type: 'document',
      powerScore: 9.1,
      gravityScore: 5.5,
      riskScore: 7.8,
      summary: 'Aggressive positioning with hidden leverage points',
      files: [{ name: 'contract_draft.docx', type: 'doc' }],
      text: 'Contract language analysis revealing psychological pressure points and manipulation tactics...'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'image':
        return <Image className="w-4 h-4 text-purple-400" />;
      default:
        return <Paperclip className="w-4 h-4 text-teal-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-red-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="w-full min-h-screen pb-24" style={{ background: BRAND_COLORS.gradients.background }}>
      {/* Header */}
      <BrandHeader subtitle="Analysis History" />
      
      <div className="p-6 pt-8">
        <p className="text-cyan-400 text-sm mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Review your previous psychological intelligence analyses
        </p>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-full text-sm transition-all min-h-[48px] shadow-lg ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/20'
                  : 'bg-white/10 text-cyan-300 hover:bg-white/20'
              }`}
              data-name={`filter_${period}`}
            >
              <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                {period === 'all' ? 'All Time' : period === 'week' ? 'This Week' : 'This Month'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="px-6 py-12 text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-white mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            Loading History
          </h3>
          <p className="text-cyan-400/60 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Fetching your analyses from Google Sheets...
          </p>
        </div>
      )}

      {/* Scan List */}
      {!isLoading && historicalScans.length > 0 && (
        <div className="px-6 space-y-4">
          {historicalScans.map((scan) => (
          <button
            key={scan.id}
            onClick={() => onViewScan(scan)}
            className="w-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-5 border border-white/20 text-left transition-all hover:from-white/15 hover:to-white/10 hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/10 min-h-[64px]"
            data-name={`scan_${scan.id}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getTypeIcon(scan.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white truncate" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    {scan.title}
                  </h3>
                  <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
                </div>
                
                <p className="text-cyan-200 text-sm mb-2 line-clamp-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {scan.summary}
                </p>

                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-cyan-400" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>PWR</span>
                    <span className={`text-xs ${getScoreColor(scan.powerScore)}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      {scan.powerScore}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-purple-400" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>GRV</span>
                    <span className={`text-xs ${getScoreColor(scan.gravityScore)}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      {scan.gravityScore}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-red-400" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>RSK</span>
                    <span className={`text-xs ${getScoreColor(scan.riskScore)}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      {scan.riskScore}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-cyan-400/60" />
                    <span className="text-xs text-cyan-400/60" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {new Date(scan.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {scan.files.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Paperclip className="w-3 h-3 text-cyan-400/60" />
                      <span className="text-xs text-cyan-400/60" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {scan.files.length} file{scan.files.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && historicalScans.length === 0 && (
        <div className="px-6 py-12 text-center">
          <Clock className="w-12 h-12 text-cyan-400/60 mx-auto mb-4" />
          <h3 className="text-white mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            No Scans Yet
          </h3>
          <p className="text-cyan-400/60 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Your psychological intelligence analyses will appear here
          </p>
        </div>
      )}
    </div>
  );
}