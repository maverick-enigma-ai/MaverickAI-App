import { ArrowLeft, Target, CheckCircle, Trophy, Flame, Brain, Zap, Clock } from 'lucide-react';
import { useState } from 'react';

interface ReflexTrainerScreenProps {
  onBack: () => void;
}

interface Drill {
  id: string;
  title: string;
  category: 'power' | 'gravity' | 'risk' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  scenario: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  completed: boolean;
  score?: number;
}

// Mock daily drills
const mockDrills: Drill[] = [
  {
    id: 'drill-1',
    title: 'Identify Power Dynamic',
    category: 'power',
    difficulty: 'beginner',
    scenario: 'During a team meeting, your colleague interrupts you mid-presentation to offer their own "clarification" of your point. What is the primary power dynamic at play?',
    options: [
      {
        id: 'opt-1',
        text: 'Status challenge - testing boundaries',
        isCorrect: true,
        explanation: 'Correct! This is a classic status challenge. They\'re testing your positional authority and asserting their own influence by publicly reframing your message.'
      },
      {
        id: 'opt-2',
        text: 'Helpful collaboration',
        isCorrect: false,
        explanation: 'Unlikely. Genuine collaboration typically involves private discussion or waiting for appropriate moments, not public interruption.'
      },
      {
        id: 'opt-3',
        text: 'Communication breakdown',
        isCorrect: false,
        explanation: 'While communication issues may exist, the timing and public nature suggests intentional positioning rather than misunderstanding.'
      }
    ],
    completed: true,
    score: 100
  },
  {
    id: 'drill-2',
    title: 'Assess Gravity Level',
    category: 'gravity',
    difficulty: 'intermediate',
    scenario: 'You notice your manager has been excluding you from important email threads over the past two weeks. How severe is this gravity indicator?',
    options: [
      {
        id: 'opt-1',
        text: 'Low - probably an oversight',
        isCorrect: false,
        explanation: 'Two weeks suggests a pattern, not an oversight. Dismissing this could miss an escalating issue.'
      },
      {
        id: 'opt-2',
        text: 'Medium - worth monitoring',
        isCorrect: true,
        explanation: 'Correct! This is a medium gravity indicator. Two weeks shows a pattern that requires attention, but not yet crisis-level. Monitor and address proactively.'
      },
      {
        id: 'opt-3',
        text: 'High - immediate crisis',
        isCorrect: false,
        explanation: 'While concerning, this hasn\'t yet reached crisis level. You still have opportunity for measured intervention.'
      }
    ],
    completed: true,
    score: 100
  },
  {
    id: 'drill-3',
    title: 'Calculate Risk Exposure',
    category: 'risk',
    difficulty: 'advanced',
    scenario: 'A client is upset about a project delay caused by another team. They\'re threatening to escalate to your CEO. What\'s your primary risk?',
    options: [
      {
        id: 'opt-1',
        text: 'Reputational - being associated with failure',
        isCorrect: true,
        explanation: 'Correct! Even though you didn\'t cause the delay, proximity creates reputational risk. CEO escalation amplifies visibility and potential blame association.'
      },
      {
        id: 'opt-2',
        text: 'Financial - losing the client',
        isCorrect: false,
        explanation: 'While possible, the immediate risk is reputational. Financial consequences would be secondary to how this situation reflects on you.'
      },
      {
        id: 'opt-3',
        text: 'Legal - contract breach',
        isCorrect: false,
        explanation: 'Legal risk exists but is not the primary concern here. The reputational damage from CEO-level escalation is more immediate.'
      }
    ],
    completed: false
  },
  {
    id: 'drill-4',
    title: 'Strategic Response Pattern',
    category: 'general',
    difficulty: 'intermediate',
    scenario: 'You discover a colleague is taking credit for your work in leadership meetings. What\'s the most strategically sound first move?',
    options: [
      {
        id: 'opt-1',
        text: 'Confront them publicly in the next meeting',
        isCorrect: false,
        explanation: 'Public confrontation typically escalates tension without resolving the underlying issue. It may make you appear reactive.'
      },
      {
        id: 'opt-2',
        text: 'Document your contributions and have a private discussion',
        isCorrect: true,
        explanation: 'Correct! Documentation protects you while private discussion allows for measured resolution. This maintains professionalism while addressing the issue.'
      },
      {
        id: 'opt-3',
        text: 'Immediately escalate to HR',
        isCorrect: false,
        explanation: 'Escalating without attempting direct resolution may seem premature. Try measured private discussion first, then escalate if needed.'
      }
    ],
    completed: false
  }
];

