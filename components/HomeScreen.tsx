import { Activity, Zap, Brain, Target, TrendingUp, Shield, Info } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrandHeader } from './BrandHeader';
import { RadarIcon } from './RadarIcon';
import { ErrorModal } from './ErrorModal';
import { PlatformCapabilitiesModal } from './PlatformCapabilitiesModal';
import { BRAND_COLORS } from '../utils/brand-colors';

interface HomeScreenProps {
  onStartAnalysis: () => void;
  error?: string | null;
  onClearError?: () => void;
}

export function HomeScreen({ onStartAnalysis, error, onClearError }: HomeScreenProps) {
  const [showCapabilities, setShowCapabilities] = useState(false);
  return (
    <div className="w-full min-h-[100dvh] relative overflow-hidden pb-[max(4rem,env(safe-area-inset-bottom))]" style={{
      background: BRAND_COLORS.gradients.background
    }}>
      {/* Background Enhancement */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(to bottom right, ${BRAND_COLORS.cyan}0D 0%, transparent 50%, ${BRAND_COLORS.purple}0D 100%)`
      }} />
      <div className="absolute top-1/4 left-1/2 w-96 h-96 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" style={{
        background: `${BRAND_COLORS.cyan}1A`
      }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{
        background: `${BRAND_COLORS.purple}1A`
      }} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <BrandHeader showPulse />

        {/* Info Button - Top Right - Below Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            delay: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="absolute sm:top-24 top-20 sm:right-6 right-4 z-20"
        >
          <motion.button
            onClick={() => setShowCapabilities(true)}
            whileHover={{ 
              scale: 1.15,
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              borderColor: `${BRAND_COLORS.cyan}CC`
            }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full backdrop-blur-sm md:backdrop-blur-md flex items-center justify-center transition-all duration-300 btn-press shadow-xl relative overflow-hidden group"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: `2px solid ${BRAND_COLORS.cyan}66`,
              boxShadow: `0 20px 60px ${BRAND_COLORS.cyan}4D`
            }}
            data-name="btn_info_capabilities"
            aria-label="View platform capabilities"
          >
            {/* Double pulse ring animation - brighter */}
            <motion.div
              animate={{
                scale: [1, 1.8, 1.8],
                opacity: [0.6, 0, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 0.5
              }}
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid ${BRAND_COLORS.cyan}`
              }}
            />
            <motion.div
              animate={{
                scale: [1, 1.8, 1.8],
                opacity: [0.6, 0, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 0.5,
                delay: 1
              }}
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid ${BRAND_COLORS.cyan}`
              }}
            />
            
            <Info className="w-7 h-7 group-hover:text-white transition-colors relative z-10 drop-shadow-lg" style={{
              color: BRAND_COLORS.cyanText  // Exact Figma cyan (#22D3EE)
            }} />
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <div className="px-6">
          {/* Hero Card */}
          <div className="mb-8">
            <div className="backdrop-blur-sm md:backdrop-blur-md md:backdrop-blur-xl rounded-3xl p-8 border text-center shadow-2xl relative overflow-hidden" style={{
              background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              boxShadow: `0 25px 50px ${BRAND_COLORS.cyan}1A`
            }}>
              {/* Animated gradient border effect */}
              <div className="absolute inset-0 rounded-3xl blur-xl opacity-50" style={{
                background: `linear-gradient(to right, ${BRAND_COLORS.cyan}26, ${BRAND_COLORS.purple}26, ${BRAND_COLORS.teal}26)`
              }} />
              
              <div className="relative">
                {/* Award-winning Radar Icon */}
                <div className="mx-auto mb-6">
                  <RadarIcon size={96} animated />
                </div>
                
                <h3 style={{ 
                  color: BRAND_COLORS.text.white,
                  fontSize: '1.5rem',
                  marginBottom: '0.75rem',
                  fontFamily: 'system-ui, -apple-system, sans-serif', 
                  fontWeight: 700 
                }}>
                  Strategic Intelligence<br />Analysis
                </h3>
                
                <p className="text-sm mb-8 px-2 max-w-xs mx-auto" style={{ 
                  color: BRAND_COLORS.cyanText,
                  fontFamily: 'system-ui, -apple-system, sans-serif' 
                }}>
                  Describe your situation for psychological power dynamics analysis
                </p>

                {/* CTA Button - AWARD-WINNING FIGMA BASELINE MATCH (Reduced Haze) */}
                <button
                  onClick={onStartAnalysis}
                  className="w-full py-5 rounded-full transition-all duration-300 shadow-xl min-h-[60px] relative overflow-hidden group btn-press-strong btn-hover-lift animate-subtle-pulse"
                  style={{
                    background: BRAND_COLORS.gradients.cyanBlue,  // Exact Figma: #06b6d4 → #3b82f6
                    color: '#ffffff',  // White text for best contrast on gradient
                    boxShadow: `0 20px 60px rgba(6, 182, 212, 0.5), 0 10px 30px rgba(6, 182, 212, 0.3)`,
                    backdropFilter: 'blur(8px) saturate(180%)'  // Reduced blur for clarity
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 25px 80px rgba(6, 182, 212, 0.6), 0 15px 40px rgba(6, 182, 212, 0.4)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 20px 60px rgba(6, 182, 212, 0.5), 0 10px 30px rgba(6, 182, 212, 0.3)`;
                  }}
                  data-name="btn_start_analysis"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" style={{
                    background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent)'
                  }} />
                  
                  {/* Pulse rings */}
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ 
                    border: `2px solid ${BRAND_COLORS.cyan}4D`,
                    animationDuration: '3s' 
                  }} />
                  <div className="absolute inset-2 rounded-full animate-ping" style={{ 
                    border: `2px solid ${BRAND_COLORS.cyan}33`,
                    animationDuration: '3s', 
                    animationDelay: '1s' 
                  }} />
                  
                  <span className="relative flex items-center justify-center gap-2 text-lg" style={{ 
                    fontFamily: 'system-ui, -apple-system, sans-serif', 
                    fontWeight: 700 
                  }}>
                    <Zap className="w-5 h-5" />
                    Start Analysis
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Legal Footer - Single Line */}
          <div className="text-center mt-12 mb-8 px-4">
            <p className="text-xs" style={{ 
              color: 'rgba(255, 255, 255, 0.4)',
              fontFamily: 'system-ui, -apple-system, sans-serif' 
            }}>
              © 2025 MaverickAI Enigma Radar™. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={!!error}
        title="Analysis Error"
        message={error || ''}
        onClose={onClearError || (() => {})}
        onRetry={() => {
          if (onClearError) onClearError();
          onStartAnalysis();
        }}
      />

      {/* Platform Capabilities Modal */}
      <PlatformCapabilitiesModal
        isOpen={showCapabilities}
        onClose={() => setShowCapabilities(false)}
      />
    </div>
  );
}
