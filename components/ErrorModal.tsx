import { AlertCircle, X, RefreshCw, Home } from 'lucide-react';

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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
        <div 
          className="w-full max-w-md bg-gradient-to-br from-[#14123F] via-[#342FA5] to-[#14123F] rounded-3xl border border-white/20 shadow-2xl pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors min-h-[48px] min-w-[48px]"
              data-name="btn_close_error"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 pb-8 pt-4">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping" />
              <AlertCircle className="w-8 h-8 text-red-400 relative z-10" />
            </div>

            {/* Title */}
            <h2 
              className="text-white text-center text-xl mb-3" 
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}
            >
              {title}
            </h2>

            {/* Message */}
            <p 
              className="text-white/80 text-center text-sm mb-8 leading-relaxed" 
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              {message}
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Retry Button - Award-winning */}
              {onRetry && (
                <button
                  onClick={() => {
                    onClose();
                    onRetry();
                  }}
                  className="w-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:via-cyan-400 hover:to-blue-400 text-white py-5 rounded-full transition-all duration-300 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/60 min-h-[60px] flex items-center justify-center gap-2 active:scale-98 relative overflow-hidden group"
                  data-name="btn_retry_action"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <RefreshCw className="w-5 h-5 relative z-10" />
                  <span className="relative z-10" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>
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
                  className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white py-4 rounded-full transition-all duration-300 border border-white/20 min-h-[56px] flex items-center justify-center gap-2 active:scale-98"
                  data-name="btn_go_home"
                >
                  <Home className="w-5 h-5" />
                  <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
                    Go to Home
                  </span>
                </button>
              )}

              {/* Dismiss Button (if no actions provided) - Award-winning */}
              {!onRetry && !onGoHome && (
                <button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:via-cyan-400 hover:to-blue-400 text-white py-5 rounded-full transition-all duration-300 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/60 min-h-[60px] active:scale-98 relative overflow-hidden group"
                  data-name="btn_dismiss_error"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <span className="relative z-10" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 700 }}>
                    Okay
                  </span>
                </button>
              )}
            </div>

            {/* Helper Text */}
            <p 
              className="text-white/40 text-center text-xs mt-6" 
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              If this persists, contact support
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
