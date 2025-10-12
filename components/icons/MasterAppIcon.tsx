// MaverickAI Enigma Radar™ - Master App Icon for PWA Builder
// GitHub-Compatible Version - No Figma asset dependencies
// Pure SVG with embedded radar symbol

interface MasterAppIconProps {
  size?: number;
}

export function MasterAppIcon({ size = 40 }: MasterAppIconProps) {
  // Calculate proportions based on size
  const viewBox = size;
  const center = size / 2;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient Background - MaverickAI Navy → Deep Blue → Navy */}
      <defs>
        <linearGradient id={`masterBgGradient-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14123F" />
          <stop offset="50%" stopColor="#342FA5" />
          <stop offset="100%" stopColor="#14123F" />
        </linearGradient>
        
        {/* Subtle purple glow for depth */}
        <radialGradient id={`masterPurpleGlow-${size}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
          <stop offset="50%" stopColor="#342FA5" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#14123F" stopOpacity={0} />
        </radialGradient>
        
        {/* Cyan accent glow */}
        <radialGradient id={`masterCyanGlow-${size}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.2} />
          <stop offset="50%" stopColor="#00d4ff" stopOpacity={0.1} />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
        </radialGradient>
        
        {/* Radar gradient */}
        <linearGradient id={`radarGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      
      {/* Background Gradient */}
      <rect width={size} height={size} rx={size * 0.15} fill={`url(#masterBgGradient-${size})`} />
      
      {/* Purple ambient glow for depth */}
      <ellipse
        cx={center}
        cy={center}
        rx={size * 0.6}
        ry={size * 0.5}
        fill={`url(#masterPurpleGlow-${size})`}
      />
      
      {/* Cyan glow around icon area */}
      <circle
        cx={center}
        cy={center}
        r={size * 0.35}
        fill={`url(#masterCyanGlow-${size})`}
      />
      
      {/* EMBEDDED RADAR ICON - Pure SVG (no external image) */}
      <g transform={`translate(${size * 0.15}, ${size * 0.15}) scale(${size * 0.7 / 512})`}>
        {/* Radar Rings */}
        <circle
          cx="256"
          cy="256"
          r="200"
          stroke={`url(#radarGradient-${size})`}
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        />
        <circle
          cx="256"
          cy="256"
          r="150"
          stroke={`url(#radarGradient-${size})`}
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
        <circle
          cx="256"
          cy="256"
          r="100"
          stroke={`url(#radarGradient-${size})`}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        
        {/* Center Dot */}
        <circle cx="256" cy="256" r="8" fill="#00d4ff" />
        
        {/* Radar Sweep (animated line) */}
        <line
          x1="256"
          y1="256"
          x2="256"
          y2="56"
          stroke="#00d4ff"
          strokeWidth="3"
          opacity="0.8"
        />
        
        {/* Power Symbol Points (3 dots around the radar) */}
        <circle cx="356" cy="256" r="6" fill="#8b5cf6" opacity="0.8" />
        <circle cx="206" cy="156" r="6" fill="#fbbf24" opacity="0.8" />
        <circle cx="306" cy="356" r="6" fill="#ec4899" opacity="0.8" />
        
        {/* Crosshairs */}
        <line
          x1="256"
          y1="56"
          x2="256"
          y2="96"
          stroke="#00d4ff"
          strokeWidth="2"
          opacity="0.6"
        />
        <line
          x1="256"
          y1="416"
          x2="256"
          y2="456"
          stroke="#00d4ff"
          strokeWidth="2"
          opacity="0.6"
        />
        <line
          x1="56"
          y1="256"
          x2="96"
          y2="256"
          stroke="#00d4ff"
          strokeWidth="2"
          opacity="0.6"
        />
        <line
          x1="416"
          y1="256"
          x2="456"
          y2="256"
          stroke="#00d4ff"
          strokeWidth="2"
          opacity="0.6"
        />
      </g>
      
      {/* Optional: Corner accent markers (strategic feel) */}
      {/* Top-left corner */}
      <path
        d={`M ${size * 0.08} ${size * 0.08} L ${size * 0.08} ${size * 0.15} M ${size * 0.08} ${size * 0.08} L ${size * 0.15} ${size * 0.08}`}
        stroke="#8b5cf6"
        strokeWidth={size * 0.006}
        opacity="0.3"
        strokeLinecap="round"
      />
      {/* Top-right corner */}
      <path
        d={`M ${size * 0.92} ${size * 0.08} L ${size * 0.92} ${size * 0.15} M ${size * 0.92} ${size * 0.08} L ${size * 0.85} ${size * 0.08}`}
        stroke="#8b5cf6"
        strokeWidth={size * 0.006}
        opacity="0.3"
        strokeLinecap="round"
      />
      {/* Bottom-left corner */}
      <path
        d={`M ${size * 0.08} ${size * 0.92} L ${size * 0.08} ${size * 0.85} M ${size * 0.08} ${size * 0.92} L ${size * 0.15} ${size * 0.92}`}
        stroke="#8b5cf6"
        strokeWidth={size * 0.006}
        opacity="0.3"
        strokeLinecap="round"
      />
      {/* Bottom-right corner */}
      <path
        d={`M ${size * 0.92} ${size * 0.92} L ${size * 0.92} ${size * 0.85} M ${size * 0.92} ${size * 0.92} L ${size * 0.85} ${size * 0.92}`}
        stroke="#8b5cf6"
        strokeWidth={size * 0.006}
        opacity="0.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Export as React component for easy rendering
export default MasterAppIcon;
