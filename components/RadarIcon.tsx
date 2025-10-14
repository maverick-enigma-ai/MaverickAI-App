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
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom right, rgba(0, 212, 255, 0.2), rgba(139, 92, 246, 0.2))',
        borderRadius: '50%',
        filter: 'blur(20px)'
      }} />
      
      {/* Outer ring - rotating */}
      {animated && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(0, 212, 255, 0.3)',
            animation: 'spin 8s linear infinite'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '4px',
            height: '4px',
            background: '#00d4ff',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)'
          }} />
        </div>
      )}
      
      {/* Middle ring - pulsing */}
      <div 
        style={{
          position: 'absolute',
          inset: size * 0.15,
          borderRadius: '50%',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          animation: animated ? 'pulse 2s ease-in-out infinite' : 'none'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '25%',
          right: 0,
          width: '4px',
          height: '4px',
          background: '#8b5cf6',
          borderRadius: '50%',
          transform: 'translateX(50%)'
        }} />
      </div>
      
      {/* Inner ring - static */}
      <div style={{
        position: 'absolute',
        inset: size * 0.3,
        borderRadius: '50%',
        border: '1px solid rgba(20, 184, 166, 0.5)'
      }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          width: '4px',
          height: '4px',
          background: '#14b8a6',
          borderRadius: '50%',
          transform: 'translate(-50%, 50%)'
        }} />
      </div>
      
      {/* Center circle with gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div 
          style={{
            position: 'relative',
            width: size * 0.4,
            height: size * 0.4,
            borderRadius: '50%',
            background: 'linear-gradient(to bottom right, #00d4ff, #8b5cf6, #14b8a6)',
            boxShadow: '0 10px 30px rgba(0, 212, 255, 0.5)'
          }}
        >
          {/* Inner glow */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.4), transparent)',
            borderRadius: '50%'
          }} />
          
          {/* Center dot */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div 
              style={{
                width: size * 0.15,
                height: size * 0.15,
                background: 'white',
                borderRadius: '50%'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Scanning beam - rotating */}
      {animated && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.3,
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0, 212, 255, 0.5) 30deg, transparent 60deg)',
            animation: 'spin 4s linear infinite',
            borderRadius: '50%'
          }}
        />
      )}
    </div>
  );
}
