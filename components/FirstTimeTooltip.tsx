import { useState, useEffect } from 'react';
import { X, Upload, Zap } from 'lucide-react';

interface FirstTimeTooltipProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FirstTimeTooltip({ isOpen, onClose }: FirstTimeTooltipProps) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 3) {
      onClose();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Overlay with cutouts */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto" onClick={handleNext} />
      
      {/* Step 1: File Upload Button Highlight */}
      {step === 1 && (
        <>
          {/* Highlight circle around file upload button (bottom left) */}
          <div 
            className="absolute bottom-[120px] left-[16px] w-[52px] h-[52px] rounded-full border-4 border-cyan-400 animate-pulse pointer-events-none"
            style={{ boxShadow: '0 0 0 4px rgba(0, 212, 255, 0.2), 0 0 40px rgba(0, 212, 255, 0.6)' }}
          />
          
          {/* Tooltip */}
          <div 
            className="absolute bottom-[190px] left-[16px] w-[280px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 pointer-events-auto"
            data-name="tooltip_file_upload"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Upload Files
                </h3>
                <p className="text-xs text-cyan-300" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Tap the <strong>+</strong> button to attach documents, images, or screenshots for analysis.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                1 of 3
              </span>
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-sm transition-colors"
                data-name="btn_tooltip_next_1"
              >
                <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Next</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Step 2: Text Input Highlight */}
      {step === 2 && (
        <>
          {/* Highlight around text input area (centered) */}
          <div 
            className="absolute bottom-[96px] left-[84px] right-[84px] h-[52px] rounded-2xl border-4 border-cyan-400 animate-pulse pointer-events-none"
            style={{ boxShadow: '0 0 0 4px rgba(0, 212, 255, 0.2), 0 0 40px rgba(0, 212, 255, 0.6)' }}
          />
          
          {/* Tooltip */}
          <div 
            className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 pointer-events-auto"
            data-name="tooltip_text_input"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                <span className="text-2xl">✍️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Describe Your Situation
                </h3>
                <p className="text-xs text-cyan-300" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Type your scenario here - describe the relationship, communication, or situation you want analyzed.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-gray-400 hover:text-white transition-colors"
                data-name="btn_tooltip_back_2"
              >
                <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Back</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  2 of 3
                </span>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-sm transition-colors"
                  data-name="btn_tooltip_next_2"
                >
                  <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Next</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Step 3: Radar Button Highlight */}
      {step === 3 && (
        <>
          {/* Highlight circle around radar button (bottom right) */}
          <div 
            className="absolute bottom-[120px] right-[16px] w-[52px] h-[52px] rounded-full border-4 border-cyan-400 animate-pulse pointer-events-none"
            style={{ boxShadow: '0 0 0 4px rgba(0, 212, 255, 0.2), 0 0 40px rgba(0, 212, 255, 0.6)' }}
          />
          
          {/* Tooltip */}
          <div 
            className="absolute bottom-[190px] right-[16px] w-[280px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 pointer-events-auto"
            data-name="tooltip_radar_button"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Run Your Analysis
                </h3>
                <p className="text-xs text-cyan-300 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  The Radar button <strong>glows</strong> when you're ready! Tap it to analyze your situation.
                </p>
                <p className="text-xs text-purple-300" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  💡 You can upload files + add text together for deeper insights!
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-gray-400 hover:text-white transition-colors"
                data-name="btn_tooltip_back_3"
              >
                <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Back</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  3 of 3
                </span>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-sm transition-all active:scale-95"
                  data-name="btn_tooltip_complete"
                >
                  <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Got It! ✨</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Skip button - always visible */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors pointer-events-auto"
        data-name="btn_skip_tutorial"
      >
        <X className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
