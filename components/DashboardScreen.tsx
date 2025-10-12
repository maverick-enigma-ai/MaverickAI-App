import { useState, useEffect } from 'react';
import { Info, Home, AlertTriangle, CheckCircle, XCircle, Download, FileText, BarChart3, Target, Lightbulb, TrendingUp, ChevronDown, ChevronUp, Square, CheckSquare, ArrowDown, ArrowUp, Minus, Shield, Zap } from 'lucide-react';
import { BrandHeader } from './BrandHeader';
import { NavigationBar } from './NavigationBar';
import { RadarIcon } from './RadarIcon';
import { ProcessedAnalysis } from '../types/runradar-api';
import { exportAnalysisToPDF, canExportToPDF } from '../utils/pdf-export';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getActionItems, 
  toggleActionItem, 
  initializeActionItems,
  calculateSectionCompletion,
  getOverallCompletion,
  type ActionItem,
  type SectionCompletion
} from '../services/action-items-service';

type ModalContent = 
  | { type: 'situation'; data: any }
  | { type: 'power'; score: number; explanation: string }
  | { type: 'gravity'; score: number; explanation: string }
  | { type: 'risk'; score: number; explanation: string }
  | { type: 'diagnostic'; state: string; soWhat: string }
  | { type: 'classification'; category: string; issueType: string; layer: string }
  | { type: 'move'; title: string; content: string }
  | null;

interface DashboardScreenProps {
  analysis?: ProcessedAnalysis | null;
  inputText?: string;
  uploadedFiles?: File[];
  isHistorical?: boolean;
  onGoHome?: () => void;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
  user?: { uid: string; email: string; paymentPlan: string; displayName?: string };
}

