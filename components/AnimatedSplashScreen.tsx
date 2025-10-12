import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RadarIcon } from './RadarIcon';

interface AnimatedSplashScreenProps {
  isLoading: boolean;
  onComplete?: () => void;
  minimumDisplayTime?: number; // Minimum time to show splash (ms)
}

export function AnimatedSplashScreen({ 
  isLoading, 
  onComplete,
  minimumDisplayTime = 2000 
}: AnimatedSplashScreenProps) {
  const [shouldShow, setShouldShow] = useState(true);
  const [hasMetMinimum, setHasMetMinimum] = useState(false);

  // Track minimum display time
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMetMinimum(true);
    }, minimumDisplayTime);

    return () => clearTimeout(timer);
  }, [minimumDisplayTime]);

  // Hide splash when both loading is done AND minimum time has passed
  useEffect(() => {
    if (!isLoading && hasMetMinimum) {
      // Add a small delay before hiding for smooth transition
      const hideTimer = setTimeout(() => {
        setShouldShow(false);
        if (onComplete) {
          onComplete();
        }
      }, 300);

      return () => clearTimeout(hideTimer);
    }
  }, [isLoading, hasMetMinimum, onComplete]);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] flex items-center justify-center overflow-hidden"
          style={{ minHeight: '100dvh' }}
        >
          {/* Ambient background glow */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl"
              style={{ x: '-50%', y: '-50%' }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Animated Radar Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.1
              }}
            >
              <RadarIcon size={120} animated />
            </motion.div>

            {/* Brand Name - Staggered entrance */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {/* MaverickAI */}
              <motion.h1
                className="text-cyan-400 tracking-[0.15em] mb-1"
                style={{ 
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: 600,
                  fontSize: '1.125rem'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                MAVERICKĀI
              </motion.h1>

              {/* Enigma Radar™ */}
              <motion.h2
                className="text-white tracking-[0.18em]"
                style={{ 
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: 500,
                  fontSize: '1.5rem'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                ENIGMA RADAR
                <span className="text-teal-400 text-xs ml-1 opacity-80">™</span>
              </motion.h2>

              {/* Tagline */}
              <motion.p
                className="text-teal-400 tracking-[0.2em] mt-4 text-xs opacity-70"
                style={{ 
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: 400
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1.0, duration: 0.4 }}
              >
                DECODE PSYCHOLOGICAL POWER DYNAMICS
              </motion.p>
            </motion.div>

            {/* Loading indicator - Only shows while actually loading */}
            {isLoading && (
              <motion.div
                className="mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {/* Animated dots */}
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-cyan-400"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom text */}
          <motion.div
            className="absolute bottom-12 left-0 right-0 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <p 
              className="text-white/50 text-xs tracking-wider"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Advanced Psychological Intelligence
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
