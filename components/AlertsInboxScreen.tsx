import { useState } from 'react';
import { ChevronRight, Bell, CheckCircle2, Clock, AlertTriangle, Info } from 'lucide-react';
import { BrandHeader } from './BrandHeader';

// Mock alert type (will match Supabase schema later)
interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  status: 'open' | 'resolved';
  createdAt: string;
  analysisId?: string;
}

// Mock data for testing (will be replaced with Supabase data)
const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    title: 'Pattern Detected: Escalating Gravity',
    message: 'Last 3 analyses show increasing emotional gravity (+15%). Consider strategic recalibration.',
    severity: 'high',
    status: 'open',
    createdAt: '2 hours ago',
    analysisId: 'analysis-123'
  },
  {
    id: '2',
    title: 'Risk Spike Detected',
    message: 'Your latest interaction scored Risk 8/10, up from your 7-day average of 4.2.',
    severity: 'medium',
    status: 'open',
    createdAt: '5 hours ago',
    analysisId: 'analysis-124'
  },
  {
    id: '3',
    title: 'Power Signature Stable',
    message: 'Consistent power scores across last 5 analyses. You\'re holding frame effectively.',
    severity: 'low',
    status: 'open',
    createdAt: '1 day ago',
    analysisId: 'analysis-125'
  },
  {
    id: '4',
    title: 'Weekly Summary Ready',
    message: 'Your sovereignty metrics for this week show +12% improvement. Tap to review.',
    severity: 'low',
    status: 'resolved',
    createdAt: '2 days ago'
  },
];

type FilterType = 'all' | 'open' | 'resolved';

interface AlertsInboxScreenProps {
  onBack: () => void;
  onViewAnalysis?: (analysisId: string) => void;
}

export function AlertsInboxScreen({ onBack, onViewAnalysis }: AlertsInboxScreenProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

  // Filter alerts based on selected filter
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.status === filter;
  });

  // Get severity indicator color and icon
  const getSeverityConfig = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return {
          color: 'bg-red-400',
          icon: AlertTriangle,
          borderColor: 'border-red-400/30'
        };
      case 'medium':
        return {
          color: 'bg-amber-400',
          icon: Clock,
          borderColor: 'border-amber-400/30'
        };
      case 'low':
        return {
          color: 'bg-green-400',
          icon: CheckCircle2,
          borderColor: 'border-green-400/30'
        };
    }
  };

  // Handle alert tap
  const handleAlertTap = (alert: Alert) => {
    if (alert.analysisId && onViewAnalysis) {
      // Deep-link to analysis
      onViewAnalysis(alert.analysisId);
    }
  };

  // Handle resolve action
  const handleResolve = (alertId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent alert tap
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, status: 'resolved' as const } : alert
      )
    );
    // TODO: POST /api/alerts/update-status when backend is ready
  };

  // Count alerts by status
  const openCount = alerts.filter(a => a.status === 'open').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-navy via-deep-blue to-navy pb-24">
      {/* Header */}
      <BrandHeader onBack={onBack} />

      {/* Content */}
      <div className="px-6 pt-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-glass border border-border-cyan">
              <Bell className="w-6 h-6 text-cyan" />
            </div>
            <h1 className="text-white">Alerts Inbox</h1>
          </div>
          <p className="text-white/70">
            Predictive insights from your power dynamics
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={`
              px-6 py-3 rounded-full min-h-[48px] whitespace-nowrap
              transition-all duration-200
              ${filter === 'all'
                ? 'bg-gradient-to-r from-cyan to-deep-blue text-white shadow-lg shadow-cyan-500/30'
                : 'bg-glass border border-border text-white/70 hover:bg-glass-strong'
              }
            `}
          >
            All {alerts.length > 0 && `(${alerts.length})`}
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`
              px-6 py-3 rounded-full min-h-[48px] whitespace-nowrap
              transition-all duration-200
              ${filter === 'open'
                ? 'bg-gradient-to-r from-cyan to-deep-blue text-white shadow-lg shadow-cyan-500/30'
                : 'bg-glass border border-border text-white/70 hover:bg-glass-strong'
              }
            `}
          >
            Open {openCount > 0 && `(${openCount})`}
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`
              px-6 py-3 rounded-full min-h-[48px] whitespace-nowrap
              transition-all duration-200
              ${filter === 'resolved'
                ? 'bg-gradient-to-r from-cyan to-deep-blue text-white shadow-lg shadow-cyan-500/30'
                : 'bg-glass border border-border text-white/70 hover:bg-glass-strong'
              }
            `}
          >
            Resolved {resolvedCount > 0 && `(${resolvedCount})`}
          </button>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          // Empty State
          <div className="mt-12 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-glass border border-border flex items-center justify-center">
              <Bell className="w-10 h-10 text-white/40" />
            </div>
            <p className="text-white/60">
              {filter === 'open' && 'No open alerts'}
              {filter === 'resolved' && 'No resolved alerts'}
              {filter === 'all' && 'No alerts yet'}
            </p>
            <p className="text-white/40 text-sm px-8">
              Run more analyses to start receiving predictive insights and pattern alerts
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => {
              const severityConfig = getSeverityConfig(alert.severity);
              const SeverityIcon = severityConfig.icon;

              return (
                <button
                  key={alert.id}
                  onClick={() => handleAlertTap(alert)}
                  className={`
                    w-full p-5 rounded-3xl
                    bg-glass backdrop-blur-md
                    border ${severityConfig.borderColor}
                    hover:bg-glass-strong
                    transition-all duration-200
                    min-h-[96px]
                    text-left
                    active:scale-[0.98]
                  `}
                >
                  <div className="flex items-start gap-4">
                    {/* Severity Indicator */}
                    <div className="flex-shrink-0 pt-1">
                      <div className={`w-3 h-3 rounded-full ${severityConfig.color} shadow-lg`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Title */}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-white font-medium">
                          {alert.title}
                        </h3>
                        <SeverityIcon className={`w-5 h-5 flex-shrink-0 ${
                          alert.severity === 'high' ? 'text-red-400' :
                          alert.severity === 'medium' ? 'text-amber-400' :
                          'text-green-400'
                        }`} />
                      </div>

                      {/* Message */}
                      <p className="text-white/70 text-sm leading-relaxed">
                        {alert.message}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-white/50 text-xs">
                          {alert.createdAt}
                        </span>

                        <div className="flex items-center gap-3">
                          {/* Resolve Button (only for open alerts) */}
                          {alert.status === 'open' && (
                            <button
                              onClick={(e) => handleResolve(alert.id, e)}
                              className="
                                px-4 py-2 rounded-full
                                bg-glass border border-border-cyan
                                text-cyan text-xs
                                hover:bg-glass-strong
                                transition-all duration-200
                                min-h-[36px]
                              "
                            >
                              Resolve
                            </button>
                          )}

                          {/* Resolved Badge */}
                          {alert.status === 'resolved' && (
                            <div className="flex items-center gap-2 text-green-400 text-xs">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Resolved</span>
                            </div>
                          )}

                          {/* Chevron (if has analysis link) */}
                          {alert.analysisId && (
                            <ChevronRight className="w-5 h-5 text-white/40" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-8 p-5 rounded-3xl bg-glass/50 border border-border-subtle">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-white/80 text-sm">
                <span className="font-medium">How Alerts Work</span>
              </p>
              <p className="text-white/60 text-xs leading-relaxed">
                Our AI analyzes patterns across your recent interactions and surfaces predictive insights. 
                Tap an alert to view the associated analysis or resolve to mark as addressed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
