import { ReactNode } from 'react';
import { MasterAppIcon } from './icons/MasterAppIcon';

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
    <div className={`flex-shrink-0 p-6 pt-16 ${showBorder ? 'border-b border-white/10' : ''} bg-gradient-to-b from-[#14123F] to-transparent`}>
      <div className={`flex items-center ${rightContent ? 'justify-between' : 'justify-center'} mb-2`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MasterAppIcon size={40} />
            {showPulse && (
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
            )}
          </div>
          <div className="text-left">
            <h1 className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              MaverickAI Enigma Radar™
            </h1>
          </div>
        </div>
        
        {rightContent}
      </div>
      
      {subtitle && (
        <p className={`text-sm text-cyan-400 ${rightContent ? 'text-left' : 'text-center'} leading-relaxed`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
