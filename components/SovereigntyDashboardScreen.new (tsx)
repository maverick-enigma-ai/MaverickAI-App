import { ArrowLeft, TrendingUp, TrendingDown, Activity, Target, Shield, Zap } from 'lucide-react';
import { useState } from 'react';

interface SovereigntyDashboardScreenProps {
  onBack: () => void;
}

// Mock data for weekly KPIs
const mockWeeklyKPIs = {
  currentWeek: {
    weekStart: 'Sep 29, 2025',
    weekEnd: 'Oct 5, 2025',
    powerScore: 72,
    powerChange: +8,
    gravityScore: 65,
    gravityChange: +12,
    riskScore: 28,
    riskChange: -15,
    analysesCount: 7,
    alertsResolved: 4,
    strategicMovesCompleted: 5
  },
  previousWeek: {
    powerScore: 64,
    gravityScore: 53,
    riskScore: 43
  },
  monthlyTrend: [
    { week: 'Week 1', power: 58, gravity: 45, risk: 52 },
    { week: 'Week 2', power: 61, gravity: 49, risk: 48 },
    { week: 'Week 3', power: 64, gravity: 53, risk: 43 },
    { week: 'Week 4', power: 72, gravity: 65, risk: 28 }
  ]
};

const mockInsights = [
  {
    id: '1',
    type: 'improvement',
    title: 'Power Dynamics Improving',
    message: 'Your average power score increased by 12% this week. You\'re gaining strategic advantage.',
    icon: TrendingUp,
    color: 'cyan'
  },
  {
    id: '2',
    type: 'milestone',
    title: 'Risk Reduction Milestone',
    message: 'You\'ve reduced your risk exposure by 35% over the past month. Excellent progress.',
    icon: Shield,
    color: 'teal'
  },
  {
    id: '3',
    type: 'action',
    title: 'Gravity Pattern Detected',
    message: 'Your gravity scores show consistent upward trend. Consider leveraging this momentum.',
    icon: Activity,
    color: 'purple'
  }
];

