import { ReactNode } from 'react';
import { MasterAppIcon } from './icons/MasterAppIcon';
import { BRAND_COLORS } from '../utils/brand-colors';

interface BrandHeaderProps {
  subtitle?: string;
  showPulse?: boolean;
  rightContent?: ReactNode;
  showBorder?: boolean;
}

export function BrandHeader({ 
  subtitle = "Decoding Psychological Power Dynamics", 
  showPulse = false,
  rightContent,
  showBorder = true
}: BrandHeaderProps) {
  return (
    <div style={{
      flexShrink: 0,
      padding: '4rem 1.5rem 1.5rem',
      borderBottom: showBorder ? `1px solid ${BRAND_COLORS.borders.normal}` : 'none',
      background: `linear-gradient(to bottom, ${BRAND_COLORS.navy}, transparent)`
    }}>
      <div className={`flex items-center ${rightContent ? 'justify-between' : 'justify-center'} mb-2`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MasterAppIcon size={40} />
            {showPulse && (
              <div 
                className="absolute inset-0 rounded-full blur-xl animate-pulse"
                style={{
                  background: `${BRAND_COLORS.cyan}26`  // Subtle glow
                }}
              />
            )}
          </div>
          <div className="text-left">
            <h1 style={{ 
              color: BRAND_COLORS.text.white,
              fontFamily: 'system-ui, -apple-system, sans-serif', 
              fontWeight: 600 
            }}>
              MaverickAI Enigma Radar™
            </h1>
          </div>
        </div>
        
        {rightContent}
      </div>
      
      {subtitle && (
        <p 
          className={`text-sm ${rightContent ? 'text-left' : 'text-center'} leading-relaxed`}
          style={{ 
            color: BRAND_COLORS.cyanText,
            fontFamily: 'system-ui, -apple-system, sans-serif' 
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
