import { useState, useMemo } from 'react';
import { X, RefreshCw, ChevronRight } from 'lucide-react';
import { getRandomScenario, categoryInfo, type ScenarioCategory } from '../types/sample-scenarios';
import { Button } from './ui/button';

interface SampleScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (text: string, shouldEdit: boolean) => void;
  enabledScenarios: ScenarioCategory[];
}

export function SampleScenariosModal({
  isOpen,
  onClose,
  onSelectScenario,
  enabledScenarios
}: SampleScenariosModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ScenarioCategory | null>(null);
  const [scenarioRefreshKey, setScenarioRefreshKey] = useState(0);
  
  // Memoize scenarios
  const scenarios = useMemo(() => {
    if (!enabledScenarios || enabledScenarios.length === 0) return [];
    return enabledScenarios.map(category => ({
      category,
      scenario: getRandomScenario(category)
    }));
  }, [scenarioRefreshKey, enabledScenarios?.join(',') || '']);

  const handleRefreshScenarios = () => {
    setScenarioRefreshKey(prev => prev + 1);
    setSelectedCategory(null);
  };

  const handleCategoryClick = (category: ScenarioCategory) => {
    setSelectedCategory(category);
  };

  const handleUseAsIs = () => {
    if (!selectedCategory) return;
    const scenario = getRandomScenario(selectedCategory);
    onSelectScenario(scenario.text, false);
    onClose();
  };

  const handleAmendIt = () => {
    if (!selectedCategory) return;
    const scenario = getRandomScenario(selectedCategory);
    onSelectScenario(scenario.text, true);
    onClose();
  };

  const handleWriteOwn = () => {
    onSelectScenario('', true);
    onClose();
  };

  if (!isOpen) return null;

  const selectedScenario = selectedCategory 
    ? scenarios.find(s => s.category === selectedCategory)?.scenario
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] rounded-3xl border border-white/20 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h3 className="text-white mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {selectedCategory ? '✨ Choose Action' : '📋 Sample Scenarios'}
            </h3>
            <p className="text-cyan-300/70 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {selectedCategory 
                ? 'How would you like to proceed?' 
                : 'Select a scenario or write your own query'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {!selectedCategory && (
              <button
                onClick={handleRefreshScenarios}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 active:scale-95"
                data-name="btn_refresh_modal_scenarios"
                title="Get new examples"
              >
                <RefreshCw className="w-4 h-4 text-cyan-400" />
              </button>
            )}
            
            <Button
              onClick={() => {
                setSelectedCategory(null);
                onClose();
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 active:scale-95"
              data-name="btn_close_scenarios_modal"
            >
              <X className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedCategory ? (
            /* Category Selection View */
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {scenarios.map(({ category, scenario }) => {
                  const info = categoryInfo[category];
                  
                  return (
                    <button
                      key={`${category}-${scenarioRefreshKey}`}
                      onClick={() => handleCategoryClick(category)}
                      className={`group relative bg-gradient-to-br ${info.gradient} p-[1px] rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 min-h-[100px]`}
                      data-name={`btn_modal_scenario_${category}`}
                    >
                      <div className="h-full bg-[#14123F]/90 backdrop-blur-sm rounded-xl p-4 flex flex-col items-start gap-2">
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-xl leading-none">{info.icon}</span>
                          <span className="text-white text-sm flex-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                            {info.label}
                          </span>
                          <ChevronRight className="w-4 h-4 text-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-cyan-200/80 text-left line-clamp-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                          {scenario.title}
                        </p>
                      </div>
                      
                      {/* Hover glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`} />
                    </button>
                  );
                })}
              </div>
              
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-[#342FA5] text-cyan-300/70 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    or
                  </span>
                </div>
              </div>
              
              {/* Write Your Own Button */}
              <button
                onClick={handleWriteOwn}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-white/20 transition-all duration-200 active:scale-[0.98]"
                data-name="btn_write_own_query"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-white mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      ✍️ Write Your Own Query
                    </p>
                    <p className="text-cyan-300/70 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Start with a blank input screen
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-cyan-400" />
                </div>
              </button>
            </>
          ) : (
            /* Action Selection View */
            <>
              {/* Show Selected Scenario */}
              {selectedScenario && (
                <div className="mb-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base">{categoryInfo[selectedCategory].icon}</span>
                    <span className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      {categoryInfo[selectedCategory].label}
                    </span>
                  </div>
                  <p className="text-white/90 text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    {selectedScenario.title}
                  </p>
                  <p className="text-cyan-200/80 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {selectedScenario.text}
                  </p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleUseAsIs}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 border border-cyan-400/30 transition-all duration-200 active:scale-[0.98]"
                  data-name="btn_use_sample_as_is"
                >
                  <div className="text-left">
                    <p className="text-white mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      ✅ Use This Sample
                    </p>
                    <p className="text-white/80 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Start analysis with this exact text
                    </p>
                  </div>
                </button>
                
                <button
                  onClick={handleAmendIt}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 transition-all duration-200 active:scale-[0.98]"
                  data-name="btn_amend_sample"
                >
                  <div className="text-left">
                    <p className="text-white mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      ✏️ Edit This Sample
                    </p>
                    <p className="text-purple-200/80 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Pre-fill input so you can modify it
                    </p>
                  </div>
                </button>
                
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-full py-4 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 active:scale-[0.98]"
                  data-name="btn_back_to_scenarios"
                >
                  <div className="text-center">
                    <p className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      ← Back to Scenarios
                    </p>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <p className="text-center text-xs text-cyan-300/50" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {selectedCategory 
              ? 'Choose how you want to use this sample scenario'
              : 'Sample scenarios help you get started quickly'}
          </p>
        </div>
      </div>
    </div>
  );
}
