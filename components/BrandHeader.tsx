import { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { MasterAppIcon } from './icons/MasterAppIcon';
import { BRAND_COLORS, BRAND_STYLES } from '../utils/brand-colors';

interface BrandHeaderProps {
  /** Title is optional for backward compatibility with older screens */
  title?: string;
  subtitle?: string;
  showPulse?: boolean;
  rightContent?: ReactNode;
  showBorder?: boolean;
  onBack?: () => void;
}

export function BrandHeader({
  title = 'MaverickAI Enigma Radar™', // ← default keeps Figma/legacy screens working
  subtitle = 'Decoding Psychological Power Dynamics',
  showPulse = false,
  rightContent,
  showBorder = true,
  onBack,
}: BrandHeaderProps) {
  return (
    <div
      style={{
        flexShrink: 0,
        // Figma/legacy spacing vibe
        padding: '4rem 1.5rem 1.5rem',
        borderBottom: showBorder ? `1px solid ${BRAND_COLORS.borders.normal}` : 'none',
        background: `linear-gradient(to bottom, ${BRAND_COLORS.navy}, transparent)`,
      }}
    >
      <div
        className={`flex items-center ${
          rightContent || onBack ? 'justify-between' : 'justify-center'
        } mb-2`}
      >
        <div className="flex items-center gap-3">
          {/* Optional back button (from current API) */}
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl"
              style={{
                background: BRAND_COLORS.glass.normal,
                border: `1px solid ${BRAND_COLORS.borders.normal}`,
              }}
              aria-label="Back"
            >
              <ChevronLeft size={18} color={BRAND_COLORS.cyan} />
            </button>
          )}

          {/* Figma/legacy visual: app icon + optional cyan pulse */}
          <div style={{ position: 'relative' }}>
            <MasterAppIcon size={40} />
            {showPulse && (
              <div
                className="absolute inset-0 rounded-full blur-xl animate-pulse"
                style={{ background: `${BRAND_COLORS.cyan}26` }} // subtle cyan glow
                aria-hidden
              />
            )}
          </div>

          {/* Title (prop or default) */}
          <div className="text-left">
            <h1
              style={{
                color: BRAND_COLORS.text.white,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: 600,
              }}
            >
              {title}
            </h1>
          </div>
        </div>

        {rightContent}
      </div>

      {/* Subtitle in Figma cyan tone if provided */}
      {subtitle && (
        <p
          className={`text-sm ${rightContent || onBack ? 'text-left' : 'text-center'} leading-relaxed`}
          style={{
            color: BRAND_COLORS.cyanText, // Figma/legacy cyan subtitle
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