const mockProgress = {
  dailyStreak: 7,
  totalDrillsCompleted: 42,
  accuracyRate: 87,
  skillLevel: 'Intermediate',
  categories: {
    power: { completed: 15, accuracy: 92 },
    gravity: { completed: 12, accuracy: 85 },
    risk: { completed: 10, accuracy: 81 },
    general: { completed: 5, accuracy: 90 }
  }
};

export function ReflexTrainerScreen({ onBack }: ReflexTrainerScreenProps) {
  const [activeDrill, setActiveDrill] = useState<Drill | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowFeedback(true);
  };

  const handleNextDrill = () => {
    const currentIndex = mockDrills.findIndex(d => d.id === activeDrill?.id);
    const nextDrill = mockDrills[currentIndex + 1];
    if (nextDrill) {
      setActiveDrill(nextDrill);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setActiveDrill(null);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'power': return 'cyan';
      case 'gravity': return 'purple';
      case 'risk': return 'teal';
      default: return 'gold';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'power': return Target;
      case 'gravity': return Flame;
      case 'risk': return Brain;
      default: return Zap;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-success';
      case 'intermediate': return 'text-warning';
      case 'advanced': return 'text-error';
      default: return 'text-white/60';
    }
  };

  // Drill List View
  if (!activeDrill) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-navy via-deep-blue to-navy pb-8">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-glass backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-4 px-6 py-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-glass hover:bg-glass-strong border border-border transition-all btn-press"
              data-name="btn_back_from_reflex_trainer"
            >
              <ArrowLeft className="w-5 h-5 text-cyan" />
            </button>
            <div className="flex-1">
              <h1 className="text-white">Reflex Trainer</h1>
              <p className="text-white/60 text-sm">Sharpen your strategic instincts</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Progress Stats */}
          <div className="rounded-2xl bg-glass border border-border p-4 backdrop-blur-md">
            <h2 className="text-white mb-4">Your Progress</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-gold" />
                  <span className="text-gold text-2xl">{mockProgress.dailyStreak}</span>
                </div>
                <p className="text-white/60 text-xs">Day Streak</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-cyan" />
                  <span className="text-cyan text-2xl">{mockProgress.totalDrillsCompleted}</span>
                </div>
                <p className="text-white/60 text-xs">Drills Completed</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Target className="w-5 h-5 text-purple" />
                  <span className="text-purple text-2xl">{mockProgress.accuracyRate}%</span>
                </div>
                <p className="text-white/60 text-xs">Accuracy</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Brain className="w-5 h-5 text-teal" />
                  <span className="text-teal text-sm">{mockProgress.skillLevel}</span>
                </div>
                <p className="text-white/60 text-xs">Skill Level</p>
              </div>
            </div>
          </div>

          {/* Daily Drills */}
          <div>
            <h2 className="text-white mb-3">Today's Drills</h2>
            <div className="space-y-3">
              {mockDrills.map((drill) => {
                const Icon = getCategoryIcon(drill.category);
                const color = getCategoryColor(drill.category);
                
                return (
                  <button
                    key={drill.id}
                    onClick={() => setActiveDrill(drill)}
                    className="w-full text-left p-4 rounded-2xl bg-glass border border-border hover:bg-glass-strong transition-all btn-press"
                    data-name={`btn_drill_${drill.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl bg-${color}/20 border border-border-${color} shrink-0`}>
                        <Icon className={`w-5 h-5 text-${color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white text-sm">{drill.title}</h3>
                          {drill.completed && (
                            <CheckCircle className="w-4 h-4 text-success" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs capitalize ${getDifficultyColor(drill.difficulty)}`}>
                            {drill.difficulty}
                          </span>
                          <span className="text-white/40 text-xs">•</span>
                          <span className={`text-xs text-${color} capitalize`}>
                            {drill.category}
                          </span>
                          {drill.completed && drill.score && (
                            <>
                              <span className="text-white/40 text-xs">•</span>
                              <span className="text-xs text-success">
                                Score: {drill.score}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Performance */}
          <div className="rounded-2xl bg-glass border border-border p-4 backdrop-blur-md">
            <h2 className="text-white mb-4">Category Performance</h2>
            <div className="space-y-3">
              {Object.entries(mockProgress.categories).map(([category, stats]) => {
                const color = getCategoryColor(category);
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-${color} text-sm capitalize`}>{category}</span>
                      <span className="text-white/60 text-xs">
                        {stats.completed} drills • {stats.accuracy}% accuracy
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full bg-${color}`}
                        style={{ width: `${stats.accuracy}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Beta Badge */}
          <div className="text-center pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple/20 border border-border-purple">
              <Zap className="w-4 h-4 text-purple" />
              <span className="text-purple text-sm">Reflex Trainer • Beta v1.1.0-beta.4</span>
            </div>
            <p className="text-white/40 text-xs mt-2">
              Using sample drills • Adaptive AI training coming soon
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active Drill View
  const selectedOptionData = activeDrill.options.find(opt => opt.id === selectedOption);

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-deep-blue to-navy pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-glass backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => {
              setActiveDrill(null);
              setSelectedOption(null);
              setShowFeedback(false);
            }}
            className="p-2 rounded-xl bg-glass hover:bg-glass-strong border border-border transition-all btn-press"
            data-name="btn_back_to_drills"
          >
            <ArrowLeft className="w-5 h-5 text-cyan" />
          </button>
          <div className="flex-1">
            <h1 className="text-white">{activeDrill.title}</h1>
            <div className="flex items-center gap-2">
              <span className={`text-xs capitalize ${getDifficultyColor(activeDrill.difficulty)}`}>
                {activeDrill.difficulty}
              </span>
              <span className="text-white/40 text-xs">•</span>
              <span className={`text-xs text-${getCategoryColor(activeDrill.category)} capitalize`}>
                {activeDrill.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Scenario */}
        <div className="rounded-2xl bg-glass border border-border p-4 backdrop-blur-md">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 rounded-xl bg-cyan/20 border border-border-cyan shrink-0">
              <Brain className="w-5 h-5 text-cyan" />
            </div>
            <div className="flex-1">
              <h2 className="text-white text-sm mb-1">Scenario</h2>
              <p className="text-white/80 leading-relaxed">{activeDrill.scenario}</p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div>
          <h2 className="text-white mb-3">Choose Your Response</h2>
          <div className="space-y-3">
            {activeDrill.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const showCorrect = showFeedback && option.isCorrect;
              const showIncorrect = showFeedback && isSelected && !option.isCorrect;

              return (
                <button
                  key={option.id}
                  onClick={() => !showFeedback && handleOptionSelect(option.id)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-2xl border backdrop-blur-md transition-all ${
                    showCorrect
                      ? 'bg-success/10 border-success'
                      : showIncorrect
                      ? 'bg-error/10 border-error'
                      : isSelected
                      ? 'bg-glass-strong border-border-cyan'
                      : 'bg-glass border-border hover:bg-glass-strong'
                  } ${!showFeedback ? 'btn-press' : ''}`}
                  data-name={`btn_option_${option.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                      showCorrect
                        ? 'border-success bg-success'
                        : showIncorrect
                        ? 'border-error bg-error'
                        : isSelected
                        ? 'border-cyan bg-cyan'
                        : 'border-white/20'
                    }`}>
                      {(showCorrect || (showFeedback && isSelected)) && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <p className="text-white flex-1">{option.text}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && selectedOptionData && (
          <div className={`rounded-2xl border p-4 backdrop-blur-md ${
            selectedOptionData.isCorrect
              ? 'bg-success/10 border-success'
              : 'bg-error/10 border-error'
          }`}>
            <div className="flex items-start gap-3 mb-3">
              <div className={`p-2 rounded-xl ${
                selectedOptionData.isCorrect
                  ? 'bg-success/20 border border-success/30'
                  : 'bg-error/20 border border-error/30'
              }`}>
                {selectedOptionData.isCorrect ? (
                  <Trophy className="w-5 h-5 text-success" />
                ) : (
                  <Target className="w-5 h-5 text-error" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-sm mb-2 ${
                  selectedOptionData.isCorrect ? 'text-success' : 'text-error'
                }`}>
                  {selectedOptionData.isCorrect ? 'Correct!' : 'Not Quite'}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {selectedOptionData.explanation}
                </p>
              </div>
            </div>
            <button
              onClick={handleNextDrill}
              className="w-full mt-3 px-6 py-3 rounded-xl bg-cyan text-navy hover:bg-cyan/90 transition-all btn-press"
              data-name="btn_next_drill"
            >
              Next Drill
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
