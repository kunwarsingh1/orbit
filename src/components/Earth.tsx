import { useState } from "react";

const Earth = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Outer glow */}
      <div
        className="absolute rounded-full transition-all duration-700"
        style={{
          width: "min(420px, 70vw)",
          height: "min(420px, 70vw)",
          background: `radial-gradient(circle, hsl(var(--glow-primary) / ${hovered ? 0.35 : 0.15}) 0%, hsl(var(--glow-primary) / ${hovered ? 0.12 : 0.05}) 40%, transparent 70%)`,
          animation: "pulse-glow 4s ease-in-out infinite",
        }}
      />

      {/* Earth circle */}
      <div
        className="relative rounded-full overflow-hidden transition-shadow duration-500"
        style={{
          width: "min(300px, 55vw)",
          height: "min(300px, 55vw)",
          boxShadow: hovered
            ? "0 0 40px hsl(var(--glow-primary) / 0.6), 0 0 80px hsl(var(--glow-primary) / 0.3), inset 0 0 30px hsl(var(--glow-primary) / 0.2)"
            : "0 0 20px hsl(var(--glow-primary) / 0.3), 0 0 60px hsl(var(--glow-primary) / 0.1), inset 0 0 20px hsl(var(--glow-primary) / 0.1)",
        }}
      >
        {/* SVG world map - more realistic */}
        <svg
          viewBox="0 0 300 300"
          className="absolute inset-0 w-full h-full"
          style={{ animation: "earth-rotate 40s linear infinite" }}
        >
          <defs>
            <clipPath id="earthClip">
              <circle cx="150" cy="150" r="150" />
            </clipPath>
            <radialGradient id="earthShading" cx="35%" cy="35%">
              <stop offset="0%" stopColor="hsl(200 60% 70% / 0.08)" />
              <stop offset="50%" stopColor="transparent" />
              <stop offset="85%" stopColor="hsl(230 40% 3% / 0.5)" />
              <stop offset="100%" stopColor="hsl(230 40% 3% / 0.85)" />
            </radialGradient>
            <radialGradient id="oceanGrad" cx="40%" cy="40%">
              <stop offset="0%" stopColor="hsl(215 50% 14%)" />
              <stop offset="100%" stopColor="hsl(220 40% 8%)" />
            </radialGradient>
            <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(160 50% 28%)" />
              <stop offset="100%" stopColor="hsl(140 40% 22%)" />
            </linearGradient>
          </defs>
          <g clipPath="url(#earthClip)">
            {/* Ocean */}
            <rect x="-400" y="0" width="1200" height="300" fill="url(#oceanGrad)" />

            {/* More realistic continents - duplicated for seamless rotation */}
            <g fill="url(#landGrad)" stroke="hsl(160 40% 35% / 0.6)" strokeWidth="0.5">
              {/* North America */}
              <path d="M55,52 L62,45 L70,42 L82,40 L95,38 L105,42 L115,48 L120,55 L122,65 L118,75 L112,82 L108,90 L100,98 L95,108 L88,115 L82,118 L78,112 L72,105 L68,95 L60,88 L55,78 L52,68 L53,58 Z" />
              {/* Central America */}
              <path d="M82,118 L86,122 L90,128 L88,135 L84,138 L80,132 L78,125 Z" />
              {/* South America */}
              <path d="M95,140 L105,136 L112,140 L118,150 L122,162 L124,175 L120,192 L115,205 L108,218 L100,225 L95,220 L90,210 L88,195 L86,178 L88,165 L90,152 Z" />
              {/* Europe */}
              <path d="M168,48 L175,42 L185,40 L195,42 L202,48 L205,55 L200,62 L195,68 L188,72 L180,70 L174,65 L170,58 Z" />
              {/* British Isles */}
              <path d="M162,48 L166,44 L168,50 L165,54 Z" />
              {/* Scandinavia */}
              <path d="M182,30 L188,25 L192,30 L195,38 L190,42 L185,40 L182,35 Z" />
              {/* Africa */}
              <path d="M175,78 L185,74 L195,76 L205,80 L212,88 L218,100 L222,115 L224,130 L222,148 L218,162 L210,175 L200,182 L190,178 L182,170 L176,158 L172,142 L170,125 L172,108 L174,95 L175,85 Z" />
              {/* Madagascar */}
              <path d="M225,155 L228,150 L230,158 L228,165 L225,162 Z" />
              {/* Asia */}
              <path d="M210,38 L225,32 L240,28 L258,30 L272,35 L285,42 L295,50 L300,60 L298,72 L290,80 L280,85 L270,82 L262,78 L255,85 L248,90 L240,88 L232,82 L225,75 L218,68 L212,60 L210,50 Z" />
              {/* India */}
              <path d="M248,90 L255,85 L262,92 L265,102 L262,115 L255,122 L248,118 L245,108 L246,98 Z" />
              {/* Southeast Asia */}
              <path d="M272,85 L280,82 L285,90 L282,100 L275,105 L270,98 Z" />
              {/* Japan */}
              <path d="M292,52 L296,48 L298,55 L296,62 L292,58 Z" />
              {/* Australia */}
              <path d="M272,155 L285,148 L298,150 L308,158 L312,168 L308,180 L298,185 L285,182 L275,175 L270,165 Z" />
              {/* New Zealand */}
              <path d="M315,185 L318,180 L320,188 L317,192 Z" />

              {/* Duplicate set offset by 400 for seamless rotation */}
              <path d="M455,52 L462,45 L470,42 L482,40 L495,38 L505,42 L515,48 L520,55 L522,65 L518,75 L512,82 L508,90 L500,98 L495,108 L488,115 L482,118 L478,112 L472,105 L468,95 L460,88 L455,78 L452,68 L453,58 Z" />
              <path d="M482,118 L486,122 L490,128 L488,135 L484,138 L480,132 L478,125 Z" />
              <path d="M495,140 L505,136 L512,140 L518,150 L522,162 L524,175 L520,192 L515,205 L508,218 L500,225 L495,220 L490,210 L488,195 L486,178 L488,165 L490,152 Z" />
              <path d="M568,48 L575,42 L585,40 L595,42 L602,48 L605,55 L600,62 L595,68 L588,72 L580,70 L574,65 L570,58 Z" />
              <path d="M562,48 L566,44 L568,50 L565,54 Z" />
              <path d="M582,30 L588,25 L592,30 L595,38 L590,42 L585,40 L582,35 Z" />
              <path d="M575,78 L585,74 L595,76 L605,80 L612,88 L618,100 L622,115 L624,130 L622,148 L618,162 L610,175 L600,182 L590,178 L582,170 L576,158 L572,142 L570,125 L572,108 L574,95 L575,85 Z" />
              <path d="M625,155 L628,150 L630,158 L628,165 L625,162 Z" />
              <path d="M610,38 L625,32 L640,28 L658,30 L672,35 L685,42 L695,50 L700,60 L698,72 L690,80 L680,85 L670,82 L662,78 L655,85 L648,90 L640,88 L632,82 L625,75 L618,68 L612,60 L610,50 Z" />
              <path d="M648,90 L655,85 L662,92 L665,102 L662,115 L655,122 L648,118 L645,108 L646,98 Z" />
              <path d="M672,85 L680,82 L685,90 L682,100 L675,105 L670,98 Z" />
              <path d="M692,52 L696,48 L698,55 L696,62 L692,58 Z" />
              <path d="M672,155 L685,148 L698,150 L708,158 L712,168 L708,180 L698,185 L685,182 L675,175 L670,165 Z" />
              <path d="M715,185 L718,180 L720,188 L717,192 Z" />
            </g>

            {/* Grid lines - longitude/latitude */}
            <g stroke="hsl(var(--primary) / 0.06)" strokeWidth="0.4" fill="none">
              {/* Latitude lines */}
              {[37.5, 75, 112.5, 150, 187.5, 225, 262.5].map((y, i) => (
                <line key={`h${i}`} x1="-400" y1={y} x2="1200" y2={y} />
              ))}
              {/* Longitude lines - curved to simulate sphere */}
              {Array.from({ length: 24 }, (_, i) => (
                <line key={`v${i}`} x1={i * 33.3 - 400} y1="0" x2={i * 33.3 - 400} y2="300" />
              ))}
            </g>

            {/* Subtle cloud wisps */}
            <g fill="hsl(200 30% 80% / 0.04)">
              <ellipse cx="80" cy="70" rx="40" ry="8" />
              <ellipse cx="200" cy="120" rx="50" ry="6" />
              <ellipse cx="140" cy="180" rx="35" ry="7" />
              <ellipse cx="260" cy="60" rx="45" ry="5" />
              <ellipse cx="480" cy="70" rx="40" ry="8" />
              <ellipse cx="600" cy="120" rx="50" ry="6" />
            </g>

            {/* Shading overlay - 3D sphere effect */}
            <circle cx="150" cy="150" r="150" fill="url(#earthShading)" />

            {/* Specular highlight */}
            <ellipse
              cx="110"
              cy="100"
              rx="60"
              ry="50"
              fill="hsl(200 60% 80% / 0.03)"
            />
          </g>
        </svg>

        {/* Atmospheric rim */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, transparent 40%, hsl(190 80% 60% / 0.06) 65%, hsl(190 80% 50% / 0.12) 85%, hsl(190 80% 40% / 0.2) 100%)",
          }}
        />

        {/* Atmosphere edge glow */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            inset: "-3px",
            border: "2px solid hsl(190 80% 60% / 0.15)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Scouter / Scanner overlay */}
      <svg
        className="absolute pointer-events-none"
        style={{
          width: "min(380px, 65vw)",
          height: "min(380px, 65vw)",
        }}
        viewBox="0 0 380 380"
      >
        <defs>
          <radialGradient id="scanSweep">
            <stop offset="0%" stopColor="hsl(var(--glow-primary) / 0)" />
            <stop offset="70%" stopColor="hsl(var(--glow-primary) / 0)" />
            <stop offset="100%" stopColor="hsl(var(--glow-primary) / 0.15)" />
          </radialGradient>
        </defs>

        {/* Outer ring */}
        <circle
          cx="190" cy="190" r="185"
          fill="none"
          stroke="hsl(var(--primary) / 0.15)"
          strokeWidth="1"
        />
        {/* Inner measurement ring */}
        <circle
          cx="190" cy="190" r="165"
          fill="none"
          stroke="hsl(var(--primary) / 0.08)"
          strokeWidth="0.5"
          strokeDasharray="4 8"
        />

        {/* Tick marks around the edge */}
        {Array.from({ length: 36 }, (_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const inner = i % 3 === 0 ? 172 : 178;
          const outer = 185;
          return (
            <line
              key={`tick${i}`}
              x1={190 + Math.cos(angle) * inner}
              y1={190 + Math.sin(angle) * inner}
              x2={190 + Math.cos(angle) * outer}
              y2={190 + Math.sin(angle) * outer}
              stroke={`hsl(var(--primary) / ${i % 3 === 0 ? 0.25 : 0.1})`}
              strokeWidth={i % 3 === 0 ? 1 : 0.5}
            />
          );
        })}

        {/* Rotating scanner sweep */}
        <g style={{ transformOrigin: "190px 190px", animation: "scanner-sweep 4s linear infinite" }}>
          <line
            x1="190" y1="190"
            x2="190" y2="5"
            stroke="hsl(var(--glow-primary) / 0.4)"
            strokeWidth="1"
          />
          <path
            d="M190,190 L180,10 A185,185 0 0,1 190,5 Z"
            fill="hsl(var(--glow-primary) / 0.06)"
          />
        </g>

        {/* Data points / blips */}
        {[
          { x: 130, y: 90, r: 3, delay: 0 },
          { x: 250, y: 110, r: 2.5, delay: 0.8 },
          { x: 100, y: 200, r: 2, delay: 1.5 },
          { x: 280, y: 230, r: 3, delay: 2.2 },
          { x: 160, y: 280, r: 2, delay: 3 },
          { x: 230, y: 160, r: 2.5, delay: 0.5 },
          { x: 145, y: 170, r: 2, delay: 1.8 },
          { x: 210, y: 260, r: 2, delay: 2.8 },
        ].map((pt, i) => (
          <g key={`dp${i}`}>
            {/* Ping ring */}
            <circle
              cx={pt.x} cy={pt.y} r={pt.r * 3}
              fill="none"
              stroke="hsl(var(--glow-primary) / 0.3)"
              strokeWidth="0.5"
              style={{ animation: `data-ping 3s ease-out ${pt.delay}s infinite` }}
            />
            {/* Core dot */}
            <circle
              cx={pt.x} cy={pt.y} r={pt.r}
              fill="hsl(var(--glow-primary))"
              style={{ animation: `twinkle 2s ease-in-out ${pt.delay}s infinite` }}
            />
          </g>
        ))}

        {/* Corner data readouts */}
        <g fill="hsl(var(--primary) / 0.5)" fontFamily="var(--font-display)" fontSize="6" letterSpacing="1">
          <text x="20" y="30">LAT 41.40°N</text>
          <text x="280" y="30">LON 2.17°W</text>
          <text x="20" y="365">ALT 420KM</text>
          <text x="280" y="365">SCAN ACTIVE</text>
        </g>

        {/* Crosshairs */}
        <line x1="190" y1="170" x2="190" y2="178" stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.5" />
        <line x1="190" y1="202" x2="190" y2="210" stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.5" />
        <line x1="170" y1="190" x2="178" y2="190" stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.5" />
        <line x1="202" y1="190" x2="210" y2="190" stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.5" />
      </svg>

      {/* Orbit ring */}
      <div
        className="absolute rounded-full border pointer-events-none"
        style={{
          width: "min(400px, 68vw)",
          height: "min(400px, 68vw)",
          borderColor: "hsl(var(--primary) / 0.06)",
          animation: "pulse-glow 6s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
};

export default Earth;