export function SovereigntyDashboardScreen({ onBack }: SovereigntyDashboardScreenProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-success" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-error" />;
    return <Activity className="w-4 h-4 text-white/40" />;
  };

  const getTrendColor = (change: number, isRisk: boolean = false) => {
    // For risk, negative is good
    if (isRisk) {
      if (change < 0) return 'text-success';
      if (change > 0) return 'text-error';
    } else {
      if (change > 0) return 'text-success';
      if (change < 0) return 'text-error';
    }
    return 'text-white/40';
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-navy via-deep-blue to-navy pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-glass backdrop-blur-sm md:backdrop-blur-md border-b border-border" style={ top: "env(safe-area-inset-top)" }>
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-glass hover:bg-glass-strong border border-border transition-all btn-press"
            data-name="btn_back_from_sovereignty_dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-cyan" />
          </button>
          <div className="flex-1">
            <h1 className="text-white">Sovereignty Dashboard</h1>
            <p className="text-white/60 text-sm">Track your strategic intelligence over time</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-3 rounded-xl text-sm transition-all btn-press ${
                selectedPeriod === 'week'
                  ? 'bg-cyan text-navy'
                  : 'bg-glass border border-border text-white/60'
              }`}
              data-name="btn_period_week"
            >
              Week
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-3 rounded-xl text-sm transition-all btn-press ${
                selectedPeriod === 'month'
                  ? 'bg-cyan text-navy'
                  : 'bg-glass border border-border text-white/60'
              }`}
              data-name="btn_period_month"
            >
              Month
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Period Header */}
        <div className="text-center">
          <p className="text-white/60 text-sm">Current Period</p>
          <p className="text-white text-lg">
            {mockWeeklyKPIs.currentWeek.weekStart} - {mockWeeklyKPIs.currentWeek.weekEnd}
          </p>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Power Score */}
          <div className="rounded-2xl bg-glass border border-border-cyan p-4 backdrop-blur-sm md:backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-cyan" />
              {getTrendIcon(mockWeeklyKPIs.currentWeek.powerChange)}
            </div>
            <p className="text-white/60 text-xs mb-1">Power Score</p>
            <p className="text-white text-2xl mb-1">{mockWeeklyKPIs.currentWeek.powerScore}</p>
            <p className={`text-xs ${getTrendColor(mockWeeklyKPIs.currentWeek.powerChange)}`}>
              {mockWeeklyKPIs.currentWeek.powerChange > 0 ? '+' : ''}
              {mockWeeklyKPIs.currentWeek.powerChange} from last week
            </p>
          </div>

          {/* Gravity Score */}
          <div className="rounded-2xl bg-glass border border-border-purple p-4 backdrop-blur-sm md:backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-purple" />
              {getTrendIcon(mockWeeklyKPIs.currentWeek.gravityChange)}
            </div>
            <p className="text-white/60 text-xs mb-1">Gravity Score</p>
            <p className="text-white text-2xl mb-1">{mockWeeklyKPIs.currentWeek.gravityScore}</p>
            <p className={`text-xs ${getTrendColor(mockWeeklyKPIs.currentWeek.gravityChange)}`}>
              {mockWeeklyKPIs.currentWeek.gravityChange > 0 ? '+' : ''}
              {mockWeeklyKPIs.currentWeek.gravityChange} from last week
            </p>
          </div>

          {/* Risk Score */}
          <div className="rounded-2xl bg-glass border border-border p-4 backdrop-blur-sm md:backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-teal" />
              {getTrendIcon(mockWeeklyKPIs.currentWeek.riskChange)}
            </div>
            <p className="text-white/60 text-xs mb-1">Risk Score</p>
            <p className="text-white text-2xl mb-1">{mockWeeklyKPIs.currentWeek.riskScore}</p>
            <p className={`text-xs ${getTrendColor(mockWeeklyKPIs.currentWeek.riskChange, true)}`}>
              {mockWeeklyKPIs.currentWeek.riskChange > 0 ? '+' : ''}
              {mockWeeklyKPIs.currentWeek.riskChange} from last week
            </p>
          </div>
        </div>

        {/* Activity Metrics */}
        <div className="rounded-2xl bg-glass border border-border p-4 backdrop-blur-sm md:backdrop-blur-md">
          <h2 className="text-white mb-4">Weekly Activity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-cyan text-lg md:text-2xl xl:text-3xl mb-1">{mockWeeklyKPIs.currentWeek.analysesCount}</p>
              <p className="text-white/60 text-xs">Analyses Run</p>
            </div>
            <div className="text-center">
              <p className="text-purple text-lg md:text-2xl xl:text-3xl mb-1">{mockWeeklyKPIs.currentWeek.alertsResolved}</p>
              <p className="text-white/60 text-xs">Alerts Resolved</p>
            </div>
            <div className="text-center">
              <p className="text-teal text-lg md:text-2xl xl:text-3xl mb-1">{mockWeeklyKPIs.currentWeek.strategicMovesCompleted}</p>
              <p className="text-white/60 text-xs">Moves Executed</p>
            </div>
          </div>
        </div>

        {/* Trend Chart (Simple Bar Chart) */}
        <div className="rounded-2xl bg-glass border border-border p-4 backdrop-blur-sm md:backdrop-blur-md">
          <h2 className="text-white mb-4">Monthly Trend</h2>
          <div className="space-y-3">
            {mockWeeklyKPIs.monthlyTrend.map((week, index) => (
              <div key={index}>
                <p className="text-white/60 text-xs mb-2">{week.week}</p>
                <div className="flex gap-2">
                  {/* Power Bar */}
                  <div className="flex-1">
                    <div className="h-8 rounded-lg bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan to-cyan/60 flex items-center justify-end px-2"
                        style={{ width: `${week.power}%` }}
                      >
                        <span className="text-white text-xs">{week.power}</span>
                      </div>
                    </div>
                  </div>
                  {/* Gravity Bar */}
                  <div className="flex-1">
                    <div className="h-8 rounded-lg bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple to-purple/60 flex items-center justify-end px-2"
                        style={{ width: `${week.gravity}%` }}
                      >
                        <span className="text-white text-xs">{week.gravity}</span>
                      </div>
                    </div>
                  </div>
                  {/* Risk Bar */}
                  <div className="flex-1">
                    <div className="h-8 rounded-lg bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal to-teal/60 flex items-center justify-end px-2"
                        style={{ width: `${week.risk}%` }}
                      >
                        <span className="text-white text-xs">{week.risk}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan" />
              <span className="text-white/60 text-xs">Power</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple" />
              <span className="text-white/60 text-xs">Gravity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal" />
              <span className="text-white/60 text-xs">Risk</span>
            </div>
          </div>
        </div>

        {/* Strategic Insights */}
        <div>
          <h2 className="text-white mb-4">Strategic Insights</h2>
          <div className="space-y-3">
            {mockInsights.map((insight) => {
              const Icon = insight.icon;
              const colorClasses = {
                cyan: 'border-border-cyan bg-cyan/10',
                teal: 'border-border bg-teal/10',
                purple: 'border-border-purple bg-purple/10'
              }[insight.color];

              return (
                <div
                  key={insight.id}
                  className={`rounded-2xl border p-4 backdrop-blur-sm md:backdrop-blur-md ${colorClasses}`}
                >
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-xl bg-glass border border-border shrink-0`}>
                      <Icon className={`w-5 h-5 text-${insight.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-sm mb-1">{insight.title}</h3>
                      <p className="text-white/60 text-sm">{insight.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Beta Badge */}
        <div className="text-center pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-purple/20 border border-border-purple">
            <Zap className="w-4 h-4 text-purple" />
            <span className="text-purple text-sm">Sovereignty Dashboard • Beta v1.1.0-beta.2</span>
          </div>
          <p className="text-white/40 text-xs mt-2">
            Using mock data • Real analytics coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