export function DashboardScreen({ 
  analysis, 
  inputText, 
  uploadedFiles, 
  isHistorical = false,
  onGoHome,
  onTabChange,
  activeTab = 'home',
  user
}: DashboardScreenProps) {
  const [modalContent, setModalContent] = useState<ModalContent>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [strategicPlanExpanded, setStrategicPlanExpanded] = useState(false);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [sectionCompletions, setSectionCompletions] = useState<SectionCompletion[]>([]);
  const [overallCompletion, setOverallCompletion] = useState(0);
  const [loadingActionItems, setLoadingActionItems] = useState(false);

  // Load action items when analysis changes
  useEffect(() => {
    async function loadActionItems() {
      if (!analysis?.id || !user?.uid) return;
      
      setLoadingActionItems(true);
      try {
        const items = await getActionItems(analysis.id);
        
        // If no items exist, initialize them
        if (items.length === 0) {
          await initializeActionItems(analysis.id, user.uid, {
            immediateMove: analysis.immediateMove,
            strategicTool: analysis.strategicTool,
            analyticalCheck: analysis.analyticalCheck,
            longTermFix: analysis.longTermFix
          });
          
          // Reload items
          const newItems = await getActionItems(analysis.id);
          setActionItems(newItems);
          setSectionCompletions(calculateSectionCompletion(newItems));
          setOverallCompletion(getOverallCompletion(newItems));
        } else {
          setActionItems(items);
          setSectionCompletions(calculateSectionCompletion(items));
          setOverallCompletion(getOverallCompletion(items));
        }
      } catch (error) {
        console.error('Error loading action items:', error);
      } finally {
        setLoadingActionItems(false);
      }
    }
    
    loadActionItems();
  }, [analysis?.id, user?.uid]);

  const handleBackToHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.reload();
    }
  };

  const handleRadarScan = () => {
    if (onTabChange) {
      onTabChange('radar');
    }
  };

  const handleToggleActionItem = async (itemId: string, currentCompleted: boolean) => {
    try {
      await toggleActionItem(itemId, !currentCompleted);
      
      // Update local state
      const updatedItems = actionItems.map(item => 
        item.id === itemId 
          ? { ...item, completed: !currentCompleted, completed_at: !currentCompleted ? new Date().toISOString() : null }
          : item
      );
      
      setActionItems(updatedItems);
      setSectionCompletions(calculateSectionCompletion(updatedItems));
      setOverallCompletion(getOverallCompletion(updatedItems));
      
      toast.success(!currentCompleted ? 'Step completed! 🎉' : 'Step unchecked');
    } catch (error) {
      console.error('Error toggling action item:', error);
      toast.error('Failed to update step');
    }
  };

  const handleExportPDF = async () => {
    if (!analysis || !user) return;
    
    // Check if user can export PDF (premium only)
    if (!canExportToPDF(user.paymentPlan)) {
      toast.error('PDF Export is a Premium feature. Upgrade to export your analysis!', {
        duration: 4000,
        icon: '👑'
      });
      return;
    }
    
    setIsExportingPDF(true);
    try {
      await exportAnalysisToPDF(analysis, user.email, user.displayName);
      toast.success('✅ PDF downloaded successfully!', {
        duration: 3000,
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Helper function to format bullet points from text
  const formatBulletPoints = (text: string): string[] => {
    if (!text) return [];
    
    // Split by newlines and filter out empty lines
    const lines = text.split('\n').filter(line => line.trim());
    
    // Clean up bullet markers (•, -, etc.)
    return lines.map(line => line.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);
  };

  // Get analysis data with fallbacks
  const analysisData = analysis || {
    powerScore: 0,
    gravityScore: 0,
    riskScore: 0,
    confidenceLevel: 0,
    whatsHappening: 'No analysis data available',
    whyItMatters: '',
    immediateMove: '',
    strategicTool: '',
    analyticalCheck: '',
    longTermFix: '',
    powerExplanation: '',
    gravityExplanation: '',
    riskExplanation: '',
    issueType: '',
    issueCategory: '',
    issueLayer: '',
    summary: '',
    narrativeSummary: ''
  };

  // Debug: Log what data we have
  console.log('🔍 DashboardScreen received analysis:', {
    hasAnalysis: !!analysis,
    powerScore: analysisData.powerScore,
    gravityScore: analysisData.gravityScore,
    riskScore: analysisData.riskScore,
    confidenceLevel: analysisData.confidenceLevel,
    hasSummary: !!analysisData.summary,
    hasNarrative: !!analysisData.narrativeSummary,
    hasImmediateMove: !!analysisData.immediateMove,
    hasStrategicTool: !!analysisData.strategicTool,
    hasAnalyticalCheck: !!analysisData.analyticalCheck,
    hasLongTermFix: !!analysisData.longTermFix,
    hasIssueType: !!analysisData.issueType,
    hasIssueCategory: !!analysisData.issueCategory,
    hasIssueLayer: !!analysisData.issueLayer,
    whatsHappeningLength: analysisData.whatsHappening?.length || 0
  });

  // Calculate severity level and interpretation
  const getSeverityLevel = (score: number): { level: 'LOW' | 'MEDIUM' | 'HIGH'; color: string; bgColor: string; icon: any } => {
    if (score >= 70) {
      return { 
        level: 'HIGH', 
        color: 'text-red-400', 
        bgColor: 'bg-red-500/20 border-red-500/30',
        icon: AlertTriangle
      };
    } else if (score >= 40) {
      return { 
        level: 'MEDIUM', 
        color: 'text-yellow-400', 
        bgColor: 'bg-yellow-500/20 border-yellow-500/30',
        icon: AlertTriangle
      };
    } else {
      return { 
        level: 'LOW', 
        color: 'text-green-400', 
        bgColor: 'bg-green-500/20 border-green-500/30',
        icon: CheckCircle
      };
    }
  };

  // Get "So What" interpretation for scores
  const getScoreInterpretation = (type: 'power' | 'gravity' | 'risk', score: number): { headline: string; meaning: string; action: string } => {
    const severity = getSeverityLevel(score);
    
    if (type === 'power') {
      // HIGH SCORE = OPPONENT HAS POWER (you have limited leverage)
      if (severity.level === 'HIGH') {
        return {
          headline: 'Opponent Holds Power',
          meaning: 'The other person has more psychological leverage. They are less invested or have more options than you do.',
          action: 'Exercise caution. Don\'t push too hard. Build value, create scarcity, and wait for the right moment to act.'
        };
      } else if (severity.level === 'MEDIUM') {
        return {
          headline: 'Balanced Power Dynamic',
          meaning: 'Neither party has dominant leverage. This is a relatively equal relationship in terms of psychological influence.',
          action: 'Focus on mutual benefit and collaboration. Build trust through consistency. Small moves create momentum.'
        };
      } else {
        // LOW SCORE = YOU HAVE POWER (opponent is more invested)
        return {
          headline: 'You Have Strong Leverage',
          meaning: 'The other person is more invested, dependent, or vulnerable in this dynamic. You hold the psychological power position.',
          action: 'Use this strategically. You can set boundaries, make demands, and negotiate from strength. Don\'t abuse it—play the long game.'
        };
      }
    } else if (type === 'gravity') {
      if (severity.level === 'HIGH') {
        return {
          headline: 'Strong Emotional Pull',
          meaning: 'There\'s intense emotional magnetism or attachment in this relationship. Deep feelings are at play—yours or theirs.',
          action: 'Be aware of emotional dependency. High gravity can cloud judgment. Separate emotion from strategy when making decisions.'
        };
      } else if (severity.level === 'MEDIUM') {
        return {
          headline: 'Moderate Attachment',
          meaning: 'There\'s emotional connection, but it\'s not overwhelming. Healthy level of investment without obsession.',
          action: 'This is often the sweet spot. Maintain the connection while keeping perspective. Don\'t let it drift into low gravity or spike into high.'
        };
      } else {
        return {
          headline: 'Low Emotional Investment',
          meaning: 'Minimal emotional attachment or magnetism. The relationship lacks strong emotional pull in either direction.',
          action: 'If you want connection, you\'ll need to build it. If you want distance, this works in your favor. Choose your direction deliberately.'
        };
      }
    } else { // risk
      if (severity.level === 'HIGH') {
        return {
          headline: 'Dangerous Situation',
          meaning: 'This dynamic has serious potential for damage—emotional, reputational, financial, or relational. Inaction could be costly.',
          action: 'Take immediate action. Follow the strategic moves below closely. Do NOT ignore this. The consequences of doing nothing are severe.'
        };
      } else if (severity.level === 'MEDIUM') {
        return {
          headline: 'Manageable Risk Level',
          meaning: 'There are risks present, but they\'re not critical yet. This situation requires attention but not panic.',
          action: 'Stay vigilant. Address the issue proactively before it escalates. The strategic moves below will help you navigate safely.'
        };
      } else {
        return {
          headline: 'Low Risk Environment',
          meaning: 'This situation has minimal downside. You have room to experiment, make mistakes, or take bold action.',
          action: 'You can afford to be more aggressive or creative here. Use this as an opportunity to test strategies or build skills.'
        };
      }
    }
  };

  const powerSeverity = getSeverityLevel(analysisData.powerScore);
  const gravitySeverity = getSeverityLevel(analysisData.gravityScore);
  const riskSeverity = getSeverityLevel(analysisData.riskScore);

  // Info Modal Component
  const InfoModal = () => {
    if (!modalContent) return null;

    return (
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        onClick={() => setModalContent(null)}
      >
        <div 
          className="bg-gradient-to-b from-[#14123F] to-[#342FA5] border border-white/20 rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Award-Winning */}
          <div className="flex justify-end mb-4">
            <motion.button
              onClick={() => setModalContent(null)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/25 rounded-full transition-all duration-300 min-h-[48px] min-w-[48px] shadow-lg hover:shadow-cyan-500/30 group relative overflow-hidden"
              data-name="btn_close_modal"
            >
              {/* Pulse ring on hover */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
              <XCircle className="w-6 h-6 text-white/70 group-hover:text-white relative z-10 transition-colors" />
            </motion.button>
          </div>

          {/* Modal Content */}
          {modalContent.type === 'situation' && (
            <div className="space-y-4">
              <h3 className="text-white">Situation Overview</h3>
              
              {analysisData.narrativeSummary && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <p className="text-cyan-400 text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    📖 Full Context
                  </p>
                  <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {analysisData.narrativeSummary}
                  </p>
                </div>
              )}

              {analysisData.whatsHappening && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <p className="text-purple-400 text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    🔍 What's Happening
                  </p>
                  <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {analysisData.whatsHappening}
                  </p>
                </div>
              )}

              {analysisData.whyItMatters && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <p className="text-pink-400 text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    ⚠️ Why It's Important
                  </p>
                  <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {analysisData.whyItMatters}
                  </p>
                </div>
              )}
            </div>
          )}

          {(modalContent.type === 'power' || modalContent.type === 'gravity' || modalContent.type === 'risk') && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`text-5xl ${
                  modalContent.type === 'power' ? 'text-cyan-400' :
                  modalContent.type === 'gravity' ? 'text-purple-400' : 'text-red-400'
                }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>
                  {modalContent.score}
                </div>
                <div>
                  <h3 className="text-white capitalize">{modalContent.type} Score</h3>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getSeverityLevel(modalContent.score).bgColor} border`}>
                    <span className={getSeverityLevel(modalContent.score).color} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      {getSeverityLevel(modalContent.score).level}
                    </span>
                  </div>
                </div>
              </div>

              {/* User's specific explanation from AI */}
              {modalContent.explanation && (
                <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <p className="text-cyan-400 text-xs mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    YOUR SITUATION
                  </p>
                  <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {modalContent.explanation}
                  </p>
                </div>
              )}

              {/* SO WHAT - What this means in plain English */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <p className="text-yellow-400 text-xs mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  SO WHAT DOES THIS MEAN?
                </p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-white text-sm mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      {getScoreInterpretation(modalContent.type, modalContent.score).headline}
                    </p>
                    <p className="text-white/80 text-xs leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {getScoreInterpretation(modalContent.type, modalContent.score).meaning}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <p className="text-green-400 text-xs mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      WHAT TO DO
                    </p>
                    <p className="text-white/80 text-xs leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {getScoreInterpretation(modalContent.type, modalContent.score).action}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {modalContent.type === 'diagnostic' && (
            <div className="space-y-4">
              <h3 className="text-white">Diagnostic Insight</h3>
              
              {modalContent.state && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <p className="text-cyan-400 text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    🎯 Current State
                  </p>
                  <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {modalContent.state}
                  </p>
                </div>
              )}

              {modalContent.soWhat && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <p className="text-pink-400 text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    💡 What This Means
                  </p>
                  <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {modalContent.soWhat}
                  </p>
                </div>
              )}
            </div>
          )}

          {modalContent.type === 'classification' && (
            <div className="space-y-4">
              <h3 className="text-white">Issue Classification</h3>
              
              <div className="space-y-3">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <p className="text-cyan-400 text-sm mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Category
                  </p>
                  <p className="text-white/90 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {modalContent.category || 'Not classified'}
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <p className="text-purple-400 text-sm mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Type
                  </p>
                  <p className="text-white/90 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {modalContent.issueType || 'Not classified'}
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <p className="text-pink-400 text-sm mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Layer
                  </p>
                  <p className="text-white/90 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {modalContent.layer || 'Not classified'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {modalContent.type === 'move' && (
            <div className="space-y-4">
              <h3 className="text-white">{modalContent.title}</h3>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                <div className="text-white/90 text-sm leading-relaxed space-y-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {/* Parse content for better formatting */}
                  {modalContent.content.split('\n').map((paragraph, idx) => {
                    // Check if paragraph is a numbered list item or bullet point
                    const isNumbered = /^\d+[\.\)]\s/.test(paragraph.trim());
                    const isBullet = /^[-•]\s/.test(paragraph.trim());
                    
                    if (isNumbered || isBullet) {
                      return (
                        <div key={idx} className="flex gap-2">
                          <span className="text-cyan-400 flex-shrink-0">
                            {isNumbered ? paragraph.match(/^(\d+[\.\)])/)?.[1] : '•'}
                          </span>
                          <span className="flex-1">
                            {paragraph.replace(/^(\d+[\.\)]|[-•])\s*/, '')}
                          </span>
                        </div>
                      );
                    }
                    
                    // Regular paragraph
                    if (paragraph.trim()) {
                      return <p key={idx} className="leading-relaxed">{paragraph}</p>;
                    }
                    return null;
                  })}
                </div>
              </div>
              
              {/* Action Reminder */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-4">
                <p className="text-cyan-400 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  💡 IMPLEMENTATION TIP
                </p>
                <p className="text-white/80 text-xs mt-2 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Break this down into small, specific actions. Focus on the immediate next step you can take today.
                </p>
              </div>
            </div>
          )}

          {/* Got It Button - Award-Winning */}
          <motion.button
            onClick={() => setModalContent(null)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-6 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:via-cyan-400 hover:to-blue-400 text-white py-5 rounded-full transition-all duration-300 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/60 btn-press-strong relative overflow-hidden group min-h-[60px]"
            data-name="btn_modal_got_it"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '2s' }} />
            
            <span className="relative flex items-center justify-center gap-2" style={{ fontWeight: 700, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✓
              </motion.span>
              Got It
            </span>
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] overflow-y-auto pb-32">
      {/* Header */}
      <BrandHeader 
        subtitle={isHistorical ? 'Historical' : 'Live Analysis'}
        showPulse={!isHistorical}
      />

      {/* Premium PDF Export Button - Floating Action Button */}
      {user && canExportToPDF(user.paymentPlan) && (
        <motion.button
          onClick={handleExportPDF}
          disabled={isExportingPDF}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="fixed top-24 right-6 z-50 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-400 hover:via-pink-400 hover:to-purple-500 text-white px-6 py-3 rounded-full shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 flex items-center gap-2 border border-white/20 backdrop-blur-sm min-h-[48px] min-w-[48px]"
          data-name="btn_export_pdf_premium"
        >
          {isExportingPDF ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Download className="w-5 h-5" />
              </motion.div>
              <span className="text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Generating...
              </span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span className="text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Export PDF
              </span>
              <span className="text-xs bg-yellow-400 text-purple-900 px-2 py-0.5 rounded-full ml-1" style={{ fontWeight: 700 }}>
                PRO
              </span>
            </>
          )}
        </motion.button>
      )}

      <motion.div 
        className="px-6 pt-8 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 1. SITUATION SUMMARY - Quick scannable overview */}
        <motion.div 
          className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Situation Summary
              </h2>
            </div>
            <button
              onClick={() => setModalContent({ 
                type: 'situation', 
                data: analysisData 
              })}
              className="w-8 h-8 flex items-center justify-center bg-cyan-500/20 hover:bg-cyan-500/30 rounded-full transition-colors min-h-[36px] min-w-[36px]"
              data-name="btn_situation_info"
            >
              <Info className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {analysisData.summary || analysisData.whatsHappening}
          </p>
        </motion.div>

        {/* 2. SEVERITY ASSESSMENT - Battery-style bars showing who has advantage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              Severity Assessment
            </h2>
          </div>
          
          <div className="space-y-4">
            {/* Power Score Card */}
            <motion.button
              onClick={() => setModalContent({
                type: 'power',
                score: analysisData.powerScore,
                explanation: analysisData.powerExplanation
              })}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all min-h-[48px]"
              data-name="btn_power_card"
            >
              {/* Mobile-optimized layout */}
              <div className="space-y-3">
                {/* Top: Label, Score & Info Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-cyan-400 text-xs mb-0.5" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        POWER
                      </p>
                      <div className="text-4xl text-white leading-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>
                        {analysisData.powerScore}
                      </div>
                    </div>
                  </div>
                  <Info className="w-5 h-5 text-white/40 flex-shrink-0" />
                </div>

                {/* Bottom: Battery Bar & Tags */}
                <div className="space-y-2">
                  {/* Battery Bar - Full width on mobile */}
                  <div className="h-6 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                    <div 
                      className={`h-full rounded-lg transition-all duration-1000 ${
                        analysisData.powerScore > 60 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                        analysisData.powerScore < 40 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                        'bg-gradient-to-r from-yellow-400 to-yellow-500'
                      }`}
                      style={{ width: `${analysisData.powerScore}%` }}
                    />
                  </div>
                  
                  {/* Tags Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className={`text-xs px-2.5 py-1 rounded-full ${powerSeverity.bgColor} border flex-shrink-0`}>
                      <span className={powerSeverity.color} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        {powerSeverity.level}
                      </span>
                    </div>
                    <div className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${
                      analysisData.powerScore > 60 ? 'bg-orange-500/20 border border-orange-500/30' :
                      analysisData.powerScore < 40 ? 'bg-green-500/20 border border-green-500/30' :
                      'bg-yellow-500/20 border border-yellow-500/30'
                    }`}>
                      <span className={
                        analysisData.powerScore > 60 ? 'text-orange-400' : analysisData.powerScore < 40 ? 'text-green-400' : 'text-yellow-400'
                      } style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        {analysisData.powerScore > 60 ? 'Opponent' : analysisData.powerScore < 40 ? 'You' : 'Balanced'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Gravity Score Card */}
            <motion.button
              onClick={() => setModalContent({
                type: 'gravity',
                score: analysisData.gravityScore,
                explanation: analysisData.gravityExplanation
              })}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-4 border border-white/10 hover:border-purple-500/30 transition-all min-h-[48px]"
              data-name="btn_gravity_card"
            >
              {/* Mobile-optimized layout */}
              <div className="space-y-3">
                {/* Top: Label, Score & Info Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-purple-400 text-xs mb-0.5" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        GRAVITY
                      </p>
                      <div className="text-4xl text-white leading-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>
                        {analysisData.gravityScore}
                      </div>
                    </div>
                  </div>
                  <Info className="w-5 h-5 text-white/40 flex-shrink-0" />
                </div>

                {/* Bottom: Battery Bar & Tags */}
                <div className="space-y-2">
                  {/* Battery Bar - Full width on mobile */}
                  <div className="h-6 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                    <div 
                      className="h-full rounded-lg bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-1000"
                      style={{ width: `${analysisData.gravityScore}%` }}
                    />
                  </div>
                  
                  {/* Tags Row */}
                  <div className="flex items-center justify-start">
                    <div className={`text-xs px-2.5 py-1 rounded-full ${gravitySeverity.bgColor} border flex-shrink-0`}>
                      <span className={gravitySeverity.color} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        {gravitySeverity.level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Risk Score Card */}
            <motion.button
              onClick={() => setModalContent({
                type: 'risk',
                score: analysisData.riskScore,
                explanation: analysisData.riskExplanation
              })}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-4 border border-white/10 hover:border-red-500/30 transition-all min-h-[48px]"
              data-name="btn_risk_card"
            >
              {/* Mobile-optimized layout */}
              <div className="space-y-3">
                {/* Top: Label, Score & Info Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-red-400 text-xs mb-0.5" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        RISK
                      </p>
                      <div className="text-4xl text-white leading-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>
                        {analysisData.riskScore}
                      </div>
                    </div>
                  </div>
                  <Info className="w-5 h-5 text-white/40 flex-shrink-0" />
                </div>

                {/* Bottom: Battery Bar & Tags */}
                <div className="space-y-2">
                  {/* Battery Bar - Full width on mobile */}
                  <div className="h-6 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                    <div 
                      className={`h-full rounded-lg transition-all duration-1000 ${
                        analysisData.riskScore > 60 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                        'bg-gradient-to-r from-green-400 to-green-500'
                      }`}
                      style={{ width: `${analysisData.riskScore}%` }}
                    />
                  </div>
                  
                  {/* Tags Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className={`text-xs px-2.5 py-1 rounded-full ${riskSeverity.bgColor} border flex-shrink-0`}>
                      <span className={riskSeverity.color} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        {riskSeverity.level}
                      </span>
                    </div>
                    <div className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${
                      analysisData.riskScore > 60 ? 'bg-red-500/20 border border-red-500/30' :
                      'bg-green-500/20 border border-green-500/30'
                    }`}>
                      <span className={analysisData.riskScore > 60 ? 'text-red-400' : 'text-green-400'} style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        {analysisData.riskScore > 60 ? 'To You' : 'Low Risk'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* 3. ISSUE CLASSIFICATION - What kind of problem this is */}
        {(analysisData.issueCategory || analysisData.issueType || analysisData.issueLayer) && (
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Issue Classification
                </h2>
              </div>
              <button
                onClick={() => setModalContent({
                  type: 'classification',
                  category: analysisData.issueCategory,
                  issueType: analysisData.issueType,
                  layer: analysisData.issueLayer
                })}
                className="w-8 h-8 flex items-center justify-center bg-purple-500/20 hover:bg-purple-500/30 rounded-full transition-colors min-h-[36px] min-w-[36px]"
                data-name="btn_classification_info"
              >
                <Info className="w-4 h-4 text-purple-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Category - Full width bar */}
              {analysisData.issueCategory && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-cyan-400 text-xs mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    CATEGORY
                  </p>
                  <div className="w-full px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl">
                    <span className="text-white text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      {analysisData.issueCategory}
                    </span>
                  </div>
                </div>
              )}

              {/* Type - Full width bar */}
              {analysisData.issueType && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-purple-400 text-xs mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    TYPE
                  </p>
                  <div className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl">
                    <span className="text-white text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      {analysisData.issueType}
                    </span>
                  </div>
                </div>
              )}

              {/* Layer - Full width bar */}
              {analysisData.issueLayer && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-pink-400 text-xs mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    LAYER
                  </p>
                  <div className="w-full px-4 py-2.5 bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/30 rounded-xl">
                    <span className="text-white text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      {analysisData.issueLayer.replace(/[()]/g, '').trim()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🧠 NEW: PSYCHOLOGICAL PROFILE - Deep Intelligence Layer */}
        {analysisData.psychologicalProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 backdrop-blur-md rounded-3xl p-6 border border-purple-500/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  🧠 Psychological Profile
                </h2>
                <p className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Deep intelligence layer - What drives them
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Primary Motivation */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Target className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-cyan-400 text-xs mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      PRIMARY MOTIVATION
                    </p>
                    <p className="text-white text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      {analysisData.psychologicalProfile.primaryMotivation}
                    </p>
                    <p className="text-white/70 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      └─ Evidence: {analysisData.psychologicalProfile.motivationEvidence}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hidden Driver */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-pink-400 text-xs mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      HIDDEN DRIVER
                    </p>
                    <p className="text-white text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      {analysisData.psychologicalProfile.hiddenDriver}
                    </p>
                    <p className="text-white/70 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      └─ Signal: "{analysisData.psychologicalProfile.hiddenDriverSignal}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Emotional State */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-400 text-xs mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      EMOTIONAL STATE
                    </p>
                    <p className="text-white text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      {analysisData.psychologicalProfile.emotionalState}
                    </p>
                    <p className="text-white/70 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      └─ Detection: {analysisData.psychologicalProfile.emotionalEvidence}
                    </p>
                  </div>
                </div>
              </div>

              {/* Power Dynamic */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-purple-400 text-xs mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      POWER DYNAMIC
                    </p>
                    <p className="text-white text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      {analysisData.psychologicalProfile.powerDynamic}
                    </p>
                    <p className="text-white/70 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      └─ Evidence: {analysisData.psychologicalProfile.powerDynamicEvidence}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Value Badge */}
            <div className="mt-4 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Premium Intelligence Layer
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 4. STRATEGIC POWER ANALYSIS - Why These Shifts Matter */}
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                <Target className="w-5 h-5 text-teal-400" />
              </div>
              <h2 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Strategic Power Analysis
              </h2>
            </div>
            <button
              onClick={() => setModalContent({
                type: 'diagnostic',
                state: analysisData.diagnosticState || 'This analysis reveals why specific power shifts are needed to improve your position.',
                soWhat: analysisData.diagnosticSoWhat || 'Understanding these patterns helps you respond more strategically to the situation.'
              })}
              className="w-8 h-8 flex items-center justify-center bg-teal-500/20 hover:bg-teal-500/30 rounded-full transition-colors min-h-[36px] min-w-[36px]"
              data-name="btn_diagnostic_info"
            >
              <Info className="w-4 h-4 text-teal-400" />
            </button>
          </div>

          {/* NARRATIVE: Why These Shifts Matter (from OpenAI or Web Search) */}
          {(analysisData.diagnosticState || analysisData.diagnosticSoWhat) && (
            <div className="mb-6 space-y-3">
              {analysisData.diagnosticState && (
                <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lightbulb className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-teal-400 text-xs mb-1.5" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        WHY THIS MATTERS
                      </p>
                      <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {analysisData.diagnosticState}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {analysisData.diagnosticSoWhat && (
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-4 border border-yellow-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-yellow-400 text-xs mb-1.5" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        STRATEGIC CONTEXT
                      </p>
                      <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {analysisData.diagnosticSoWhat}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STRATEGIC SHIFTS NEEDED */}
          <div className="bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-2xl p-5 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-yellow-400" />
              <h3 className="text-yellow-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                STRATEGIC SHIFTS NEEDED
              </h3>
            </div>

            <div className="space-y-3">
              {/* Power Shift */}
              {analysisData.powerScore > 50 && (
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <div className="flex-shrink-0">
                    <ArrowDown className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        Power: {analysisData.powerScore} → {Math.max(30, 100 - analysisData.powerScore)}
                      </span>
                      <span className="text-cyan-400 text-xs px-2 py-0.5 bg-cyan-500/20 rounded-full" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        -{Math.abs(analysisData.powerScore - Math.max(30, 100 - analysisData.powerScore))}
                      </span>
                    </div>
                    <p className="text-white/70 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Reduce opponent's influence through Quick Wins
                    </p>
                  </div>
                </div>
              )}

              {/* Gravity Awareness */}
              {analysisData.gravityScore > 50 && (
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <div className="flex-shrink-0">
                    <Minus className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        Gravity: {analysisData.gravityScore} (Monitor)
                      </span>
                    </div>
                    <p className="text-white/70 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Maintain awareness via Positioning Moves
                    </p>
                  </div>
                </div>
              )}

              {/* Risk Reduction */}
              {analysisData.riskScore > 50 && (
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <div className="flex-shrink-0">
                    <ArrowDown className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        Risk: {analysisData.riskScore} → {Math.max(20, Math.round(analysisData.riskScore * 0.3))}
                      </span>
                      <span className="text-pink-400 text-xs px-2 py-0.5 bg-pink-500/20 rounded-full" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        -{Math.abs(analysisData.riskScore - Math.max(20, Math.round(analysisData.riskScore * 0.3)))}
                      </span>
                    </div>
                    <p className="text-white/70 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Mitigate threats through Immediate Actions
                    </p>
                  </div>
                </div>
              )}

              {/* Success State */}
              {analysisData.powerScore < 50 && analysisData.riskScore < 50 && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-xl p-3 border border-green-500/30">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-green-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      Strong Position
                    </p>
                    <p className="text-white/70 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Use Long-Term Strategy to maintain advantage
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {/* Diagnostic State */}
            {analysisData.diagnosticState && (
              <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-teal-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      🎯
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-teal-400 text-xs mb-1.5" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      PATTERN DETECTED
                    </p>
                    <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {analysisData.diagnosticState}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Diagnostic So What */}
            {analysisData.diagnosticSoWhat && (
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-4 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-yellow-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      💡
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-400 text-xs mb-1.5" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      WHY THIS MATTERS
                    </p>
                    <p className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {analysisData.diagnosticSoWhat}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 5. STRATEGIC PLAN - Collapsible with completion tracking */}
        <div>
          {/* Header - Always Visible */}
          <motion.button
            onClick={() => setStrategicPlanExpanded(!strategicPlanExpanded)}
            className="w-full bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all text-left min-h-[48px]"
            data-name="btn_strategic_plan_toggle"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Your Strategic Plan
                  </h2>
                  <p className="text-white/60 text-xs mt-0.5" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {overallCompletion}% complete
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Progress Circle */}
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - overallCompletion / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22D3EE" />
                        <stop offset="100%" stopColor="#A855F7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-[10px]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      {overallCompletion}%
                    </span>
                  </div>
                </div>

                {/* Expand/Collapse Icon */}
                <motion.div
                  animate={{ rotate: strategicPlanExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-white/70" />
                </motion.div>
              </div>
            </div>
          </motion.button>

          {/* Expanded Content - Action Items with Checkboxes */}
          <AnimatePresence>
            {strategicPlanExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 mt-4">
                  {/* Immediate Move Section */}
                  {actionItems.filter(item => item.section === 'immediate_move').length > 0 && (
                    <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                            <span className="text-cyan-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                              1
                            </span>
                          </div>
                          <p className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                            Immediate Move
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                            {sectionCompletions.find(s => s.section === 'immediate_move')?.percentage || 0}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {actionItems
                          .filter(item => item.section === 'immediate_move')
                          .map((item) => (
                            <motion.button
                              key={item.id}
                              onClick={() => handleToggleActionItem(item.id, item.completed)}
                              className="w-full flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-left group"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              data-name={`btn_action_${item.id}`}
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                {item.completed ? (
                                  <CheckSquare className="w-5 h-5 text-green-400" />
                                ) : (
                                  <Square className="w-5 h-5 text-white/30 group-hover:text-white/50" />
                                )}
                              </div>
                              <p className={`text-sm flex-1 leading-relaxed ${
                                item.completed ? 'text-white/50 line-through' : 'text-white/90'
                              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                {item.step_text}
                              </p>
                            </motion.button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Strategic Tool Section */}
                  {actionItems.filter(item => item.section === 'strategic_tool').length > 0 && (
                    <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                            <span className="text-purple-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                              2
                            </span>
                          </div>
                          <p className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                            Strategic Tool
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                            {sectionCompletions.find(s => s.section === 'strategic_tool')?.percentage || 0}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {actionItems
                          .filter(item => item.section === 'strategic_tool')
                          .map((item) => (
                            <motion.button
                              key={item.id}
                              onClick={() => handleToggleActionItem(item.id, item.completed)}
                              className="w-full flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-left group"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              data-name={`btn_action_${item.id}`}
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                {item.completed ? (
                                  <CheckSquare className="w-5 h-5 text-green-400" />
                                ) : (
                                  <Square className="w-5 h-5 text-white/30 group-hover:text-white/50" />
                                )}
                              </div>
                              <p className={`text-sm flex-1 leading-relaxed ${
                                item.completed ? 'text-white/50 line-through' : 'text-white/90'
                              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                {item.step_text}
                              </p>
                            </motion.button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Analytical Check Section */}
                  {actionItems.filter(item => item.section === 'analytical_check').length > 0 && (
                    <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                            <span className="text-pink-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                              3
                            </span>
                          </div>
                          <p className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                            Analytical Check
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-pink-400 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                            {sectionCompletions.find(s => s.section === 'analytical_check')?.percentage || 0}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {actionItems
                          .filter(item => item.section === 'analytical_check')
                          .map((item) => (
                            <motion.button
                              key={item.id}
                              onClick={() => handleToggleActionItem(item.id, item.completed)}
                              className="w-full flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-left group"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              data-name={`btn_action_${item.id}`}
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                {item.completed ? (
                                  <CheckSquare className="w-5 h-5 text-green-400" />
                                ) : (
                                  <Square className="w-5 h-5 text-white/30 group-hover:text-white/50" />
                                )}
                              </div>
                              <p className={`text-sm flex-1 leading-relaxed ${
                                item.completed ? 'text-white/50 line-through' : 'text-white/90'
                              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                {item.step_text}
                              </p>
                            </motion.button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Long-Term Strategy Section */}
                  {actionItems.filter(item => item.section === 'long_term_fix').length > 0 && (
                    <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                            <span className="text-yellow-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                              4
                            </span>
                          </div>
                          <p className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                            Long-Term Strategy
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                            {sectionCompletions.find(s => s.section === 'long_term_fix')?.percentage || 0}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {actionItems
                          .filter(item => item.section === 'long_term_fix')
                          .map((item) => (
                            <motion.button
                              key={item.id}
                              onClick={() => handleToggleActionItem(item.id, item.completed)}
                              className="w-full flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-left group"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              data-name={`btn_action_${item.id}`}
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                {item.completed ? (
                                  <CheckSquare className="w-5 h-5 text-green-400" />
                                ) : (
                                  <Square className="w-5 h-5 text-white/30 group-hover:text-white/50" />
                                )}
                              </div>
                              <p className={`text-sm flex-1 leading-relaxed ${
                                item.completed ? 'text-white/50 line-through' : 'text-white/90'
                              }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                                {item.step_text}
                              </p>
                            </motion.button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PROFESSIONAL DISCLAIMER */}
          <div className="mt-4 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 backdrop-blur-md rounded-2xl p-4 border border-yellow-500/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-yellow-400 text-xs mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  IMPORTANT DISCLAIMER
                </p>
                <p className="text-white/80 text-xs leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  This analysis provides AI-generated strategic insights based on psychological patterns and communication dynamics. 
                  It is <span className="text-white" style={{ fontWeight: 600 }}>not a substitute for professional legal, medical, or therapeutic advice</span>. 
                  For legal matters, please consult a qualified solicitor. For mental health concerns, seek support from a licensed professional. 
                  Use these insights as guidance for strategic thinking, not as definitive legal counsel.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Level */}
        {analysisData.confidenceLevel > 0 && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-white/70 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Analysis Confidence
              </p>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${analysisData.confidenceLevel}%` }}
                  />
                </div>
                <span className="text-green-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  {analysisData.confidenceLevel}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handleRadarScan}
            className="w-full py-5 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-cyan-400/20 hover:from-cyan-400/30 hover:via-blue-500/30 hover:to-cyan-400/30 backdrop-blur-md border-2 border-cyan-400/40 hover:border-cyan-400/60 rounded-full transition-all min-h-[60px] btn-press-strong btn-hover-lift shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 relative overflow-hidden group flex items-center justify-center"
            data-name="btn_new_analysis"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-300/20 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
            
            <span className="text-white relative z-10" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              New Analysis
            </span>
          </button>

          {/* PDF Export Button (Premium/Professional only) */}
          {user && canExportToPDF(user.paymentPlan) && (
            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:from-purple-600 disabled:to-pink-600 rounded-full transition-all min-h-[56px] disabled:opacity-50 btn-press-strong btn-hover-lift"
              data-name="btn_export_pdf"
            >
              <div className="flex items-center justify-center gap-2">
                <Download className="w-5 h-5 text-white" />
                <span className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  {isExportingPDF ? 'Generating PDF...' : 'Download PDF Report'}
                </span>
              </div>
            </button>
          )}

          <button
            onClick={handleBackToHome}
            className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-all min-h-[56px] btn-press btn-hover-lift"
            data-name="btn_return_home"
          >
            <div className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5 text-white" />
              <span className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Return Home
              </span>
            </div>
          </button>
        </div>

        {/* Attribution */}
        <div className="text-center py-6">
          <p className="text-white/40 text-xs mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Analysis powered by
          </p>
          <p className="text-white/60 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            The Maverick Enigma™
          </p>
          <p className="text-white/40 text-xs mt-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Advanced Psychological Intelligence
          </p>
        </div>
      </motion.div>

      {/* Navigation Bar */}
      <div className="pb-6">
        <NavigationBar
          activeTab={activeTab}
          onTabChange={onTabChange || (() => {})}
          onRadarScan={handleRadarScan}
        />
      </div>

      {/* Info Modal */}
      <InfoModal />
    </div>
  );
}
