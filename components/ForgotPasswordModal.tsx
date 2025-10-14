import { useState } from 'react';
import { Mail, X, CheckCircle } from 'lucide-react';
import { BRAND_COLORS } from '../utils/brand-colors';

interface ForgotPasswordModalProps {
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export function ForgotPasswordModal({ onClose, onSubmit }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !email) return;

    setIsSubmitting(true);
    try {
      await onSubmit(email);
      setIsSuccess(true);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
        <div className="rounded-3xl p-6 max-w-md w-full border" style={{
          background: BRAND_COLORS.gradients.background,
          borderColor: BRAND_COLORS.borders.normal
        }}>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            
            <h3 className="text-white text-xl mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              Check Your Email
            </h3>
            
            <p className="text-cyan-200 mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              We've sent password reset instructions to {email}
            </p>
            
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-4 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/20 min-h-[56px]"
              data-name="btn_close_success"
            >
              <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Got It
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="rounded-3xl p-6 max-w-md w-full border" style={{
        background: BRAND_COLORS.gradients.background,
        borderColor: BRAND_COLORS.borders.normal
      }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
            Reset Password
          </h3>
          <button
            onClick={onClose}
            className="text-cyan-400 hover:text-cyan-300 transition-colors p-2"
            data-name="btn_close_modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-cyan-200 mb-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                data-name="input_reset_email"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white py-4 rounded-full transition-all min-h-[56px]"
              data-name="btn_cancel_reset"
            >
              <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                Cancel
              </span>
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-cyan-600 disabled:to-blue-600 text-white py-4 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/20 min-h-[56px] disabled:opacity-50"
              data-name="btn_send_reset"
            >
              <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}