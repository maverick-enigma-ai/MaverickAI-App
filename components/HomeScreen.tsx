import { Activity, Zap, Brain, Target, TrendingUp, Shield, Info } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { BrandHeader } from './BrandHeader';
import { RadarIcon } from './RadarIcon';
import { ErrorModal } from './ErrorModal';
import { PlatformCapabilitiesModal } from './PlatformCapabilitiesModal';
import radarLogo from 'figma:asset/919388dc4d04697158bf4bad0facd25f4c685559.png';

interface HomeScreenProps {
  onStartAnalysis: () => void;
  error?: string | null;
  onClearError?: () => void;
}

export function HomeScreen({ onStartAnalysis, error, onClearError }: HomeScreenProps) {
  const [showCapabilities, setShowCapabilities] = useState(false);
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] relative overflow-hidden pb-32">
      {/* Background Enhancement */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <BrandHeader showPulse />

        {/* Info Button - Top Right */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            delay: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className="absolute top-6 right-6 z-20"
        >
          <motion.button
            onClick={() => setShowCapabilities(true)}
            whileHover={{ 
              scale: 1.15,
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              borderColor: "rgba(0, 212, 255, 0.8)"
            }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border-2 border-cyan-400/40 flex items-center justify-center transition-all duration-300 btn-press shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 relative overflow-hidden group"
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
              className="absolute inset-0 rounded-full border-2 border-cyan-300"
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
              className="absolute inset-0 rounded-full border-2 border-cyan-400"
            />
            
            <Info className="w-7 h-7 text-cyan-200 group-hover:text-white transition-colors relative z-10 drop-shadow-lg" />
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <div className="px-6">
          {/* Hero Card */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center shadow-2xl shadow-cyan-500/10 relative overflow-hidden">
              {/* Animated gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-50" />
              
              <div className="relative">
                {/* Award-winning Radar Icon */}
                <div className="mx-auto mb-6">
                  <RadarIcon size={96} animated />
                </div>
                
                <h3 className="text-white text-2xl mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>
                  Strategic Intelligence<br />Analysis
                </h3>
                
                <p className="text-cyan-200/90 text-sm mb-8 px-2 max-w-xs mx-auto" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Describe your situation for psychological power dynamics analysis
                </p>

                {/* CTA Button */}
                <button
                  onClick={onStartAnalysis}
                  className="w-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:via-cyan-400 hover:to-blue-400 text-white py-5 rounded-full transition-all duration-300 shadow-xl shadow-cyan-500/20 min-h-[60px] relative overflow-hidden group btn-press-strong btn-hover-lift animate-subtle-pulse"
                  data-name="btn_start_analysis"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  
                  {/* Pulse rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-300/30 animate-ping" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-2 rounded-full border-2 border-cyan-300/20 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
                  
                  <span className="relative flex items-center justify-center gap-2 text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>
                    <Zap className="w-5 h-5" />
                    Start Analysis
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Legal Footer - Single Line */}
          <div className="text-center mt-12 mb-8 px-4">
            <p className="text-white/40 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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
