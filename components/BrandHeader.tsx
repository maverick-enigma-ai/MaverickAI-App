import React, { ReactNode } from 'react';
import { MasterAppIcon } from 'components/icons/MasterAppIcon.tsx';
import { BRAND_COLORS } from '../utils/brand-colors';
import { ChevronLeft } from 'lucide-react'; // ⬅️ tiny icon package (already included in your stack)

export interface BrandHeaderProps {
  title: string;
  subtitle?: string;
  showPulse?: boolean;
  rightContent?: ReactNode;
  showBorder?: boolean;
  onBack?: () => void;
}

export function BrandHeader({
  title,
  subtitle = "Decoding Psychological Power Dynamics",
  showPulse = false,
  rightContent,
  showBorder = true,
  onBack,
}: BrandHeaderProps) {
  return (
    <div
      style={{
        flexShrink: 0,
        padding: '1rem 1.5rem',
        borderBottom: showBorder ? `1px solid ${BRAND_COLORS.borders.normal}` : 'none',
        background: `linear-gradient(to bottom, ${BRAND_COLORS.navy}, transparent)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* LEFT SECTION */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* ⬅️ Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              color: BRAND_COLORS.text.light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Go Back"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
        )}

        {/* Title + Subtitle */}
        <div>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', color: BRAND_COLORS.text.light }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SECTION (optional) */}
      <div>{rightContent}</div>
    </div>
  );
}
