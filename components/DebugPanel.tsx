import { useState } from 'react';
import { VERSION_INFO } from '../utils/constants';

interface DebugPanelProps {
  logs: string[];
  isVisible: boolean;
  onToggle: () => void;
  onClear: () => void;
  onTestWebhook?: () => void;
  onCheckDatabase?: () => void;
  onForceSubmit?: () => void;
  onGoToSandbox?: () => void;
  onReplaySplash?: () => void;
  // 🆕 Sovereignty Features
  enableSovereigntyFeatures?: boolean;
  onToggleSovereigntyFeatures?: () => void;
  onGoToAlerts?: () => void;
  onGoToSovereigntyDashboard?: () => void;
  onGoToWhatIfLab?: () => void;
  onGoToReflexTrainer?: () => void;
  onGoToEnhancedRadar?: () => void;
}

export function DebugPanel({ logs, isVisible, onToggle, onClear, onTestWebhook, onCheckDatabase, onForceSubmit, onGoToSandbox, onReplaySplash, enableSovereigntyFeatures, onToggleSovereigntyFeatures, onGoToAlerts, onGoToSovereigntyDashboard, onGoToWhatIfLab, onGoToReflexTrainer, onGoToEnhancedRadar }: DebugPanelProps) {
  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 bg-purple-600/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs"
        data-name="btn_show_debug"
      >
        Show Debug
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-h-96 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
      <div className="flex flex-col p-3 border-b border-white/20 gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-white text-sm font-medium">RunRadar Debug</h3>
            <p className="text-xs text-gray-400">
              v{VERSION_INFO.app} • Sovereignty {VERSION_INFO.sovereignty}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs text-gray-400">{logs.length} logs</span>
            <button
              onClick={onClear}
              className="text-cyan-400 hover:text-cyan-300 text-xs"
              data-name="btn_clear_debug"
            >
              Clear
            </button>
            <button
              onClick={onToggle}
              className="text-white hover:text-gray-300 text-xs"
              data-name="btn_hide_debug"
            >
              Hide
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {onTestWebhook && (
              <button
                onClick={onTestWebhook}
                className="flex-1 bg-green-600/80 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                data-name="btn_test_webhook"
              >
                Test Webhook
              </button>
            )}
            {onCheckDatabase && (
              <button
                onClick={onCheckDatabase}
                className="flex-1 bg-blue-600/80 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                data-name="btn_check_database"
              >
                Check DB
              </button>
            )}
          </div>
          {onForceSubmit && (
            <button
              onClick={onForceSubmit}
              className="w-full bg-orange-600/80 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs"
              data-name="btn_force_submit"
            >
              🚀 Force Submit (Bypass All Checks)
            </button>
          )}
          {onGoToSandbox && (
            <button
              onClick={onGoToSandbox}
              className="w-full bg-cyan-600/80 hover:bg-cyan-600 text-white px-2 py-1 rounded text-xs"
              data-name="btn_go_to_sandbox"
            >
              🧪 Go to Sandbox
            </button>
          )}
          {onReplaySplash && (
            <button
              onClick={onReplaySplash}
              className="w-full bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-600 hover:to-cyan-600 text-white px-2 py-1 rounded text-xs"
              data-name="btn_replay_splash"
            >
              🎬 Replay Splash Screen
            </button>
          )}
          <a
            href="/download-icons.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-pink-600/80 to-orange-600/80 hover:from-pink-600 hover:to-orange-600 text-white px-2 py-1 rounded text-xs text-center block"
            data-name="btn_download_icons"
          >
            📥 Download PWA Icons
          </a>
          
          {/* 🆕 SOVEREIGNTY FEATURES - Debug Controls */}
          <div className="pt-2 mt-2 border-t border-white/20 space-y-2">
            <div className="text-xs text-yellow-400 font-medium">🆕 Sovereignty Features (Beta v1.1.0)</div>
            {onToggleSovereigntyFeatures && (
              <button
                onClick={onToggleSovereigntyFeatures}
                className={`w-full px-2 py-1 rounded text-xs transition-all ${
                  enableSovereigntyFeatures 
                    ? 'bg-green-600/80 hover:bg-green-600 text-white' 
                    : 'bg-gray-600/80 hover:bg-gray-600 text-white/70'
                }`}
                data-name="btn_toggle_sovereignty"
              >
                {enableSovereigntyFeatures ? '✅' : '❌'} Enable/Disable All
              </button>
            )}
            
            {/* Navigation Buttons - Only show when feature flag is ON */}
            {enableSovereigntyFeatures && (
              <div className="space-y-1.5">
                <div className="text-xs text-white/60">Navigate to:</div>
                
                {onGoToAlerts && (
                  <button
                    onClick={onGoToAlerts}
                    className="w-full bg-gradient-to-r from-cyan-600/80 to-teal-600/80 hover:from-cyan-600 hover:to-teal-600 text-white px-2 py-1 rounded text-xs"
                    data-name="btn_go_to_alerts"
                  >
                    🔔 Alerts Inbox
                  </button>
                )}
                
                {onGoToSovereigntyDashboard && (
                  <button
                    onClick={onGoToSovereigntyDashboard}
                    className="w-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white px-2 py-1 rounded text-xs"
                    data-name="btn_go_to_sovereignty_dashboard"
                  >
                    📊 Sovereignty Dashboard
                  </button>
                )}
                
                {onGoToWhatIfLab && (
                  <button
                    onClick={onGoToWhatIfLab}
                    className="w-full bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600 text-white px-2 py-1 rounded text-xs"
                    data-name="btn_go_to_whatif_lab"
                  >
                    🧪 What-If Lab
                  </button>
                )}
                
                {onGoToReflexTrainer && (
                  <button
                    onClick={onGoToReflexTrainer}
                    className="w-full bg-gradient-to-r from-gold/80 to-orange-600/80 hover:from-gold hover:to-orange-600 text-white px-2 py-1 rounded text-xs"
                    data-name="btn_go_to_reflex_trainer"
                  >
                    🎯 Reflex Trainer
                  </button>
                )}
                
                {onGoToEnhancedRadar && (
                  <button
                    onClick={onGoToEnhancedRadar}
                    className="w-full bg-gradient-to-r from-teal-600/80 to-cyan-600/80 hover:from-teal-600 hover:to-cyan-600 text-white px-2 py-1 rounded text-xs"
                    data-name="btn_go_to_enhanced_radar"
                  >
                    ⚡ Enhanced Radar
                  </button>
                )}
                
                <div className="text-xs text-white/40 pt-1">
                  5/5 features • 100% complete
                </div>
              </div>
            )}
            
            {/* Show hint when feature flag is OFF */}
            {!enableSovereigntyFeatures && (
              <div className="text-xs text-white/40 italic">
                Enable to access 5 beta features
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-3 max-h-80 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-gray-400 text-xs">No debug logs yet...</p>
        ) : (
          <div className="space-y-1">
            {logs.slice(0, 20).map((log, index) => (
              <div key={`${Date.now()}-${index}`} className="text-xs">
                <pre className="text-green-400 whitespace-pre-wrap break-words font-mono">
                  {log}
                </pre>
              </div>
            ))}
            {logs.length > 20 && (
              <div className="text-xs text-gray-500 text-center py-2">
                ... {logs.length - 20} more logs (click Clear to reset)
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}