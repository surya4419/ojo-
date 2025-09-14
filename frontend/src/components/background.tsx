import React from 'react';

const BackgroundParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 neural-bg">
        {/* Matrix rain effect */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`matrix-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-pulse-slow"
            style={{
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Neural network connections */}
        <svg className="absolute inset-0 w-full h-full opacity-15">
          <defs>
            <pattern id="neural-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M0 40h80M40 0v80"
                stroke="#00CFFF"
                strokeWidth="0.3"
                fill="none"
                opacity="0.4"
              />
              <circle cx="40" cy="40" r="1.5" fill="#00CFFF" opacity="0.6" />
              <circle cx="0" cy="40" r="1" fill="#00CFFF" opacity="0.4" />
              <circle cx="80" cy="40" r="1" fill="#00CFFF" opacity="0.4" />
              <circle cx="40" cy="0" r="1" fill="#00CFFF" opacity="0.4" />
              <circle cx="40" cy="80" r="1" fill="#00CFFF" opacity="0.4" />
            </pattern>
            <linearGradient id="neuralGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#00CFFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00CFFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
          
          {/* Dynamic neural paths */}
          {Array.from({ length: 8 }).map((_, i) => {
            const x1 = Math.random() * 100;
            const y1 = Math.random() * 100;
            const x2 = Math.random() * 100;
            const y2 = Math.random() * 100;
            return (
              <line
                key={`neural-${i}`}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="url(#neuralGlow)"
                strokeWidth="0.5"
                opacity="0.3"
              />
            );
          })}
        </svg>

        {/* Glitch particles */}
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={`glitch-${i}`}
            className="absolute bg-primary/20 animate-pulse-slow"
            style={{
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Terminal-like scan lines */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`scan-${i}`}
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse-slow"
              style={{
                top: `${i * 5}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Data streams */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`stream-${i}`}
            className="absolute w-px h-8 bg-gradient-to-b from-primary/40 to-transparent animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Cyber hexagons */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          {Array.from({ length: 15 }).map((_, i) => {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 20 + 10;
            return (
              <polygon
                key={`hex-${i}`}
                points={`${x},${y-size} ${x+size*0.866},${y-size*0.5} ${x+size*0.866},${y+size*0.5} ${x},${y+size} ${x-size*0.866},${y+size*0.5} ${x-size*0.866},${y-size*0.5}`}
                fill="none"
                stroke="#00CFFF"
                strokeWidth="0.5"
                opacity="0.3"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default BackgroundParticles;