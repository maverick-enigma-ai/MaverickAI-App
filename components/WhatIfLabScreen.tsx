import { ArrowLeft, FlaskConical, Plus, TrendingUp, AlertCircle, Lightbulb, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface WhatIfLabScreenProps {
  onBack: () => void;
}

interface Scenario {
  id: string;
  name: string;
  baseAnalysisId: string;
  baseAnalysisTitle: string;
  change: string;
  prediction: {
    powerScore: number;
    gravityScore: number;
    riskScore: number;
    powerChange: number;
    gravityChange: number;
    riskChange: number;
    likelihood: 'high' | 'medium' | 'low';
    outcome: string;
  };
  createdAt: string;
}

// Mock scenarios
const mockScenarios: Scenario[] = [
  {
    id: '1',
    name: 'Direct Confrontation',
    baseAnalysisId: 'analysis-1',
    baseAnalysisTitle: 'Colleague Undermining in Meetings',
    change: 'What if I directly confront them in the next meeting?',
    prediction: {
      powerScore: 68,
      gravityScore: 82,
      riskScore: 71,
      powerChange: +5,
      gravityChange: +15,
      riskChange: +28,
      likelihood: 'high',
      outcome: 'Direct confrontation would increase your perceived power but significantly raise risk. The gravity of the situation intensifies as stakes become public.'
    },
    createdAt: '2025-10-04'
  },
  {
    id: '2',
    name: 'Private Discussion',
    baseAnalysisId: 'analysis-1',
    baseAnalysisTitle: 'Colleague Undermining in Meetings',
    change: 'What if I schedule a private 1-on-1 conversation?',
    prediction: {
      powerScore: 71,
      gravityScore: 58,
      riskScore: 35,
      powerChange: +8,
      gravityChange: -9,
      riskChange: -8,
      likelihood: 'high',
      outcome: 'Private discussion maintains dignity while addressing issue. Lower risk of escalation, moderate gravity, strong power position through measured response.'
    },
    createdAt: '2025-10-04'
  },
  {
    id: '3',
    name: 'Manager Intervention',
    baseAnalysisId: 'analysis-1',
    baseAnalysisTitle: 'Colleague Undermining in Meetings',
    change: 'What if I involve my manager as a mediator?',
    prediction: {
      powerScore: 55,
      gravityScore: 73,
      riskScore: 52,
      powerChange: -8,
      gravityChange: +6,
      riskChange: +9,
      likelihood: 'medium',
      outcome: 'Involving management may resolve issue but could appear weak. Moderate risk of relationship damage, high gravity as it becomes formal matter.'
    },
    createdAt: '2025-10-03'
  }
];

export function WhatIfLabScreen({ onBack }: WhatIfLabScreenProps) {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(mockScenarios[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case 'high': return 'text-success border-success/30 bg-success/10';
      case 'medium': return 'text-warning border-warning/30 bg-warning/10';
      case 'low': return 'text-error border-error/30 bg-error/10';
      default: return 'text-white/60 border-border bg-glass';
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-white/40';
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-navy via-deep-blue to-navy pb-8">
      {/* Header */}
      <div
        className="sticky top-0 z-10 bg-glass backdrop-blur-sm md:backdrop-blur-md border-b border-border"
        style={{ top: 'env(safe-area-inset-top)' }}  // ✅ fixed: style must be an object
      >
        <div className="flex items-center gap-4 px-6 py-4">
          <Button
            onClick={onBack}
            className="p-2 rounded-xl bg-glass hover:bg-glass-strong border border-border transition-all btn-press"
            data-name="btn_back_from_whatif_lab"
          >
            <ArrowLeft className="w-5 h-5 text-cyan" />
          </Button>
          <div className="flex-1">
            <h1 className="text-white">What-If Lab</h1>
            <p className="text-white/60 text-sm">Simulate scenarios & predict outcomes</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-cyan text-navy hover:bg-cyan/90 transition-all btn-press"
            data-name="btn_create_scenario"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">New Scenario</span>
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Scenario Selector */}
        <div>
          <h2 className="text-white mb-3">Your Scenarios</h2>
          <div className="space-y-2">
            {mockScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setActiveScenario(scenario)}
                className={`w-full text-left p-4 rounded-2xl border backdrop-blur-sm md:backdrop-blur-md transition-all btn-press ${
                  activeScenario?.id === scenario.id
                    ? 'bg-glass-strong border-border-cyan'
                    : 'bg-glass border-border hover:bg-glass-strong'
                }`}
                data-name={`btn_scenario_${scenario.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FlaskConical className="w-4 h-4 text-purple shrink-0" />
                      <h3 className="text-white text-sm truncate">{scenario.name}</h3>
                    </div>
                    <p className="text-white/60 text-xs line-clamp-1">{scenario.change}</p>
                  </div>
                  <div className={`px-2 py-2 rounded-lg text-xs border ${getLikelihoodColor(scenario.prediction.likelihood)}`}>
                    {scenario.prediction.likelihood}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Scenario Details */}
        {activeScenario && (
          <div className="space-y-4">
            {/* Scenario Header */}
            <div className="rounded-2xl bg-glass border border-border-purple p-4 backdrop-blur-sm md:backdrop-blur-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-purple/20 border border-border-purple">
                  <FlaskConical className="w-5 h-5 text-purple" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white">{activeScenario.name}</h2>
                  <p className="text-white/60 text-sm">Based on: {activeScenario.baseAnalysisTitle}</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/60 text-xs mb-1">Scenario Change</p>
                <p className="text-white text-sm">{activeScenario.change}</p>
              </div>
            </div>

            {/* Predicted Scores */}
            <div>
              <h3 className="text-white mb-3">Predicted Impact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* Power */}
                <div className="rounded-2xl bg-glass border border-border-cyan p-4 backdrop-blur-sm md:backdrop-blur-md">
                  <p className="text-white/60 text-xs mb-1">Power</p>
                  <p className="text-white text-2xl mb-1">{activeScenario.prediction.powerScore}</p>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs ${getChangeColor(activeScenario.prediction.powerChange)}`}>
                      {activeScenario.prediction.powerChange > 0 ? '+' : ''}
                      {activeScenario.prediction.powerChange}
                    </span>
                  </div>
                </div>

                {/* Gravity */}
                <div className="rounded-2xl bg-glass border border-border-purple p-4 backdrop-blur-sm md:backdrop-blur-md">
                  <p className="text-white/60 text-xs mb-1">Gravity</p>
                  <p className="text-white text-2xl mb-1">{activeScenario.prediction.gravityScore}</p>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs ${getChangeColor(activeScenario.prediction.gravityChange)}`}>
                      {activeScenario.prediction.gravityChange > 0 ? '+' : ''}
                      {activeScenario.prediction.gravityChange}
                    </span>
                  </div>
                </div>

                {/* Risk */}
                <div className="rounded-2xl bg-glass border border-border p-4 backdrop-blur-sm md:backdrop-blur-md">
                  <p className="text-white/60 text-xs mb-1">Risk</p>
                  <p className="text-white text-2xl mb-1">{activeScenario.prediction.riskScore}</p>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs ${getChangeColor(activeScenario.prediction.riskChange)}`}>
                      {activeScenario.prediction.riskChange > 0 ? '+' : ''}
                      {activeScenario.prediction.riskChange}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Likelihood Badge */}
            <div className="rounded-2xl bg-glass border border-border p-4 backdrop-blur-sm md:backdrop-blur-md">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-cyan" />
                <div className="flex-1">
                  <p className="text-white/60 text-xs mb-1">Outcome Likelihood</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white capitalize">{activeScenario.prediction.likelihood}</span>
                    <div className={`px-2 py-2 rounded-lg text-xs border ${getLikelihoodColor(activeScenario.prediction.likelihood)}`}>
                      {activeScenario.prediction.likelihood === 'high' ? '85-95%' : 
                       activeScenario.prediction.likelihood === 'medium' ? '60-80%' : '30-55%'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Predicted Outcome */}
            <div className="rounded-2xl bg-glass border border-border p-4 backdrop-blur-sm md:backdrop-blur-md">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan/20 border border-border-cyan shrink-0">
                  <Lightbulb className="w-5 h-5 text-cyan" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm mb-2">Predicted Outcome</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {activeScenario.prediction.outcome}
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison View */}
            <div className="rounded-2xl bg-glass border border-border p-4 backdrop-blur-sm md:backdrop-blur-md">
              <h3 className="text-white text-sm mb-3">Score Comparison</h3>
              <div className="space-y-3">
                {[
                  { label: 'Power', current: 63, predicted: activeScenario.prediction.powerScore, color: 'cyan' },
                  { label: 'Gravity', current: 67, predicted: activeScenario.prediction.gravityScore, color: 'purple' },
                  { label: 'Risk', current: 43, predicted: activeScenario.prediction.riskScore, color: 'teal' }
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/60 text-xs">{metric.label}</span>
                      <span className="text-white text-xs">
                        {metric.current} → {metric.predicted}
                      </span>
                    </div>
                    <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
                      {/* Current score */}
                      <div
                        className={`absolute h-full bg-white/20`}
                        style={{ width: `${metric.current}%` }}
                      />
                      {/* Predicted score */}
                      <div
                        className={`absolute h-full bg-${metric.color}`}
                        style={{ width: `${metric.predicted}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <span className="text-white/60 text-xs">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan" />
                  <span className="text-white/60 text-xs">Predicted</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {mockScenarios.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex p-4 rounded-2xl bg-glass border border-border mb-4">
              <FlaskConical className="w-8 h-8 text-purple" />
            </div>
            <h3 className="text-white mb-2">No Scenarios Yet</h3>
            <p className="text-white/60 text-sm mb-4">
              Create your first "What-If" scenario to explore potential outcomes
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-xl bg-cyan text-navy hover:bg-cyan/90 transition-all btn-press"
              data-name="btn_create_first_scenario"
            >
              Create Scenario
            </button>
          </div>
        )}

        {/* Beta Badge */}
        <div className="text-center pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-purple/20 border border-border-purple">
            <Zap className="w-4 h-4 text-purple" />
            <span className="text-purple text-sm">What-If Lab • Beta v1.1.0-beta.3</span>
          </div>
          <p className="text-white/40 text-xs mt-2">
            Using mock predictions • AI-powered simulation coming soon
          </p>
        </div>
      </div>

      {/* Create Modal (Placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-deep-blue border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-purple/20 border border-border-purple">
                <FlaskConical className="w-5 h-5 text-purple" />
              </div>
              <h2 className="text-white">Create Scenario</h2>
            </div>
            <div className="p-4 rounded-xl bg-cyan/10 border border-border-cyan mb-4">
              <p className="text-white/80 text-sm">
                <AlertCircle className="w-4 h-4 inline mr-2 text-cyan" />
                Scenario creation UI coming in next update
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full px-6 py-3 rounded-xl bg-glass border border-border text-white hover:bg-glass-strong transition-all btn-press"
              data-name="btn_close_create_modal"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
