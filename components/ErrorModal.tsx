import { AlertCircle, X, RefreshCw, Home } from 'lucide-react';
import { BRAND_COLORS } from '../utils/brand-colors';

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export function ErrorModal({
  isOpen,
  title = "Something went wrong",
  message,
  onClose,
  onRetry,
  onGoHome
}: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        style={{ background: 'rgba(0, 0, 0, 0.6)' }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
        <div 
          className="w-full max-w-md rounded-3xl border shadow-2xl pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          style={{
            background: BRAND_COLORS.gradients.background,
            borderColor: 'rgba(255, 255, 255, 0.2)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors min-h-[48px] min-w-[48px]"
              style={{
                background: BRAND_COLORS.glass.normal
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = BRAND_COLORS.glass.strong}
              onMouseLeave={(e) => e.currentTarget.style.background = BRAND_COLORS.glass.normal}
              data-name="btn_close_error"
            >
              <X className="w-5 h-5" style={{ color: BRAND_COLORS.text.white }} />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 pb-8 pt-4">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center relative" style={{
              background: 'rgba(239, 68, 68, 0.2)'
            }}>
              <div className="absolute inset-0 rounded-full animate-ping" style={{
                background: 'rgba(239, 68, 68, 0.3)'
              }} />
              <AlertCircle className="w-8 h-8 relative z-10" style={{ color: '#f87171' }} />
            </div>

            {/* Title */}
            <h2 
              className="text-center text-xl mb-3" 
              style={{ 
                color: BRAND_COLORS.text.white,
                fontFamily: 'system-ui, -apple-system, sans-serif', 
                fontWeight: 700 
              }}
            >
              {title}
            </h2>

            {/* Message */}
            <p 
              className="text-center text-sm mb-8 leading-relaxed" 
              style={{ 
                color: BRAND_COLORS.text.whiteSubtle,
                fontFamily: 'system-ui, -apple-system, sans-serif' 
              }}
            >
              {message}
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Retry Button */}
              {onRetry && (
                <button
                  onClick={() => {
                    onClose();
                    onRetry();
                  }}
                  className="w-full py-5 rounded-full transition-all duration-300 shadow-2xl min-h-[60px] flex items-center justify-center gap-2 active:scale-98 relative overflow-hidden group"
                  style={{
                    background: BRAND_COLORS.gradients.cyan,
                    color: BRAND_COLORS.text.white,
                    boxShadow: `0 20px 60px ${BRAND_COLORS.cyan}4D`
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 25px 80px ${BRAND_COLORS.cyan}66`}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 20px 60px ${BRAND_COLORS.cyan}4D`}
                  data-name="btn_retry_error"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>
                    Try Again
                  </span>
                </button>
              )}

              {/* Go Home Button */}
              {onGoHome && (
                <button
                  onClick={() => {
                    onClose();
                    onGoHome();
                  }}
                  className="w-full py-4 rounded-full transition-all duration-200 min-h-[56px] flex items-center justify-center gap-2"
                  style={{
                    background: BRAND_COLORS.glass.normal,
                    color: BRAND_COLORS.text.white,
                    border: `1px solid ${BRAND_COLORS.borders.normal}`
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = BRAND_COLORS.glass.strong}
                  onMouseLeave={(e) => e.currentTarget.style.background = BRAND_COLORS.glass.normal}
                  data-name="btn_home_error"
                >
                  <Home className="w-5 h-5" />
                  <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Go Home
                  </span>
                </button>
              )}

              {/* Dismiss Button - only show if no other actions */}
              {!onRetry && !onGoHome && (
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-full transition-all duration-200 min-h-[56px]"
                  style={{
                    background: BRAND_COLORS.glass.normal,
                    color: BRAND_COLORS.text.white,
                    border: `1px solid ${BRAND_COLORS.borders.normal}`
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = BRAND_COLORS.glass.strong}
                  onMouseLeave={(e) => e.currentTarget.style.background = BRAND_COLORS.glass.normal}
                  data-name="btn_dismiss_error"
                >
                  <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Dismiss
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
