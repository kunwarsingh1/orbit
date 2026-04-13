const DataLines = () => {
  const lines = [
    { id: 1, d: "M 0,200 Q 200,180 400,300", delay: 0 },
    { id: 2, d: "M 0,350 Q 250,300 400,300", delay: 0.5 },
    { id: 3, d: "M 800,150 Q 600,200 400,300", delay: 0.3 },
    { id: 4, d: "M 800,400 Q 600,350 400,300", delay: 0.8 },
    { id: 5, d: "M 400,0 Q 380,150 400,300", delay: 0.6 },
    { id: 6, d: "M 400,600 Q 420,450 400,300", delay: 1.0 },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--glow-primary) / 0)" />
          <stop offset="50%" stopColor="hsl(var(--glow-primary) / 0.6)" />
          <stop offset="100%" stopColor="hsl(var(--glow-primary) / 0)" />
        </linearGradient>
        <filter id="lineGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {lines.map((line) => (
        <g key={line.id}>
          <path
            d={line.d}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="1"
            filter="url(#lineGlow)"
            strokeDasharray="8 12"
            style={{
              animation: `data-flow 3s linear ${line.delay}s infinite`,
            }}
          />
          {/* Moving dot */}
          <circle r="3" fill="hsl(var(--glow-primary))" filter="url(#lineGlow)">
            <animateMotion
              dur={`${2 + line.delay}s`}
              repeatCount="indefinite"
              begin={`${line.delay}s`}
              path={line.d}
            />
          </circle>
        </g>
      ))}
    </svg>
  );
};

export default DataLines;
