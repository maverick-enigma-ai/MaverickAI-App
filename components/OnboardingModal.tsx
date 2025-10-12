import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { ScenarioCategory } from '../types/sample-scenarios';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (preferences: OnboardingPreferences) => void;
}

export interface OnboardingPreferences {
  showSampleScenarios: boolean;
  enabledScenarios: ScenarioCategory[];
  textSize: 'small' | 'medium' | 'large';
  enableAnalytics: boolean;
}

const scenarioOptions = [
  { id: 'corporate' as ScenarioCategory, label: 'Corporate & Workplace', icon: '💼' },
  { id: 'personal' as ScenarioCategory, label: 'Personal Relationships', icon: '👥' },
  { id: 'wealth' as ScenarioCategory, label: 'Wealth & Business', icon: '💰' },
  { id: 'legal' as ScenarioCategory, label: 'Legal & Negotiations', icon: '⚖️' }
];

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [showSampleScenarios, setShowSampleScenarios] = useState(true);
  const [enabledScenarios, setEnabledScenarios] = useState<ScenarioCategory[]>([
    'corporate', 'personal', 'wealth', 'legal'
  ]);
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [enableAnalytics, setEnableAnalytics] = useState(true);

  if (!isOpen) return null;

  const toggleScenario = (scenario: ScenarioCategory) => {
    setEnabledScenarios(prev => {
      if (prev.includes(scenario)) {
        // Don't allow disabling all scenarios
        if (prev.length === 1) return prev;
        return prev.filter(s => s !== scenario);
      }
      return [...prev, scenario];
    });
  };

  const handleComplete = () => {
    onComplete({
      showSampleScenarios,
      enabledScenarios,
      textSize,
      enableAnalytics
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] rounded-3xl border border-white/20 backdrop-blur-md overflow-hidden"
        data-name="modal_onboarding"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Welcome to MaverickAI Enigma Radar™
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === step ? 'w-8 bg-cyan-400' : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-cyan-300" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Let's personalize your experience
          </p>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  📋 Sample Scenarios
                </h3>
                <p className="text-sm text-gray-300 mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Get inspired with pre-written scenario examples to help you get started quickly.
                </p>
                
                <button
                  onClick={() => setShowSampleScenarios(!showSampleScenarios)}
                  className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-between transition-colors hover:bg-white/15"
                  data-name="toggle_sample_scenarios"
                >
                  <span className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Show sample scenarios on Radar screen
                  </span>
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    showSampleScenarios ? 'bg-cyan-500' : 'bg-white/20'
                  } relative`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      showSampleScenarios ? 'translate-x-6' : ''
                    }`} />
                  </div>
                </button>

                {showSampleScenarios && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-cyan-300" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Choose which categories to show:
                    </p>
                    {scenarioOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => toggleScenario(option.id)}
                        className={`w-full min-h-[48px] px-4 py-3 rounded-xl backdrop-blur-sm border transition-all ${
                          enabledScenarios.includes(option.id)
                            ? 'bg-cyan-500/20 border-cyan-500/50'
                            : 'bg-white/5 border-white/10'
                        }`}
                        data-name={`toggle_scenario_${option.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{option.icon}</span>
                          <span className={`flex-1 text-left text-sm ${
                            enabledScenarios.includes(option.id) ? 'text-white' : 'text-gray-400'
                          }`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                            {option.label}
                          </span>
                          {enabledScenarios.includes(option.id) && (
                            <Check className="w-4 h-4 text-cyan-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  🔤 Text Size Preference
                </h3>
                <p className="text-sm text-gray-300 mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Choose a comfortable reading size for the app interface.
                </p>
                
                <div className="space-y-2">
                  {(['small', 'medium', 'large'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => setTextSize(size)}
                      className={`w-full min-h-[48px] px-4 py-3 rounded-xl backdrop-blur-sm border transition-all ${
                        textSize === size
                          ? 'bg-cyan-500/20 border-cyan-500/50'
                          : 'bg-white/5 border-white/10'
                      }`}
                      data-name={`set_text_size_${size}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`${
                            textSize === size ? 'text-white' : 'text-gray-400'
                          }`} style={{ 
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            fontSize: size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px'
                          }}>
                            {size === 'small' && 'Small - Compact view'}
                            {size === 'medium' && 'Medium - Default (Recommended)'}
                            {size === 'large' && 'Large - Easier reading'}
                          </span>
                        </div>
                        {textSize === size && (
                          <Check className="w-5 h-5 text-cyan-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  📊 Analytics & Insights
                </h3>
                <p className="text-sm text-gray-300 mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Help us improve your experience with anonymous usage analytics.
                </p>
                
                <button
                  onClick={() => setEnableAnalytics(!enableAnalytics)}
                  className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-between transition-colors hover:bg-white/15"
                  data-name="toggle_analytics"
                >
                  <div className="flex-1 text-left">
                    <span className="text-white text-sm block" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Enable anonymous analytics
                    </span>
                    <span className="text-xs text-gray-400 mt-1 block" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Helps us improve the app (no personal data shared)
                    </span>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    enableAnalytics ? 'bg-cyan-500' : 'bg-white/20'
                  } relative ml-3 shrink-0`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      enableAnalytics ? 'translate-x-6' : ''
                    }`} />
                  </div>
                </button>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                <p className="text-xs text-cyan-300" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  💡 <strong>Pro Tip:</strong> You can always change these settings later in your Profile screen.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 min-h-[48px] px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors"
              data-name="btn_onboarding_back"
            >
              <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Back</span>
            </button>
          )}
          
          <button
            onClick={step === 3 ? handleComplete : () => setStep(step + 1)}
            className="flex-1 min-h-[48px] px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white transition-all active:scale-95"
            data-name={step === 3 ? "btn_onboarding_complete" : "btn_onboarding_next"}
          >
            <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {step === 3 ? "Let's Go! 🚀" : 'Next'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
