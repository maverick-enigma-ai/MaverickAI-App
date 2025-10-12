// MaverickAI Enigma Radar™ - App Icon Design
// Premium psychological intelligence radar symbol

interface RadarLogoIconProps {
  size?: number;
  showText?: boolean;
}

export function RadarLogoIcon({ size = 512, showText = false }: RadarLogoIconProps) {
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = size * 0.35; // 35% of size for outer ring
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: 'transparent' }}
    >
      {/* Background Gradient */}
      <defs>
        {/* Main gradient - MaverickAI Navy to Deep Blue */}
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#14123F', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#342FA5', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#14123F', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Cyan glow gradient */}
        <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: '#00d4ff', stopOpacity: 0.6 }} />
          <stop offset="50%" style={{ stopColor: '#00d4ff', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: '#00d4ff', stopOpacity: 0 }} />
        </radialGradient>
        
        {/* Teal accent gradient */}
        <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#14b8a6', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: '#00d4ff', stopOpacity: 0.8 }} />
        </linearGradient>
        
        {/* Purple accent for depth */}
        <radialGradient id="purpleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.2 }} />
          <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0 }} />
        </radialGradient>
        
        {/* Blur filters for glow effects */}
        <filter id="softGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="1 1" />
          </feComponentTransfer>
        </filter>
        
        <filter id="strongGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="1 1" />
          </feComponentTransfer>
        </filter>
      </defs>
      
      {/* Background */}
      <rect width={size} height={size} fill="url(#bgGradient)" />
      
      {/* Purple ambient glow (adds depth) */}
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius * 1.2}
        fill="url(#purpleGlow)"
        opacity="0.4"
      />
      
      {/* Cyan central glow */}
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius * 0.8}
        fill="url(#cyanGlow)"
        filter="url(#strongGlow)"
      />
      
      {/* Radar Rings - from outer to inner */}
      
      {/* Outer ring - faint */}
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius}
        fill="none"
        stroke="#00d4ff"
        strokeWidth={size * 0.008}
        opacity="0.25"
        filter="url(#softGlow)"
      />
      
      {/* Second ring */}
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius * 0.75}
        fill="none"
        stroke="#00d4ff"
        strokeWidth={size * 0.01}
        opacity="0.4"
        filter="url(#softGlow)"
      />
      
      {/* Third ring */}
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius * 0.5}
        fill="none"
        stroke="#14b8a6"
        strokeWidth={size * 0.012}
        opacity="0.6"
      />
      
      {/* Inner ring - bright */}
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius * 0.25}
        fill="none"
        stroke="#00d4ff"
        strokeWidth={size * 0.015}
        opacity="0.9"
      />
      
      {/* Radar scan line (animated feel, pointing to 2 o'clock) */}
      <line
        x1={centerX}
        y1={centerY}
        x2={centerX + maxRadius * Math.cos(-Math.PI / 6)}
        y2={centerY + maxRadius * Math.sin(-Math.PI / 6)}
        stroke="url(#tealGradient)"
        strokeWidth={size * 0.006}
        opacity="0.8"
        strokeLinecap="round"
        filter="url(#softGlow)"
      />
      
      {/* Secondary scan line (pointing to 7 o'clock) for depth */}
      <line
        x1={centerX}
        y1={centerY}
        x2={centerX + maxRadius * 0.7 * Math.cos(Math.PI * 5 / 6)}
        y2={centerY + maxRadius * 0.7 * Math.sin(Math.PI * 5 / 6)}
        stroke="#14b8a6"
        strokeWidth={size * 0.004}
        opacity="0.5"
        strokeLinecap="round"
      />
      
      {/* Center point - glowing */}
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius * 0.08}
        fill="#00d4ff"
        filter="url(#strongGlow)"
      />
      
      {/* Center point - solid core */}
      <circle
        cx={centerX}
        cy={centerY}
        r={maxRadius * 0.05}
        fill="#ffffff"
      />
      
      {/* Crosshairs - for precision targeting feel */}
      <line
        x1={centerX - maxRadius * 0.15}
        y1={centerY}
        x2={centerX - maxRadius * 0.35}
        y2={centerY}
        stroke="#00d4ff"
        strokeWidth={size * 0.004}
        opacity="0.6"
        strokeLinecap="round"
      />
      <line
        x1={centerX + maxRadius * 0.15}
        y1={centerY}
        x2={centerX + maxRadius * 0.35}
        y2={centerY}
        stroke="#00d4ff"
        strokeWidth={size * 0.004}
        opacity="0.6"
        strokeLinecap="round"
      />
      <line
        x1={centerX}
        y1={centerY - maxRadius * 0.15}
        x2={centerX}
        y2={centerY - maxRadius * 0.35}
        stroke="#00d4ff"
        strokeWidth={size * 0.004}
        opacity="0.6"
        strokeLinecap="round"
      />
      <line
        x1={centerX}
        y1={centerY + maxRadius * 0.15}
        x2={centerX}
        y2={centerY + maxRadius * 0.35}
        stroke="#00d4ff"
        strokeWidth={size * 0.004}
        opacity="0.6"
        strokeLinecap="round"
      />
      
      {/* Corner accent markers (strategic analysis feel) */}
      {/* Top-left */}
      <path
        d={`M ${size * 0.15} ${size * 0.15} L ${size * 0.15} ${size * 0.2} M ${size * 0.15} ${size * 0.15} L ${size * 0.2} ${size * 0.15}`}
        stroke="#8b5cf6"
        strokeWidth={size * 0.006}
        opacity="0.4"
        strokeLinecap="round"
      />
      {/* Top-right */}
      <path
        d={`M ${size * 0.85} ${size * 0.15} L ${size * 0.85} ${size * 0.2} M ${size * 0.85} ${size * 0.15} L ${size * 0.8} ${size * 0.15}`}
        stroke="#8b5cf6"
        strokeWidth={size * 0.006}
        opacity="0.4"
        strokeLinecap="round"
      />
      {/* Bottom-left */}
      <path
        d={`M ${size * 0.15} ${size * 0.85} L ${size * 0.15} ${size * 0.8} M ${size * 0.15} ${size * 0.85} L ${size * 0.2} ${size * 0.85}`}
        stroke="#8b5cf6"
        strokeWidth={size * 0.006}
        opacity="0.4"
        strokeLinecap="round"
      />
      {/* Bottom-right */}
      <path
        d={`M ${size * 0.85} ${size * 0.85} L ${size * 0.85} ${size * 0.8} M ${size * 0.85} ${size * 0.85} L ${size * 0.8} ${size * 0.85}`}
        stroke="#8b5cf6"
        strokeWidth={size * 0.006}
        opacity="0.4"
        strokeLinecap="round"
      />
      
      {/* Optional text */}
      {showText && (
        <g>
          {/* "ENIGMA" text below radar */}
          <text
            x={centerX}
            y={centerY + maxRadius * 1.5}
            fontSize={size * 0.08}
            fill="#00d4ff"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="600"
            letterSpacing="0.1em"
          >
            ENIGMA
          </text>
          {/* "RADAR" text below */}
          <text
            x={centerX}
            y={centerY + maxRadius * 1.7}
            fontSize={size * 0.055}
            fill="#14b8a6"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="400"
            letterSpacing="0.15em"
            opacity="0.8"
          >
            RADAR
          </text>
        </g>
      )}
    </svg>
  );
}
