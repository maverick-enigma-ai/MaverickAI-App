import { useState, useEffect, useRef } from 'react';
import { Activity, Home as HomeIcon, Info } from 'lucide-react';
import { BrandHeader } from './BrandHeader';
import { PlatformCapabilitiesModal } from './PlatformCapabilitiesModal';
import { motion } from 'framer-motion';
import { BRAND_COLORS } from '../utils/brand-colors';
import { supabase } from '../utils/supabase/client';

type DebriefingScreenProps = {
  jobId: string;
  inputText: string;
  uploadedFiles: File[];
  onStartOver: () => void;
  onGoHome?: () => void;
  onCompleted?: (analysisId: string) => void;
  onFailed?: (message?: string) => void;
};

export function DebriefingScreen({
  jobId,
  inputText,
  uploadedFiles,
  onStartOver,
  onGoHome,
  onCompleted,
  onFailed,
}: DebriefingScreenProps) {
  const [processingStep, setProcessingStep] = useState(0);
  const [showCapabilities, setShowCapabilities] = useState(false);
  const firedRef = useRef(false);

  const processingSteps = [
    { text: 'Initializing Enigma Radar™...', subtext: 'Establishing secure connection' },
    { text: 'MaverickAI analyzing patterns...', subtext: 'Deep psychological intelligence processing' },
    { text: 'Decoding power dynamics...', subtext: 'Advanced pattern recognition active' },
    { text: 'Calculating strategic metrics...', subtext: 'Quantifying psychological intelligence' },
    { text: 'Generating strategic moves...', subtext: 'Crafting actionable intelligence' },
    { text: 'Finalizing tactical debrief...', subtext: 'Almost ready for review' },
  ];

  // Cycle through processing steps while waiting
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingStep((prev) => (prev + 1) % processingSteps.length);
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial fetch + Realtime subscription on submissions(job_id)
  useEffect(() => {
    if (!jobId) return;

    (async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('status, analysis_id, error_json')
        .eq('job_id', jobId)
        .single();

      if (error) {
        // non-fatal; just wait for realtime
      } else if (!firedRef.current && data?.status === 'completed') {
        firedRef.current = true;
        onCompleted?.(data.analysis_id || jobId);
        return;
      } else if (!firedRef.current && data?.status === 'failed') {
        firedRef.current = true;
        onFailed?.(data?.error_json || 'Analysis failed');
        return;
      }
    })();

    const channel = supabase
      .channel(`submission-status-${jobId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'submissions', filter: `job_id=eq.${jobId}` },
        (payload) => {
          if (firedRef.current) return;
          const newStatus = payload.new?.status;
          if (newStatus === 'completed') {
            firedRef.current = true;
            const analysisId = payload.new?.analysis_id || jobId;
            onCompleted?.(analysisId);
          } else if (newStatus === 'failed') {
            firedRef.current = true;
            onFailed?.(payload.new?.error_json || 'Analysis failed');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, onCompleted, onFailed]);

  return (
    <div
      className="w-full min-h-[100dvh] flex flex-col relative"
      style={{ background: BRAND_COLORS.gradients.background }}
    >
      {/* Background Enhancement */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />

      {/* Pulsing Info Button - Top Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
        className="absolute sm:top-6 top-4 sm:right-6 right-4 z-20"
      >
        <motion.button
          onClick={() => setShowCapabilities(true)}
          whileHover={{
            scale: 1.15,
            backgroundColor: BRAND_COLORS.glass.intense,
            borderColor: `${BRAND_COLORS.cyan}CC`,
          }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/15 backdrop-blur-sm md:backdrop-blur-md border-2 border-cyan-400/40 flex items-center justify-center transition-all duration-300 btn-press shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 relative overflow-hidden group"
          data-name="btn_info_capabilities"
          aria-label="View platform capabilities"
        >
          {/* Double pulse ring animation - brighter */}
          <motion.div
            animate={{ scale: [1, 1.8, 1.8], opacity: [0.6, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
            className="absolute inset-0 rounded-full border-2 border-cyan-300"
          />
          <motion.div
            animate={{ scale: [1, 1.8, 1.8], opacity: [0.6, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5, delay: 1 }}
            className="absolute inset-0 rounded-full border-2 border-cyan-400"
          />
          <Info
            className="w-7 h-7 group-hover:text-white transition-colors relative z-10 drop-shadow-lg"
            style={{ color: BRAND_COLORS.cyanText }}
          />
        </motion.button>
      </motion.div>

      {/* Header */}
      <BrandHeader subtitle="Analysis in Progress" showPulse />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-md w-full">
          {/* Main Processing Indicator */}
          <div
            className="rounded-3xl p-8 border mb-6 relative overflow-hidden"
            style={{
              background: BRAND_COLORS.glass.strong,
              backdropFilter: 'blur(30px) saturate(200%)',
              WebkitBackdropFilter: 'blur(30px) saturate(200%)',
              borderColor: BRAND_COLORS.borders.cyan,
              boxShadow: `0 20px 60px rgba(0, 0, 0, 0.3), 0 10px 30px ${BRAND_COLORS.cyan}20, 0 0 80px ${BRAND_COLORS.cyan}10`,
            }}
          >
            {/* Premium glow effect background */}
            <div
              className="absolute inset-0 opacity-20 blur-2xl"
              style={{ background: `radial-gradient(circle at 50% 50%, ${BRAND_COLORS.cyan}, transparent 70%)` }}
            />

            <div className="text-center relative z-10">
              {/* Radar Animation */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-8">
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ border: `2px solid ${BRAND_COLORS.cyan}`, opacity: 0.2, animationDuration: '3s' }}
                />
                <div className="absolute inset-0 rounded-full" style={{ border: `2px solid ${BRAND_COLORS.cyan}40` }} />
                <div className="absolute inset-4 rounded-full" style={{ border: `2px solid ${BRAND_COLORS.cyan}60` }} />
                <div className="absolute inset-8 rounded-full" style={{ border: `2px solid ${BRAND_COLORS.cyan}80` }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full animate-pulse"
                    style={{
                      background: BRAND_COLORS.gradients.cyanBlue,
                      boxShadow: `0 0 30px ${BRAND_COLORS.cyan}80, 0 0 60px ${BRAND_COLORS.cyan}40`,
                    }}
                  />
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                  <div
                    className="w-1 h-16 absolute top-0 left-1/2 transform -translate-x-1/2 origin-bottom"
                    style={{ background: `linear-gradient(to bottom, ${BRAND_COLORS.cyan}, transparent)` }}
                  />
                </div>
                <div className="absolute inset-0">
                  <div
                    className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full animate-ping"
                    style={{ backgroundColor: BRAND_COLORS.purple }}
                  />
                  <div
                    className="absolute bottom-1/3 left-1/3 w-3 h-3 rounded-full animate-ping"
                    style={{ backgroundColor: BRAND_COLORS.cyan, animationDelay: '0.5s' }}
                  />
                  <div
                    className="absolute top-1/2 right-1/3 w-3 h-3 rounded-full animate-ping"
                    style={{ backgroundColor: BRAND_COLORS.teal, animationDelay: '1s' }}
                  />
                </div>
              </div>

              {/* Processing Status */}
              <div className="space-y-3 mb-6">
                <h3
                  style={{
                    color: BRAND_COLORS.text.white,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 600,
                    fontSize: '1.25rem',
                  }}
                >
                  {processingSteps[processingStep].text}
                </h3>
                <p
                  style={{
                    color: BRAND_COLORS.cyanText,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '0.875rem',
                  }}
                >
                  {processingSteps[processingStep].subtext}
                </p>
              </div>

              {/* Infinite Progress Bar */}
              <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: BRAND_COLORS.glass.normal }}>
                <div
                  className="h-full animate-pulse"
                  style={{
                    background: BRAND_COLORS.gradients.cyanBlue,
                    width: '100%',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    boxShadow: `0 0 10px ${BRAND_COLORS.cyan}80`,
                  }}
                />
              </div>

              <p
                className="mt-4"
                style={{
                  color: BRAND_COLORS.text.whiteSubtle,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '0.75rem',
                }}
              >
                This typically takes 20–40 seconds
              </p>
            </div>
          </div>

          {/* What's Happening */}
          <div
            className="rounded-2xl p-6 border mb-6 relative overflow-hidden"
            style={{
              background: BRAND_COLORS.glass.strong,
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              borderColor: BRAND_COLORS.borders.cyan,
              boxShadow: `0 15px 40px rgba(0, 0, 0, 0.25), 0 8px 20px ${BRAND_COLORS.cyan}15, 0 0 60px ${BRAND_COLORS.cyan}08`,
            }}
          >
            <div className="absolute inset-0 opacity-10 blur-xl" style={{ background: `radial-gradient(circle at 30% 30%, ${BRAND_COLORS.cyan}, transparent 60%)` }} />
            <div className="flex items-start gap-3 mb-4 relative z-10">
              <Activity className="w-5 h-5 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.cyan }} />
              <div>
                <h4
                  style={{
                    color: BRAND_COLORS.text.white,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                  }}
                >
                  Behind the Scenes
                </h4>
                <ul className="space-y-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '0.875rem' }}>
                  <li className="flex items-start gap-2">
                    <span style={{ color: BRAND_COLORS.cyan, marginTop: '0.125rem' }}>•</span>
                    <span style={{ color: BRAND_COLORS.text.whiteSubtle }}>Advanced AI analyzing psychological power dynamics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: BRAND_COLORS.purple, marginTop: '0.125rem' }}>•</span>
                    <span style={{ color: BRAND_COLORS.text.whiteSubtle }}>Calculating strategic metrics and risk factors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: BRAND_COLORS.teal, marginTop: '0.125rem' }}>•</span>
                    <span style={{ color: BRAND_COLORS.text.whiteSubtle }}>Generating personalized strategic recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: BRAND_COLORS.blue, marginTop: '0.125rem' }}>•</span>
                    <span style={{ color: BRAND_COLORS.text.whiteSubtle }}>Preparing comprehensive tactical debrief</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Input Summary */}
          <div
            className="rounded-2xl p-4 border relative overflow-hidden"
            style={{
              background: BRAND_COLORS.glass.strong,
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              borderColor: BRAND_COLORS.borders.cyan,
              boxShadow: `0 15px 40px rgba(0, 0, 0, 0.25), 0 8px 20px ${BRAND_COLORS.cyan}15, 0 0 60px ${BRAND_COLORS.cyan}08`,
            }}
          >
            <div className="absolute inset-0 opacity-10 blur-xl" style={{ background: `radial-gradient(circle at 70% 30%, ${BRAND_COLORS.teal}, transparent 60%)` }} />
            <h4
              className="relative z-10"
              style={{
                color: BRAND_COLORS.text.white,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 600,
                fontSize: '0.875rem',
                marginBottom: '0.75rem',
              }}
            >
              Your Request:
            </h4>

            {!!inputText && (
              <div className="mb-2 relative z-10">
                <p
                  className="line-clamp-2 rounded-lg p-3"
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '0.75rem',
                    color: BRAND_COLORS.text.whiteSubtle,
                    background: BRAND_COLORS.glass.subtle,
                  }}
                >
                  {inputText}
                </p>
              </div>
            )}

            {uploadedFiles?.length > 0 && (
              <div className="relative z-10">
                <p
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontSize: '0.75rem',
                    color: BRAND_COLORS.text.whiteFaded,
                    marginBottom: '0.25rem',
                  }}
                >
                  + {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} attached
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section with Home Button */}
      <div className="flex-shrink-0 p-6 relative z-10" style={{ borderTop: `1px solid ${BRAND_COLORS.borders.normal}` }}>
        <div className="text-center mb-4">
          <p
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '0.75rem',
              color: BRAND_COLORS.cyanText,
            }}
          >
            ✨ Your analysis will appear automatically when ready
          </p>
          <p
            className="mt-1"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '0.75rem',
              color: BRAND_COLORS.text.whiteFaded,
            }}
          >
            Advanced AI Processing • Secure & Encrypted
          </p>
        </div>

        {onGoHome && (
          <div className="flex justify-center">
            <motion.button
              onClick={onGoHome}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-8 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm md:backdrop-blur-md rounded-full border-2 border-white/20 hover:border-cyan-400/40 transition-all duration-300 min-h-[60px] shadow-xl hover:shadow-cyan-500/30 group relative overflow-hidden"
              data-name="btn_go_home"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <motion.div animate={{ x: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }} className="relative z-10">
                <HomeIcon className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </motion.div>
              <span className="text-white relative z-10">Return Home</span>
            </motion.button>
          </div>
        )}
      </div>

      <PlatformCapabilitiesModal isOpen={showCapabilities} onClose={() => setShowCapabilities(false)} />
    </div>
  );
}
