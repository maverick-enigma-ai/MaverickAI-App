import { useState } from 'react';
import { User, Settings, CreditCard, LogOut, Crown, Shield, FileText, Trash2 } from 'lucide-react';
import { BrandHeader } from './BrandHeader';
import { DeleteAccountModal } from './DeleteAccountModal';
import { categoryInfo, type ScenarioCategory } from '../types/sample-scenarios';
import { APP_VERSION, APP_NAME } from '../utils/constants';
import { BRAND_COLORS } from '../utils/brand-colors';
import { Button } from './ui/button';

interface ProfileScreenProps {
  user: any;
  onSignOut: () => void;
  onUpgrade: () => void;
  onDeleteAccount: () => Promise<void>;
  onViewPrivacy: () => void;
  onViewTerms: () => void;
  enabledScenarios?: ScenarioCategory[];
  onToggleScenario?: (category: ScenarioCategory) => void;
}

export function ProfileScreen({ 
  user, 
  onSignOut, 
  onUpgrade, 
  onDeleteAccount, 
  onViewPrivacy, 
  onViewTerms,
  enabledScenarios = ['corporate', 'personal', 'wealth', 'legal'],
  onToggleScenario
}: ProfileScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useState<HTMLInputElement | null>(null)[0];

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await onSignOut();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    await onDeleteAccount();
    setShowDeleteModal(false);
  };
  
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5MB');
        return;
      }
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        // In production, you would upload to Supabase Storage here
        // For now, just store in localStorage
        localStorage.setItem(`profile_photo_${user.uid}`, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Load saved profile photo on mount
  useState(() => {
    const saved = localStorage.getItem(`profile_photo_${user.uid}`);
    if (saved) {
      setProfilePhoto(saved);
    }
  });

  return (
    <div className="w-full min-h-screen pb-24" style={{ background: BRAND_COLORS.gradients.background }}>
      {/* Header */}
      <BrandHeader subtitle="Profile" />
      
      {/* User Info Card */}
      <div className="p-6 pt-8">
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center mb-6">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <button
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 relative overflow-hidden group hover:shadow-cyan-500/50 transition-all"
              data-name="btn_upload_photo"
            >
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
              
              {/* Upload overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                <span className="text-white text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Upload
                </span>
              </div>
            </button>
            
            {/* Hidden file input */}
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          
          <h2 className="text-white text-xl mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            {user?.displayName || user?.email || 'Strategic Analyst'}
          </h2>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Premium Member
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Subscription Status */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              Subscription Status
            </h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-cyan-200 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Plan
              </span>
              <span className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Premium Monthly
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-cyan-200 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Scans Remaining
              </span>
              <span className="text-cyan-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Unlimited
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-cyan-200 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Next Billing
              </span>
              <span className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Dec 15, 2024
              </span>
            </div>
          </div>
        </div>

        {/* Sample Scenarios Settings */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-5 flex items-center justify-center">
              <span className="text-base">📋</span>
            </div>
            <h3 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              Sample Scenarios
            </h3>
          </div>
          
          <p className="text-cyan-200 text-sm mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Choose which scenario categories appear on the input screen
          </p>
          
          <div className="space-y-3">
            {(Object.keys(categoryInfo) as ScenarioCategory[]).map(category => {
              const info = categoryInfo[category];
              const isEnabled = enabledScenarios.includes(category);
              
              return (
                <div 
                  key={category}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{info.icon}</span>
                    <div>
                      <p className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                        {info.label}
                      </p>
                      <p className="text-cyan-300/70 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {category === 'corporate' && 'Workplace dynamics'}
                        {category === 'personal' && 'Relationship patterns'}
                        {category === 'wealth' && 'Financial influence'}
                        {category === 'legal' && 'Legal negotiations'}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => onToggleScenario?.(category)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
                      isEnabled ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-white/20'
                    }`}
                    data-name={`toggle_scenario_${category}`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-lg ${
                        isEnabled ? 'translate-x-[26px]' : 'translate-x-0.5'
                      }`}
                    />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          <button
            onClick={onUpgrade}
            className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 min-h-[64px] transition-all hover:bg-white/20"
            data-name="btn_billing"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <div className="flex-1 text-left">
                <h4 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Billing & Payments
                </h4>
                <p className="text-cyan-300 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Manage your subscription
                </p>
              </div>
            </div>
          </button>

          <button
            className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 min-h-[64px] transition-all hover:bg-white/20"
            data-name="btn_settings"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-cyan-400" />
              <div className="flex-1 text-left">
                <h4 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Settings
                </h4>
                <p className="text-cyan-300 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Preferences and notifications
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={onViewPrivacy}
            className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 min-h-[64px] transition-all hover:bg-white/20"
            data-name="btn_privacy_policy"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-cyan-400" />
              <div className="flex-1 text-left">
                <h4 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Privacy Policy
                </h4>
                <p className="text-cyan-300 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  How we protect your data
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={onViewTerms}
            className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 min-h-[64px] transition-all hover:bg-white/20"
            data-name="btn_terms_of_service"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              <div className="flex-1 text-left">
                <h4 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Terms of Service
                </h4>
                <p className="text-cyan-300 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Service agreement details
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Sign Out & Delete Account */}
        <div className="pt-6 space-y-3">
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-md rounded-full p-4 border border-red-500/30 min-h-[56px] transition-all hover:from-red-500/30 hover:to-red-600/30 shadow-lg shadow-red-500/10 disabled:opacity-50"
            data-name="btn_sign_out"
          >
            <div className="flex items-center justify-center gap-3">
              <LogOut className="w-5 h-5 text-red-400" />
              <span className="text-red-400" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                {isLoading ? 'Signing Out...' : 'Sign Out'}
              </span>
            </div>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full bg-red-500/10 backdrop-blur-md rounded-full p-4 border border-red-500/20 min-h-[56px] transition-all hover:bg-red-500/20"
            data-name="btn_delete_account"
          >
            <div className="flex items-center justify-center gap-3">
              <Trash2 className="w-5 h-5 text-red-300" />
              <span className="text-red-300" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Delete Account
              </span>
            </div>
          </button>
        </div>

        {/* App Info */}
        <div className="pt-6 text-center">
          <p className="text-cyan-400/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {APP_NAME} v{APP_VERSION}
          </p>
          <p className="text-cyan-400/60 text-xs mt-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Psychological Intelligence Platform
          </p>
          <p className="text-white/30 text-xs mt-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            © 2025 MaverickAI Enigma Radar™
          </p>
          <p className="text-white/20 text-xs mt-1 leading-relaxed px-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            All Rights Reserved. Proprietary technology protected by law.
          </p>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          userEmail={user?.email || ''}
        />
      )}
    </div>
  );
}