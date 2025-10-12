// MaverickAI Enigma Radar™ - Splash Screen Component
// For iOS launch screens

import { RadarLogoIcon } from './RadarLogoIcon';

interface SplashScreenProps {
  width: number;
  height: number;
  showBranding?: boolean;
}

export function SplashScreen({ width, height, showBranding = true }: SplashScreenProps) {
  const iconSize = Math.min(width, height) * 0.35; // 35% of smaller dimension
  const centerX = width / 2;
  const centerY = height / 2;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient Background */}
      <defs>
        <linearGradient id="splashGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#14123F', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#342FA5', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#14123F', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Ambient glow */}
        <radialGradient id="ambientGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.2 }} />
          <stop offset="50%" style={{ stopColor: '#342FA5', stopOpacity: 0.1 }} />
          <stop offset="100%" style={{ stopColor: '#14123F', stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      
      {/* Background */}
      <rect width={width} height={height} fill="url(#splashGradient)" />
      
      {/* Ambient glow centered on icon */}
      <ellipse
        cx={centerX}
        cy={centerY - iconSize * 0.1}
        rx={width * 0.6}
        ry={height * 0.4}
        fill="url(#ambientGlow)"
      />
      
      {/* Radar Icon - centered, slightly above middle */}
      <g transform={`translate(${centerX - iconSize / 2}, ${centerY - iconSize / 2 - iconSize * 0.15})`}>
        <RadarLogoIcon size={iconSize} showText={false} />
      </g>
      
      {/* Branding Text */}
      {showBranding && (
        <g>
          {/* MaverickAI */}
          <text
            x={centerX}
            y={centerY + iconSize * 0.6}
            fontSize={width * 0.045}
            fill="#00d4ff"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="600"
            letterSpacing="0.08em"
          >
            MAVERICKĀI
          </text>
          
          {/* Enigma Radar™ */}
          <text
            x={centerX}
            y={centerY + iconSize * 0.75}
            fontSize={width * 0.055}
            fill="#ffffff"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="500"
            letterSpacing="0.12em"
          >
            ENIGMA RADAR
          </text>
          
          {/* Trademark */}
          <text
            x={centerX + width * 0.18}
            y={centerY + iconSize * 0.72}
            fontSize={width * 0.02}
            fill="#14b8a6"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="400"
            opacity="0.8"
          >
            ™
          </text>
          
          {/* Tagline */}
          <text
            x={centerX}
            y={centerY + iconSize * 0.95}
            fontSize={width * 0.03}
            fill="#14b8a6"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="400"
            letterSpacing="0.15em"
            opacity="0.7"
          >
            DECODE PSYCHOLOGICAL POWER DYNAMICS
          </text>
        </g>
      )}
    </svg>
  );
}

// Pre-configured splash screens for different iPhone sizes
export function IPhoneXSplash() {
  return <SplashScreen width={1125} height={2436} />;
}

export function IPhoneXRSplash() {
  return <SplashScreen width={828} height={1792} />;
}

export function IPhoneXSMaxSplash() {
  return <SplashScreen width={1242} height={2688} />;
}

export function IPhone12ProSplash() {
  return <SplashScreen width={1170} height={2532} />;
}

export function IPhone12ProMaxSplash() {
  return <SplashScreen width={1284} height={2778} />;
}
