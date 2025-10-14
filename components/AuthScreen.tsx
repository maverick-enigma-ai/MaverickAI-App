import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { RadarLogoIcon } from './icons/RadarLogoIcon';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { BRAND_COLORS } from '../utils/brand-colors';

interface AuthScreenProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, name: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  onAppleSignIn?: () => Promise<void>; // Optional - not used
  onPasswordReset: (email: string) => Promise<void>;
  onViewPrivacy: () => void;
  onViewTerms: () => void;
  loading?: boolean;
  error?: string | null;
  onClearError?: () => void;
}

export function AuthScreen({ onSignIn, onSignUp, onGoogleSignIn, onPasswordReset, onViewPrivacy, onViewTerms, loading, error, onClearError }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    if (onClearError) onClearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await onSignUp(email, password, name);
      } else {
        await onSignIn(email, password);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onGoogleSignIn();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (resetEmail: string) => {
    await onPasswordReset(resetEmail);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: BRAND_COLORS.gradients.background,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div className="p-6 pt-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16">
            <RadarLogoIcon size={64} />
          </div>
          <div className="text-left">
            <h1 style={{
              fontSize: '1.25rem',
              color: BRAND_COLORS.text.white,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 600
            }}>
              MaverickAI
            </h1>
            <h2 style={{
              fontSize: '1.25rem',
              color: BRAND_COLORS.cyan,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 600
            }}>
              Enigma Radar™
            </h2>
          </div>
        </div>

        <h3 style={{
          color: BRAND_COLORS.text.white,
          fontSize: '1.125rem',
          marginBottom: '0.5rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 600
        }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h3>
        <p style={{
          color: BRAND_COLORS.cyan,
          fontSize: '0.875rem',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {isSignUp ? 'Join the psychological intelligence revolution' : 'Access your strategic intelligence platform'}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 p-6">
        <div className="rounded-3xl p-6 shadow-2xl" style={{
          background: `${BRAND_COLORS.deepBlue}40`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${BRAND_COLORS.borders.purple}`
        }}>
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 rounded-2xl" style={{
              background: `${BRAND_COLORS.semantic.error}33`,
              border: `1px solid ${BRAND_COLORS.semantic.error}4D`,
              backdropFilter: 'blur(20px)'
            }}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5" style={{ color: '#f87171' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p style={{ color: BRAND_COLORS.text.white, fontSize: '0.875rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {error}
                  </p>
                </div>
                {onClearError && (
                  <button
                    type="button"
                    onClick={onClearError}
                    className="flex-shrink-0 transition-colors"
                    style={{ color: '#fca5a5' }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm mb-2" style={{ color: BRAND_COLORS.text.white, fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl px-4 py-4 min-h-[48px] focus:outline-none transition-all"
                    style={{
                      background: `${BRAND_COLORS.deepBlue}4D`,
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${BRAND_COLORS.borders.purple}`,
                      color: BRAND_COLORS.text.white,
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = `${BRAND_COLORS.cyan}80`;
                      e.target.style.boxShadow = `0 0 0 2px ${BRAND_COLORS.cyan}33`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = BRAND_COLORS.borders.purple;
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                    data-name="input_name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm mb-2" style={{ color: BRAND_COLORS.text.white, fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: BRAND_COLORS.cyan }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl pl-12 pr-4 py-4 min-h-[48px] focus:outline-none transition-all"
                  style={{
                    background: `${BRAND_COLORS.deepBlue}4D`,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${BRAND_COLORS.borders.purple}`,
                    color: BRAND_COLORS.text.white,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = `${BRAND_COLORS.cyan}80`;
                    e.target.style.boxShadow = `0 0 0 2px ${BRAND_COLORS.cyan}33`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = BRAND_COLORS.borders.purple;
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                  data-name="input_email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: BRAND_COLORS.text.white, fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: BRAND_COLORS.cyan }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl pl-12 pr-12 py-4 min-h-[48px] focus:outline-none transition-all"
                  style={{
                    background: `${BRAND_COLORS.deepBlue}4D`,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${BRAND_COLORS.borders.purple}`,
                    color: BRAND_COLORS.text.white,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = `${BRAND_COLORS.cyan}80`;
                    e.target.style.boxShadow = `0 0 0 2px ${BRAND_COLORS.cyan}33`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = BRAND_COLORS.borders.purple;
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                  data-name="input_password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors"
                  style={{ color: BRAND_COLORS.cyan }}
                  data-name="btn_toggle_password"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm min-h-[48px] transition-colors"
                  style={{ 
                    color: BRAND_COLORS.cyan,
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                  data-name="btn_forgot_password"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full py-4 rounded-full transition-all duration-300 min-h-[56px]"
              style={{
                background: BRAND_COLORS.gradients.cyanBlue,
                color: BRAND_COLORS.navy,
                boxShadow: `0 10px 30px ${BRAND_COLORS.cyan}30`,
                opacity: (isSubmitting || loading) ? 0.5 : 1,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 600
              }}
              data-name={isSignUp ? "btn_sign_up" : "btn_sign_in"}
            >
              <div className="flex items-center justify-center gap-3">
                <span>
                  {isSubmitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
                </span>
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </div>
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(255, 255, 255, 0.2)' }} />
            <span className="text-sm" style={{ color: BRAND_COLORS.cyan, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              or
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255, 255, 255, 0.2)' }} />
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || loading}
            className="w-full py-4 rounded-full transition-all min-h-[56px]"
            style={{
              background: `${BRAND_COLORS.deepBlue}40`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${BRAND_COLORS.borders.purple}`,
              color: BRAND_COLORS.text.white,
              opacity: (isSubmitting || loading) ? 0.5 : 1
            }}
            data-name="btn_google_signin"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Continue with Google
              </span>
            </div>
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button
                onClick={handleToggleMode}
                className="transition-colors"
                style={{ color: BRAND_COLORS.cyan }}
                data-name="btn_toggle_auth_mode"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            By continuing, you agree to our{' '}
            <button
              onClick={onViewTerms}
              className="underline"
              style={{ color: BRAND_COLORS.cyan }}
              data-name="btn_view_terms_from_auth"
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button
              onClick={onViewPrivacy}
              className="underline"
              style={{ color: BRAND_COLORS.cyan }}
              data-name="btn_view_privacy_from_auth"
            >
              Privacy Policy
            </button>
          </p>
          
          {/* Copyright Notice */}
          <p className="text-xs mt-6" style={{ color: 'rgba(255, 255, 255, 0.3)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            © 2025 MaverickAI Enigma Radar™
          </p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255, 255, 255, 0.2)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            All Rights Reserved
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={() => setShowForgotPassword(false)}
          onSubmit={handlePasswordReset}
        />
      )}
    </div>
  );
}
