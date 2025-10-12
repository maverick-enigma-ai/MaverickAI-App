import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { MasterAppIcon } from './icons/MasterAppIcon';
import { ForgotPasswordModal } from './ForgotPasswordModal';

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
  
  // Clear error when switching between sign in/up
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
    <div className="w-full min-h-screen bg-gradient-to-b from-[#14123F] via-[#342FA5] to-[#14123F] flex flex-col">
      {/* Header */}
      <div className="p-6 pt-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <MasterAppIcon size={64} />
          <div className="text-left">
            <h1 className="text-xl text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              MaverickAI
            </h1>
            <h2 className="text-xl text-cyan-400" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              Enigma Radar™
            </h2>
          </div>
        </div>

        <h3 className="text-white text-lg mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h3>
        <p className="text-cyan-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          {isSignUp ? 'Join the psychological intelligence revolution' : 'Access your strategic intelligence platform'}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 p-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl backdrop-blur-md">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    {error}
                  </p>
                </div>
                {onClearError && (
                  <button
                    type="button"
                    onClick={onClearError}
                    className="flex-shrink-0 text-red-300 hover:text-white transition-colors"
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
                <label className="block text-white text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all min-h-[48px]"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                    required
                    data-name="input_name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-white text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all min-h-[48px]"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  required
                  data-name="input_email"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all min-h-[48px]"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  required
                  data-name="input_password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
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
                  className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm min-h-[48px]"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  data-name="btn_forgot_password"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-cyan-600 disabled:to-blue-600 text-white py-4 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/20 min-h-[56px] disabled:opacity-50"
              data-name={isSignUp ? "btn_sign_up" : "btn_sign_in"}
            >
              <div className="flex items-center justify-center gap-3">
                <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                  {isSubmitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
                </span>
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </div>
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-cyan-400 text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              or
            </span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || loading}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 text-white py-4 rounded-full transition-all shadow-lg min-h-[56px] disabled:opacity-50"
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
            <button
              onClick={handleToggleMode}
              className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              data-name="btn_toggle_auth_mode"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-cyan-400/60 text-xs" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            By continuing, you agree to our{' '}
            <button
              onClick={onViewTerms}
              className="text-cyan-400 hover:text-cyan-300 underline"
              data-name="btn_view_terms_from_auth"
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button
              onClick={onViewPrivacy}
              className="text-cyan-400 hover:text-cyan-300 underline"
              data-name="btn_view_privacy_from_auth"
            >
              Privacy Policy
            </button>
          </p>
          
          {/* Copyright Notice */}
          <p className="text-white/30 text-xs mt-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            © 2025 MaverickAI Enigma Radar™
          </p>
          <p className="text-white/20 text-xs mt-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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