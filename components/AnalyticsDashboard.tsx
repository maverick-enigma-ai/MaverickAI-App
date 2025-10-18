/**
 * MaverickAI Enigma Radar™ - Analytics Dashboard
 * 
 * View tracked events and performance metrics
 * Answers the question: "Can users get to dashboard within 3 minutes?"
 */

import { useState } from 'react';
import { analytics } from '../services/analytics-service';
import { BrandHeader } from './BrandHeader';
import { X, BarChart3, Clock, TrendingUp, Activity } from 'lucide-react';
import { Button } from './ui/button';

interface AnalyticsDashboardProps {
  onClose: () => void;
}

export function AnalyticsDashboard({ onClose }: AnalyticsDashboardProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const performanceSummary = analytics.getPerformanceSummary();
  const recentEvents = analytics.getEventLog().slice(0, 20);

  const handleExport = () => {
    const data = analytics.exportEvents();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maverick-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleClear = () => {
    if (confirm('Clear all analytics data?')) {
      analytics.clearLog();
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] text-white">
      <BrandHeader/>

      {/* Close Button */}
      <Button
        onClick={onClose}
        className="fixed top-6 right-6 z-50 flex items-center justify-center size-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
      >
        <X className="size-6" />
      </Button>

      <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        {/* Performance Summary */}
        <div className="mb-8">
          <h2 className="mb-6 flex items-center gap-3">
            <BarChart3 className="size-6 text-[#00d4ff]" />
            Performance Summary
          </h2>

          {/* 3-Minute Challenge Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="size-8 text-[#00d4ff]" />
              <div>
                <h3 className="text-[#00d4ff]">3-Minute Dashboard Challenge</h3>
                <p className="text-sm text-white/60">Time from submission to dashboard</p>
              </div>
            </div>

            {performanceSummary.timeToDashboardEvents.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/5">
                  <div className="text-3xl mb-1">
                    {performanceSummary.averageTimeToDashboard 
                      ? `${performanceSummary.averageTimeToDashboard.toFixed(1)}s`
                      : 'N/A'
                    }
                  </div>
                  <div className="text-sm text-white/60">Average Time</div>
                </div>

                <div className="p-4 rounded-2xl bg-green-500/20 border border-green-500/30">
                  <div className="text-3xl mb-1 text-green-400">
                    {performanceSummary.under3MinutesCount}
                  </div>
                  <div className="text-sm text-white/60">Under 3 min ✓</div>
                </div>

                <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/30">
                  <div className="text-3xl mb-1 text-red-400">
                    {performanceSummary.over3MinutesCount}
                  </div>
                  <div className="text-sm text-white/60">Over 3 min ✗</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-white/40">
                <Clock className="size-12 mx-auto mb-2 opacity-30" />
                <p>No timing data yet. Submit an analysis to start tracking!</p>
              </div>
            )}
          </div>

          {/* Total Events */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="size-5 text-[#8b5cf6]" />
                <span className="text-sm text-white/60">Total Events</span>
              </div>
              <div className="text-2xl">{performanceSummary.totalEvents}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="size-5 text-[#14b8a6]" />
                <span className="text-sm text-white/60">Completions</span>
              </div>
              <div className="text-2xl">{performanceSummary.timeToDashboardEvents.length}</div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="mb-8">
          <h2 className="mb-4">Recent Events</h2>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {recentEvents.length > 0 ? (
              recentEvents.map((event, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff] text-xs">
                          {event.event}
                        </span>
                        {event.properties?.duration_seconds && (
                          <span className="px-2 py-1 rounded-lg bg-[#8b5cf6]/20 text-[#8b5cf6] text-xs">
                            {event.properties.duration_seconds}s
                          </span>
                        )}
                      </div>
                      {event.properties && Object.keys(event.properties).length > 0 && (
                        <div className="text-xs text-white/40 font-mono">
                          {Object.entries(event.properties)
                            .filter(([key]) => !['platform', 'app_version', 'screen_width', 'screen_height'].includes(key))
                            .slice(0, 3)
                            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                            .join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-white/40 whitespace-nowrap">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-white/40">
                <Activity className="size-12 mx-auto mb-2 opacity-30" />
                <p>No events tracked yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleExport}
            className="flex-1 h-14 px-6 rounded-full bg-gradient-to-r from-[#00d4ff] to-[#14b8a6] text-[#14123F] hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200"
          >
            Export JSON
          </button>
          
          <button
            onClick={handleClear}
            className="flex-1 h-14 px-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
          >
            Clear Data
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 rounded-2xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/20">
          <p className="text-sm text-white/60">
            <strong className="text-[#8b5cf6]">BravoStudio Ready:</strong> This analytics
            service automatically integrates with Google Analytics 4 and BravoStudio's
            analytics bridge when deployed.
          </p>
        </div>
      </div>
    </div>
  );
}
