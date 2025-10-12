import { useState } from 'react';
import { Send } from 'lucide-react';

interface RadarSubmitButtonProps {
  isSubmitting: boolean;
  onSubmit: () => void;
  disabled?: boolean;
}

export function RadarSubmitButton({ isSubmitting, onSubmit, disabled = false }: RadarSubmitButtonProps) {
  return (
    <button
      onClick={onSubmit}
      disabled={disabled || isSubmitting}
      className={`
        relative w-16 h-16 rounded-full flex items-center justify-center
        transition-all duration-300 min-h-[48px] min-w-[48px] btn-press-strong
        ${isSubmitting 
          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/30' 
          : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25 btn-hover-lift'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        overflow-hidden
      `}
      data-name="btn_radar_submit"
    >
      {/* Radar Animation Rings */}
      {isSubmitting && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-cyan-400/30 animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute inset-4 rounded-full border-2 border-cyan-400/20 animate-ping" style={{ animationDelay: '1s' }} />
        </>
      )}
      
      {/* Radar Sweep */}
      {isSubmitting && (
        <div className="absolute inset-2 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 h-full animate-spin origin-center" />
        </div>
      )}

      {/* Submit Icon */}
      <div className={`relative z-10 transition-all duration-300 ${isSubmitting ? 'scale-90' : ''}`}>
        {isSubmitting ? (
          <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
        ) : (
          <Send className="w-6 h-6 text-white" />
        )}
      </div>

      {/* Pulse Effect on Hover */}
      {!isSubmitting && !disabled && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 hover:opacity-20 transition-opacity duration-300" />
      )}
    </button>
  );
}