import { useState } from 'react';
import { Send } from 'lucide-react';
import { BRAND_COLORS } from '../utils/brand-colors';

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
      className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 min-h-[48px] min-w-[48px] btn-press-strong overflow-hidden"
      style={{
        background: isSubmitting 
          ? `linear-gradient(to right, ${BRAND_COLORS.cyan}, ${BRAND_COLORS.deepBlue})`
          : `linear-gradient(to right, ${BRAND_COLORS.cyan}, ${BRAND_COLORS.teal})`,
        boxShadow: `0 10px 30px ${BRAND_COLORS.cyan}40`,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      data-name="btn_radar_submit"
    >
      {/* Radar Animation Rings */}
      {isSubmitting && (
        <>
          <div 
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              border: `2px solid ${BRAND_COLORS.cyan}66`  // 40% opacity
            }}
          />
          <div 
            className="absolute inset-2 rounded-full animate-ping"
            style={{
              border: `2px solid ${BRAND_COLORS.cyan}4D`,  // 30% opacity
              animationDelay: '0.5s'
            }}
          />
          <div 
            className="absolute inset-4 rounded-full animate-ping"
            style={{
              border: `2px solid ${BRAND_COLORS.cyan}33`,  // 20% opacity
              animationDelay: '1s'
            }}
          />
        </>
      )}
      
      {/* Radar Sweep */}
      {isSubmitting && (
        <div className="absolute inset-2 rounded-full overflow-hidden">
          <div className="absolute inset-0 w-1/2 h-full animate-spin origin-center" style={{
            background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent)'
          }} />
        </div>
      )}

      {/* Submit Icon */}
      <div className={`relative z-10 transition-all duration-300 ${isSubmitting ? 'scale-90' : ''}`}>
        {isSubmitting ? (
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid white',
            borderTopColor: 'transparent'
          }} className="animate-spin" />
        ) : (
          <Send className="w-6 h-6" style={{ color: 'white' }} />
        )}
      </div>

      {/* Pulse Effect on Hover */}
      {!isSubmitting && !disabled && (
        <div 
          className="absolute inset-0 rounded-full opacity-0 hover:opacity-20 transition-opacity duration-300"
          style={{
            background: `linear-gradient(to right, ${BRAND_COLORS.cyan}, ${BRAND_COLORS.teal})`
          }}
        />
      )}
    </button>
  );
}
