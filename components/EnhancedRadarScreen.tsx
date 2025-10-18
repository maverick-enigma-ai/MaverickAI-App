import { useState } from 'react';
import { ChatInterface } from './ChatInterface';
import { FlaskConical, Target, Zap, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface EnhancedRadarScreenProps {
  onSubmit: (text: string, files: File[]) => Promise<void>;
  enabledScenarios: import('../types/sample-scenarios').ScenarioCategory[];
  onBack: () => void;
}

type RadarMode = 'standard' | 'whatif' | 'targeted';

export function EnhancedRadarScreen({ onSubmit, enabledScenarios, onBack }: EnhancedRadarScreenProps) {
  const [activeMode, setActiveMode] = useState<RadarMode>('standard');
  const [whatIfContext, setWhatIfContext] = useState<string>('');

  const handleEnhancedSubmit = async (text: string, files: File[]) => {
    // In future: enhance submission based on mode
    // For now, pass through to standard submission
    
    let enhancedText = text;
    
    if (activeMode === 'whatif' && whatIfContext) {
      enhancedText = `${text}\n\n[What-If Context]: ${whatIfContext}`;
    } else if (activeMode === 'targeted') {
      enhancedText = `${text}\n\n[Targeted Analysis]: Focus on power dynamics and strategic positioning`;
    }
    
    await onSubmit(enhancedText, files);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-navy via-deep-blue to-navy">
      {/* Mode Selector Header */}
      <div className="sticky top-0 z-10 bg-glass backdrop-blur-sm md:backdrop-blur-md border-b border-border" style={ {top: "env(safe-area-inset-top)" }}>
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={onBack}
              className="p-2 rounded-xl bg-glass hover:bg-glass-strong border border-border transition-all btn-press"
              data-name="btn_back_from_enhanced_radar"
            >
              <ArrowLeft className="w-5 h-5 text-cyan" />
            </Button>
            <div className="flex-1">
              <h1 className="text-white">Enhanced Radar</h1>
              <p className="text-white/60 text-sm">Advanced analysis modes</p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveMode('standard')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all btn-press ${
                activeMode === 'standard'
                  ? 'bg-cyan text-navy'
                  : 'bg-glass border border-border text-white/60 hover:bg-glass-strong'
              }`}
              data-name="btn_mode_standard"
            >
              <Target className="w-4 h-4" />
              <span className="text-sm">Standard Analysis</span>
            </button>

            <button
              onClick={() => setActiveMode('whatif')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all btn-press ${
                activeMode === 'whatif'
                  ? 'bg-purple text-white'
                  : 'bg-glass border border-border text-white/60 hover:bg-glass-strong'
              }`}
              data-name="btn_mode_whatif"
            >
              <FlaskConical className="w-4 h-4" />
              <span className="text-sm">What-If Mode</span>
            </button>

            <button
              onClick={() => setActiveMode('targeted')}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all btn-press ${
                activeMode === 'targeted'
                  ? 'bg-teal text-white'
                  : 'bg-glass border border-border text-white/60 hover:bg-glass-strong'
              }`}
              data-name="btn_mode_targeted"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm">Targeted Scan</span>
            </button>
          </div>

          {/* Mode Description */}
          <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
            {activeMode === 'standard' && (
              <p className="text-white/80 text-sm">
                <Target className="w-4 h-4 inline mr-2 text-cyan" />
                Standard comprehensive analysis of your situation
              </p>
            )}
            {activeMode === 'whatif' && (
              <div>
                <p className="text-white/80 text-sm mb-2">
                  <FlaskConical className="w-4 h-4 inline mr-2 text-purple" />
                  Analyze a hypothetical scenario or alternative approach
                </p>
                <input
                  type="text"
                  placeholder="What-if scenario context (optional)"
                  value={whatIfContext}
                  onChange={(e) => setWhatIfContext(e.target.value)}
                  className="w-full px-3 py-3 rounded-lg bg-glass border border-border text-white placeholder-white/40 text-sm"
                />
              </div>
            )}
            {activeMode === 'targeted' && (
              <p className="text-white/80 text-sm">
                <Zap className="w-4 h-4 inline mr-2 text-teal" />
                Deep-dive analysis focused on specific power dynamics
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Interface (reused from standard radar) */}
      <div className="relative">
        <ChatInterface 
          onSubmit={handleEnhancedSubmit} 
          enabledScenarios={enabledScenarios}
        />

        {/* Mode Indicator Overlay */}
        {activeMode !== 'standard' && (
          <div className="fixed bottom-24 left-6 right-6 z-20">
            <div className={`rounded-2xl border p-3 backdrop-blur-sm md:backdrop-blur-md ${
              activeMode === 'whatif'
                ? 'bg-purple/10 border-border-purple'
                : 'bg-teal/10 border-teal/30'
            }`}>
              <div className="flex items-center gap-2">
                {activeMode === 'whatif' ? (
                  <FlaskConical className="w-4 h-4 text-purple" />
                ) : (
                  <Zap className="w-4 h-4 text-teal" />
                )}
                <span className={`text-sm ${
                  activeMode === 'whatif' ? 'text-purple' : 'text-teal'
                }`}>
                  {activeMode === 'whatif' ? 'What-If' : 'Targeted'} Mode Active
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Beta Badge (absolute positioned at bottom) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-purple/90 border border-border-purple backdrop-blur-sm md:backdrop-blur-md shadow-lg">
          <Zap className="w-4 h-4 text-white" />
          <span className="text-white text-sm">Enhanced Radar • Beta v1.1.0-beta.5</span>
        </div>
      </div>
    </div>
  );
}
