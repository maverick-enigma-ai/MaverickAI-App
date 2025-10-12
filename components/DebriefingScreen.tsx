import { useState, useEffect } from 'react';
import { Activity, Home, Info } from 'lucide-react';
import { BrandHeader } from './BrandHeader';
import { PlatformCapabilitiesModal } from './PlatformCapabilitiesModal';
import { motion } from 'motion/react';

interface DebriefingScreenProps {
  inputText: string;
  uploadedFiles: File[];
  onStartOver: () => void;
  onGoHome?: () => void;
}

export function DebriefingScreen({ inputText, uploadedFiles, onStartOver, onGoHome }: DebriefingScreenProps) {
  const [processingStep, setProcessingStep] = useState(0);
  const [showCapabilities, setShowCapabilities] = useState(false);

  const processingSteps = [
    { text: 'Initializing Enigma Radar™...', subtext: 'Establishing secure connection' },
    { text: 'MaverickAI analyzing patterns...', subtext: 'Deep psychological intelligence processing' },
    { text: 'Decoding power dynamics...', subtext: 'Advanced pattern recognition active' },
    { text: 'Calculating strategic metrics...', subtext: 'Quantifying psychological intelligence' },
    { text: 'Generating strategic moves...', subtext: 'Crafting actionable intelligence' },
    { text: 'Finalizing tactical debrief...', subtext: 'Almost ready for review' }
  ];

  useEffect(() => {
    // Cycle through processing steps continuously while waiting
    const interval = setInterval(() => {
      setProcessingStep(prev => (prev + 1) % processingSteps.length);
    }, 5000); // Change step every 5 seconds (slowed down from 3s)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] flex flex-col relative">
      {/* Background Enhancement */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      
      {/* Pulsing Info Button - Top Right */}
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
      
      {/* Header */}
      <BrandHeader subtitle="Analysis in Progress" showPulse />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-md w-full">
          
          {/* Main Processing Indicator */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 mb-6">
            <div className="text-center">
              {/* Radar Animation */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30" />
                
                {/* Middle ring */}
                <div className="absolute inset-4 rounded-full border-2 border-cyan-400/40" />
                
                {/* Inner ring */}
                <div className="absolute inset-8 rounded-full border-2 border-cyan-400/50" />
                
                {/* Center pulse */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" />
                </div>
                
                {/* Rotating sweep line */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                  <div className="w-1 h-16 bg-gradient-to-b from-cyan-400 to-transparent absolute top-0 left-1/2 transform -translate-x-1/2 origin-bottom" />
                </div>
                
                {/* Scanning dots */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-cyan-400 animate-ping" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-teal-400 animate-ping" style={{ animationDelay: '1s' }} />
                </div>
              </div>
              
              {/* Processing Status */}
              <div className="space-y-3">
                <h3 className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  {processingSteps[processingStep].text}
                </h3>
                
                <p className="text-cyan-300/80 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {processingSteps[processingStep].subtext}
                </p>
              </div>
              
              {/* Infinite Progress Bar */}
              <div className="mt-6 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-pulse" 
                     style={{ 
                       width: '100%',
                       animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                     }} 
                />
              </div>
              
              <p className="mt-4 text-xs text-gray-400" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                This typically takes 20-40 seconds
              </p>
            </div>
          </div>

          {/* What's Happening Behind the Scenes */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <Activity className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-white mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Behind the Scenes
                </h4>
                <ul className="space-y-2 text-sm text-gray-300" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>Advanced AI analyzing psychological power dynamics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span>Calculating strategic metrics and risk factors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-0.5">•</span>
                    <span>Generating personalized strategic recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Preparing comprehensive tactical debrief</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Input Summary (Collapsed) */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <h4 className="text-white text-sm mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              Your Request:
            </h4>
            
            {inputText && (
              <div className="mb-2">
                <p className="text-gray-200 text-xs bg-white/5 rounded-lg p-3 line-clamp-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {inputText}
                </p>
              </div>
            )}
            
            {uploadedFiles.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  + {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} attached
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Section with Home Button */}
      <div className="flex-shrink-0 p-6 border-t border-white/10 relative z-10">
        {/* Reassurance Text */}
        <div className="text-center mb-4">
          <p className="text-xs text-cyan-300/70" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            ✨ Your analysis will appear automatically when ready
          </p>
          <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Advanced AI Processing • Secure & Encrypted
          </p>
        </div>

        {/* Home Button - Award-Winning */}
        {onGoHome && (
          <div className="flex justify-center">
            <motion.button
              onClick={onGoHome}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-8 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border-2 border-white/20 hover:border-cyan-400/40 transition-all duration-300 min-h-[60px] shadow-xl hover:shadow-cyan-500/30 group relative overflow-hidden"
              data-name="btn_go_home"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              <motion.div
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative z-10"
              >
                <Home className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </motion.div>
              <span className="text-white relative z-10">
                Return Home
              </span>
            </motion.button>
          </div>
        )}
      </div>
      
      {/* Platform Capabilities Modal */}
      <PlatformCapabilitiesModal
        isOpen={showCapabilities}
        onClose={() => setShowCapabilities(false)}
      />
    </div>
  );
}
