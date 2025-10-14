import { Activity, Brain, Shield, Target, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface PlatformCapabilitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlatformCapabilitiesModal({ isOpen, onClose }: PlatformCapabilitiesModalProps) {
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check if content is scrollable
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
        const isScrollable = scrollHeight > clientHeight;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        setShowScrollIndicator(isScrollable && !isAtBottom);
      }
    };

    checkScroll();
    const scrollElement = scrollRef.current;
    scrollElement?.addEventListener('scroll', checkScroll);
    
    return () => scrollElement?.removeEventListener('scroll', checkScroll);
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with fade-in */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal with slide-up and scale animation */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              ref={scrollRef}
              className="w-full max-w-lg bg-gradient-to-br from-[#14123F] to-[#342FA5] rounded-3xl border border-white/20 shadow-2xl max-h-[85vh] overflow-y-auto pointer-events-auto relative scroll-smooth"
            >
              {/* Scroll indicator - shows there's more content below */}
              <AnimatePresence>
                {showScrollIndicator && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-24 left-1/2 transform -translate-x-1/2 pointer-events-none z-30"
                  >
                    <div className="bg-cyan-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg shadow-cyan-500/50 flex items-center gap-2">
                      <span className="text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        Scroll for more
                      </span>
                      <motion.div
                        animate={{ y: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-[#14123F] to-[#342FA5] border-b border-white/10 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>
              Platform Capabilities
            </h2>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors duration-200 btn-press"
              data-name="btn_close_capabilities"
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
          </div>
          <p className="text-cyan-300/80 text-sm mt-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Comprehensive psychological intelligence analysis
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Power Dynamics Mapping */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, borderColor: "rgba(0, 212, 255, 0.4)" }}
            className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 backdrop-blur-lg rounded-2xl p-5 border border-cyan-500/20 cursor-pointer transition-all duration-300 card-hover group"
          >
            <div className="flex items-start gap-4 mb-3">
              <motion.div 
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 flex-shrink-0 transition-shadow duration-300"
              >
                <Activity className="w-7 h-7 text-white" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-white text-lg mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Power Dynamics Mapping
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-transparent rounded-full" />
              </div>
            </div>
            <p className="text-cyan-100/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Decode complex psychological influence patterns and power structures within your situation. 
              Identifies who holds leverage, how influence flows, and where critical pressure points exist in interpersonal dynamics.
            </p>
          </motion.div>

          {/* Behavioral Analysis */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, borderColor: "rgba(139, 92, 246, 0.4)" }}
            className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-lg rounded-2xl p-5 border border-purple-500/20 cursor-pointer transition-all duration-300 card-hover group"
          >
            <div className="flex items-start gap-4 mb-3">
              <motion.div 
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 flex-shrink-0 transition-shadow duration-300"
              >
                <Brain className="w-7 h-7 text-white" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-white text-lg mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Behavioral Analysis
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-transparent rounded-full" />
              </div>
            </div>
            <p className="text-purple-100/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Advanced psychological insights into motivations, intentions, and behavioral patterns. 
              Reveals hidden agendas, emotional drivers, and cognitive biases affecting decision-making and relationship dynamics.
            </p>
          </motion.div>

          {/* Risk Evaluation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, borderColor: "rgba(239, 68, 68, 0.4)" }}
            className="bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-lg rounded-2xl p-5 border border-red-500/20 cursor-pointer transition-all duration-300 card-hover group"
          >
            <div className="flex items-start gap-4 mb-3">
              <motion.div 
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 flex-shrink-0 transition-shadow duration-300"
              >
                <Shield className="w-7 h-7 text-white" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-white text-lg mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Risk Evaluation
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-red-400 to-transparent rounded-full" />
              </div>
            </div>
            <p className="text-red-100/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Comprehensive assessment of threats, vulnerabilities, and potential consequences. 
              Identifies red flags, manipulation tactics, and danger zones that could escalate conflicts or compromise your position.
            </p>
          </motion.div>

          {/* Strategic Recommendations */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, borderColor: "rgba(20, 184, 166, 0.4)" }}
            className="bg-gradient-to-br from-teal-500/10 to-teal-600/10 backdrop-blur-lg rounded-2xl p-5 border border-teal-500/20 cursor-pointer transition-all duration-300 card-hover group"
          >
            <div className="flex items-start gap-4 mb-3">
              <motion.div 
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:shadow-teal-500/50 flex-shrink-0 transition-shadow duration-300"
              >
                <Target className="w-7 h-7 text-white" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-white text-lg mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Strategic Recommendations
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-teal-400 to-transparent rounded-full" />
              </div>
            </div>
            <p className="text-teal-100/90 text-sm leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Actionable tactical playbook with specific moves for immediate impact and long-term positioning. 
              Provides step-by-step guidance to regain control, protect your interests, and achieve strategic objectives.
            </p>
          </motion.div>
        </div>

        {/* Footer - Award-winning button */}
        <div className="sticky bottom-0 bg-gradient-to-br from-[#14123F] to-[#342FA5] border-t border-white/10 p-6 rounded-b-3xl z-20">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:via-cyan-400 hover:to-blue-400 text-white py-5 rounded-full transition-all duration-300 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/60 btn-press-strong relative overflow-hidden group min-h-[60px]"
            data-name="btn_close_capabilities_footer"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {/* Animated gradient background */}
            <motion.div
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-white/20 to-cyan-400/0 opacity-0 group-hover:opacity-100"
              style={{ backgroundSize: '200% 100%' }}
            />
            
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '2s' }} />
            
            <span className="relative flex items-center justify-center gap-2" style={{ fontWeight: 700 }}>
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
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}