import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
                style={{ 
                  color: '#00d4ff',
                  letterSpacing: '0.15em',
                  marginBottom: '4px',
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
                style={{ 
                  color: 'white',
                  letterSpacing: '0.18em',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: 500,
                  fontSize: '1.5rem'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                ENIGMA RADAR
                <span style={{ color: '#14b8a6', fontSize: '0.75rem', marginLeft: '4px', opacity: 0.8 }}>™</span>
              </motion.h2>

              {/* Tagline */}
              <motion.p
                style={{ 
                  color: '#14b8a6',
                  letterSpacing: '0.2em',
                  marginTop: '16px',
                  fontSize: '0.75rem',
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
                style={{ marginTop: '48px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {/* Animated dots */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#00d4ff'
                      }}
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
            style={{
              position: 'absolute',
              bottom: '48px',
              left: 0,
              right: 0,
              textAlign: 'center'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <p 
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              Advanced Psychological Intelligence
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
