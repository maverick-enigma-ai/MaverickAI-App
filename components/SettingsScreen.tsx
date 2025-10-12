import { useState, useEffect } from 'react';
import { ChevronRight, Moon, Sun, Bell, Shield, Info, HelpCircle, BarChart3, Check } from 'lucide-react';
import { BrandHeader } from './BrandHeader';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { NavigationBar } from './NavigationBar';
import { APP_VERSION, APP_NAME } from '../utils/constants';

interface SettingsScreenProps {
  onBack: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onRadarScan?: () => void;
}

export function SettingsScreen({ onBack, activeTab = 'moves', onTabChange, onRadarScan }: SettingsScreenProps) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [analyticsSharing, setAnalyticsSharing] = useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
  const [showAppearanceSheet, setShowAppearanceSheet] = useState(false);
  const [showTextSizeSheet, setShowTextSizeSheet] = useState(false);
  const [showEmailSheet, setShowEmailSheet] = useState(false);
  const [showPrivacySheet, setShowPrivacySheet] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);
  const [showAboutSheet, setShowAboutSheet] = useState(false);
  
  // Text size state - read from localStorage
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>(() => {
    const saved = localStorage.getItem('textSize');
    return (saved as 'small' | 'medium' | 'large') || 'medium';
  });
  
  // Apply text size changes to document
  useEffect(() => {
    document.documentElement.setAttribute('data-text-size', textSize);
    localStorage.setItem('textSize', textSize);
  }, [textSize]);
  
  // Get display labels
  const textSizeLabel = {
    small: 'Small',
    medium: 'Default',
    large: 'Large'
  }[textSize];
  
  if (showAnalyticsDashboard) {
    return <AnalyticsDashboard onClose={() => setShowAnalyticsDashboard(false)} />;
  }

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] overflow-y-auto pb-40">
        {/* Header */}
        <BrandHeader subtitle="Settings" />

      <div className="px-6 pt-8 space-y-6">
        {/* Display Section */}
        <div className="space-y-3">
          <h3 className="text-white/60 text-xs px-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            DISPLAY
          </h3>

          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden">
            {/* Dark Mode */}
            <button
              onClick={() => setShowAppearanceSheet(true)}
              className="w-full p-5 flex items-center justify-between border-b border-white/10 hover:bg-white/5 transition-colors min-h-[64px]"
              data-name="btn_dark_mode"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  {darkMode ? (
                    <Moon className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Appearance
                  </p>
                  <p className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {darkMode ? 'Dark' : 'Light'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>

            {/* Text Size */}
            <button
              onClick={() => setShowTextSizeSheet(true)}
              className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors min-h-[64px]"
              data-name="btn_text_size"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <span className="text-cyan-400 text-xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Aa
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Text Size
                  </p>
                  <p className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {textSizeLabel}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="space-y-3">
          <h3 className="text-white/60 text-xs px-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            NOTIFICATIONS
          </h3>

          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden">
            {/* Push Notifications */}
            <div className="p-5 flex items-center justify-between border-b border-white/10 min-h-[64px]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-pink-400" />
                </div>
                <div className="text-left">
                  <p className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Push Notifications
                  </p>
                  <p className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Analysis updates
                  </p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  notifications ? 'bg-green-500' : 'bg-white/20'
                }`}
                data-name="toggle_notifications"
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                    notifications ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Email Updates */}
            <button
              onClick={() => setShowEmailSheet(true)}
              className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors min-h-[64px]"
              data-name="btn_email_updates"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 text-xl">✉️</span>
                </div>
                <div className="text-left">
                  <p className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Email Updates
                  </p>
                  <p className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Weekly insights
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>
          </div>
        </div>

        {/* Privacy & Security Section */}
        <div className="space-y-3">
          <h3 className="text-white/60 text-xs px-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            PRIVACY & SECURITY
          </h3>

          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden">
            {/* Analytics Sharing */}
            <div className="p-5 flex items-center justify-between border-b border-white/10 min-h-[64px]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-teal-400" />
                </div>
                <div className="text-left">
                  <p className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Share Analytics
                  </p>
                  <p className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Help improve the app
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAnalyticsSharing(!analyticsSharing)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  analyticsSharing ? 'bg-green-500' : 'bg-white/20'
                }`}
                data-name="toggle_analytics"
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                    analyticsSharing ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Data Privacy */}
            <button
              onClick={() => setShowPrivacySheet(true)}
              className="w-full p-5 flex items-center justify-between border-b border-white/10 hover:bg-white/5 transition-colors min-h-[64px]"
              data-name="btn_data_privacy"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Data Privacy
                  </p>
                  <p className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Manage your data
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>

            {/* Analytics Dashboard - Now visible for testing */}
            <button
              onClick={() => setShowAnalyticsDashboard(true)}
              className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors min-h-[64px]"
              data-name="btn_analytics"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-left">
                  <p className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Analytics Dashboard
                  </p>
                  <p className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    View performance metrics
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>
          </div>
        </div>

        {/* Help & Support Section */}
        <div className="space-y-3">
          <h3 className="text-white/60 text-xs px-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            HELP & SUPPORT
          </h3>

          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden">
            {/* Help Center */}
            <button
              onClick={() => setShowHelpSheet(true)}
              className="w-full p-5 flex items-center justify-between border-b border-white/10 hover:bg-white/5 transition-colors min-h-[64px]"
              data-name="btn_help_center"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-left">
                  <p className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Help Center
                  </p>
                  <p className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    FAQs and guides
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>

            {/* About */}
            <button
              onClick={() => setShowAboutSheet(true)}
              className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors min-h-[64px]"
              data-name="btn_about"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Info className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-left">
                  <p className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    About
                  </p>
                  <p className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Version {APP_VERSION}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>
          </div>
        </div>

        {/* Done Button - Aligned with standard button design */}
        <button
          onClick={onBack}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-4 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/20 min-h-[56px] active:scale-98"
          data-name="btn_done_settings"
        >
          <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            Done
          </span>
        </button>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-white/40 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {APP_NAME} v{APP_VERSION}
          </p>
          <p className="text-white/30 text-xs mt-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Advanced Psychological Intelligence
          </p>
        </div>
        </div>
      </div>

      {/* Navigation Bar */}
      {onTabChange && onRadarScan && (
        <div className="fixed bottom-0 left-0 right-0">
          <NavigationBar
            activeTab={activeTab}
            onTabChange={onTabChange}
            onRadarScan={onRadarScan}
          />
        </div>
      )}

      {/* Bottom Sheets for each option */}
      {showAppearanceSheet && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowAppearanceSheet(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full bg-gradient-to-b from-[#342FA5] to-[#14123F] rounded-t-3xl p-8 border-t border-white/20 animate-in slide-in-from-bottom duration-300" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white text-xl mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>Appearance</h3>
            <p className="text-white/60 text-sm mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Currently locked to Dark Mode for optimal psychological intelligence analysis display. Light mode coming soon.
            </p>
            
            {/* Dark/Light Mode Options (Dark mode only for now) */}
            <div className="space-y-3 mb-8">
              <button
                onClick={() => {/* Keep dark mode */}}
                className="w-full p-4 rounded-2xl bg-white/10 border-2 border-cyan-500 flex items-center justify-between"
                data-name="btn_dark_mode_option"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Moon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      Dark Mode
                    </p>
                    <p className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Default
                    </p>
                  </div>
                </div>
                <Check className="w-5 h-5 text-cyan-400" />
              </button>
              
              <button
                disabled
                className="w-full p-4 rounded-2xl bg-white/5 border-2 border-white/10 opacity-50 flex items-center justify-between cursor-not-allowed"
                data-name="btn_light_mode_option"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Sun className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white/60" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      Light Mode
                    </p>
                    <p className="text-white/40 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Coming Soon
                    </p>
                  </div>
                </div>
              </button>
            </div>
            
            <button 
              onClick={() => setShowAppearanceSheet(false)} 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-4 rounded-full min-h-[56px] transition-all shadow-lg shadow-cyan-500/20" 
              data-name="btn_close_appearance"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {showTextSizeSheet && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowTextSizeSheet(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full bg-gradient-to-b from-[#342FA5] to-[#14123F] rounded-t-3xl p-8 border-t border-white/20 animate-in slide-in-from-bottom duration-300" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white text-xl mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>Text Size</h3>
            <p className="text-white/60 text-sm mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Adjust text size for better readability across the entire app
            </p>
            
            {/* Text Size Options */}
            <div className="space-y-3 mb-8">
              {/* Small */}
              <button
                onClick={() => setTextSize('small')}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  textSize === 'small'
                    ? 'bg-white/10 border-cyan-500'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                data-name="btn_text_small"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <span className="text-cyan-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      Aa
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      Small
                    </p>
                    <p className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Compact view
                    </p>
                  </div>
                </div>
                {textSize === 'small' && <Check className="w-5 h-5 text-cyan-400" />}
              </button>
              
              {/* Medium (Default) */}
              <button
                onClick={() => setTextSize('medium')}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  textSize === 'medium'
                    ? 'bg-white/10 border-cyan-500'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                data-name="btn_text_medium"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <span className="text-cyan-400 text-base" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      Aa
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      Default
                    </p>
                    <p className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Standard size
                    </p>
                  </div>
                </div>
                {textSize === 'medium' && <Check className="w-5 h-5 text-cyan-400" />}
              </button>
              
              {/* Large */}
              <button
                onClick={() => setTextSize('large')}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  textSize === 'large'
                    ? 'bg-white/10 border-cyan-500'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                data-name="btn_text_large"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <span className="text-cyan-400 text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      Aa
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-white text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                      Large
                    </p>
                    <p className="text-white/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      Better readability
                    </p>
                  </div>
                </div>
                {textSize === 'large' && <Check className="w-5 h-5 text-cyan-400" />}
              </button>
            </div>
            
            <button 
              onClick={() => setShowTextSizeSheet(false)} 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-4 rounded-full min-h-[56px] transition-all shadow-lg shadow-cyan-500/20" 
              data-name="btn_close_text_size"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {showEmailSheet && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowEmailSheet(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full bg-gradient-to-b from-[#342FA5] to-[#14123F] rounded-t-3xl p-8 border-t border-white/20 animate-in slide-in-from-bottom duration-300" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white text-xl mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>Email Updates</h3>
            <p className="text-white/60 text-sm mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Receive weekly insights and analysis summaries</p>
            <button onClick={() => setShowEmailSheet(false)} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-full min-h-[56px]" data-name="btn_close_email">
              <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>Close</span>
            </button>
          </div>
        </div>
      )}

      {showPrivacySheet && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowPrivacySheet(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full bg-gradient-to-b from-[#342FA5] to-[#14123F] rounded-t-3xl p-8 border-t border-white/20 animate-in slide-in-from-bottom duration-300" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white text-xl mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>Data Privacy</h3>
            <p className="text-white/60 text-sm mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Your data is encrypted and secure. We never share your personal information.</p>
            <button onClick={() => setShowPrivacySheet(false)} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-full min-h-[56px]" data-name="btn_close_privacy">
              <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>Close</span>
            </button>
          </div>
        </div>
      )}

      {showHelpSheet && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowHelpSheet(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full bg-gradient-to-b from-[#342FA5] to-[#14123F] rounded-t-3xl p-8 border-t border-white/20 animate-in slide-in-from-bottom duration-300" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white text-xl mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>Help Center</h3>
            <p className="text-white/60 text-sm mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Find answers to frequently asked questions and guides</p>
            <button onClick={() => setShowHelpSheet(false)} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-full min-h-[56px]" data-name="btn_close_help">
              <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>Close</span>
            </button>
          </div>
        </div>
      )}

      {showAboutSheet && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setShowAboutSheet(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full bg-gradient-to-b from-[#342FA5] to-[#14123F] rounded-t-3xl p-8 border-t border-white/20 animate-in slide-in-from-bottom duration-300" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white text-xl mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>About</h3>
            <p className="text-white/60 text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{APP_NAME}</p>
            <p className="text-white/60 text-sm mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Version {APP_VERSION}</p>
            <p className="text-white/40 text-xs mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Advanced Psychological Intelligence Platform</p>
            <button 
              onClick={() => setShowAboutSheet(false)} 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-4 rounded-full min-h-[56px] transition-all shadow-lg shadow-cyan-500/20" 
              data-name="btn_close_about"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
