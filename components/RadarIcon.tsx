interface RadarIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function RadarIcon({ size = 80, className = '', animated = true }: RadarIconProps) {
  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: size, height: size }}
    >
      {/* Outer glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full blur-xl" />
      
      {/* Outer ring - rotating */}
      {animated && (
        <div 
          className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
          style={{
            animation: 'spin 8s linear infinite'
          }}
        >
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}
      
      {/* Middle ring - pulsing */}
      <div 
        className={`absolute inset-3 rounded-full border-2 border-purple-400/40 ${animated ? 'animate-pulse' : ''}`}
        style={animated ? { animationDuration: '2s' } : {}}
      >
        <div className="absolute top-1/4 right-0 w-1 h-1 bg-purple-400 rounded-full transform translate-x-1/2" />
      </div>
      
      {/* Inner ring - static */}
      <div className="absolute inset-6 rounded-full border border-teal-400/50">
        <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-teal-400 rounded-full transform -translate-x-1/2 translate-y-1/2" />
      </div>
      
      {/* Center circle with gradient */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="relative rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-teal-500 shadow-lg shadow-cyan-500/50"
          style={{ width: size * 0.4, height: size * 0.4 }}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-full" />
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="bg-white rounded-full"
              style={{ width: size * 0.15, height: size * 0.15 }}
            />
          </div>
        </div>
      </div>
      
      {/* Scanning beam - rotating */}
      {animated && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0, 212, 255, 0.5) 30deg, transparent 60deg)',
            animation: 'spin 4s linear infinite',
            borderRadius: '50%'
          }}
        />
      )}
    </div>
  );
}
