'use client';

export default function VaseSVG({ vaseId, size = 160, className = '' }) {
  const vaseMap = {
    modern: <ModernVase size={size} />,
    mason: <MasonJar size={size} />,
    basket: <Basket size={size} />,
    crystal: <CrystalVase size={size} />,
    paper: <PaperWrap size={size} />,
    ceramic: <CeramicPot size={size} />,
  };

  return (
    <div className={className} style={{ width: size, height: size * 0.8 }}>
      {vaseMap[vaseId] || null}
    </div>
  );
}

function ModernVase({ size }) {
  return (
    <svg viewBox="0 0 160 130" width={size} height={size * 0.8}>
      <defs>
        <linearGradient id="mv-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e8e0d8" />
          <stop offset="50%" stopColor="#f5f0eb" />
          <stop offset="100%" stopColor="#d4ccc4" />
        </linearGradient>
      </defs>
      <path d="M55 10 Q50 10 48 15 L42 100 Q42 120 60 120 L100 120 Q118 120 118 100 L112 15 Q110 10 105 10 Z"
        fill="url(#mv-grad)" stroke="#c4bab0" strokeWidth="1" />
      <path d="M55 10 Q80 5 105 10" stroke="#d4ccc4" strokeWidth="2" fill="none" />
      <line x1="52" y1="25" x2="48" y2="90" stroke="#f0ebe5" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function MasonJar({ size }) {
  return (
    <svg viewBox="0 0 160 130" width={size} height={size * 0.8}>
      <defs>
        <linearGradient id="mj-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b8d8e8" />
          <stop offset="30%" stopColor="#d4eef8" />
          <stop offset="70%" stopColor="#c8e4f0" />
          <stop offset="100%" stopColor="#a8c8d8" />
        </linearGradient>
      </defs>
      {/* Lid ring */}
      <rect x="52" y="5" width="56" height="12" rx="2" fill="#bdbdbd" stroke="#9e9e9e" strokeWidth="1" />
      <line x1="52" y1="11" x2="108" y2="11" stroke="#9e9e9e" strokeWidth="0.5" />
      {/* Jar body */}
      <path d="M52 17 L48 25 L46 110 Q46 125 60 125 L100 125 Q114 125 114 110 L112 25 L108 17 Z"
        fill="url(#mj-grad)" stroke="#98c0d0" strokeWidth="1" opacity="0.85" />
      {/* Glass reflection */}
      <path d="M55 25 L54 105 Q54 110 58 112" stroke="white" strokeWidth="2" fill="none" opacity="0.4" />
      {/* Thread lines on neck */}
      <line x1="52" y1="20" x2="108" y2="20" stroke="#90b8c8" strokeWidth="0.5" opacity="0.5" />
      <line x1="50" y1="23" x2="110" y2="23" stroke="#90b8c8" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

function Basket({ size }) {
  return (
    <svg viewBox="0 0 160 130" width={size} height={size * 0.8}>
      <defs>
        <pattern id="weave" x="0" y="0" width="12" height="8" patternUnits="userSpaceOnUse">
          <rect width="12" height="8" fill="#d4a574" />
          <rect x="0" y="0" width="6" height="4" fill="#c49564" />
          <rect x="6" y="4" width="6" height="4" fill="#c49564" />
        </pattern>
      </defs>
      {/* Handle */}
      <path d="M45 30 Q80 -15 115 30" stroke="#b08050" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M45 30 Q80 -10 115 30" stroke="#c49564" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Basket body */}
      <path d="M38 30 L42 115 Q42 125 55 125 L105 125 Q118 125 118 115 L122 30 Z"
        fill="url(#weave)" stroke="#a07040" strokeWidth="1.5" />
      {/* Rim */}
      <path d="M38 30 L122 30" stroke="#b08050" strokeWidth="4" strokeLinecap="round" />
      {/* Horizontal bands */}
      <line x1="40" y1="55" x2="120" y2="55" stroke="#a07040" strokeWidth="1" opacity="0.4" />
      <line x1="41" y1="80" x2="119" y2="80" stroke="#a07040" strokeWidth="1" opacity="0.4" />
      <line x1="42" y1="105" x2="118" y2="105" stroke="#a07040" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function CrystalVase({ size }) {
  return (
    <svg viewBox="0 0 160 130" width={size} height={size * 0.8}>
      <defs>
        <linearGradient id="cv-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8f0f8" />
          <stop offset="30%" stopColor="#f8fcff" />
          <stop offset="70%" stopColor="#e0ecf4" />
          <stop offset="100%" stopColor="#c8d8e8" />
        </linearGradient>
      </defs>
      {/* Vase body */}
      <path d="M55 8 Q45 8 42 15 L38 35 Q34 60 48 80 L50 110 Q50 125 65 125 L95 125 Q110 125 110 110 L112 80 Q126 60 122 35 L118 15 Q115 8 105 8 Z"
        fill="url(#cv-grad)" stroke="#b0c4d8" strokeWidth="1" />
      {/* Crystal facets */}
      <line x1="60" y1="15" x2="55" y2="110" stroke="#d0e0f0" strokeWidth="0.5" opacity="0.6" />
      <line x1="80" y1="10" x2="80" y2="115" stroke="#d0e0f0" strokeWidth="0.5" opacity="0.6" />
      <line x1="100" y1="15" x2="105" y2="110" stroke="#d0e0f0" strokeWidth="0.5" opacity="0.6" />
      <line x1="38" y1="50" x2="122" y2="50" stroke="#d0e0f0" strokeWidth="0.5" opacity="0.4" />
      <line x1="45" y1="80" x2="115" y2="80" stroke="#d0e0f0" strokeWidth="0.5" opacity="0.4" />
      {/* Sparkles */}
      <circle cx="52" cy="30" r="2" fill="white" opacity="0.8" />
      <circle cx="105" cy="45" r="1.5" fill="white" opacity="0.6" />
      <circle cx="70" cy="70" r="1" fill="white" opacity="0.5" />
      {/* Glass reflection */}
      <path d="M50 18 L46 55 Q44 65 50 72" stroke="white" strokeWidth="2" fill="none" opacity="0.35" />
    </svg>
  );
}

function PaperWrap({ size }) {
  return (
    <svg viewBox="0 0 160 130" width={size} height={size * 0.8}>
      <defs>
        <linearGradient id="pw-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4b896" />
          <stop offset="50%" stopColor="#c4a882" />
          <stop offset="100%" stopColor="#b49872" />
        </linearGradient>
      </defs>
      {/* Paper cone */}
      <path d="M30 15 L55 125 Q58 130 65 130 L95 130 Q102 130 105 125 L130 15 Z"
        fill="url(#pw-grad)" stroke="#a08060" strokeWidth="1" />
      {/* Fold detail */}
      <path d="M30 15 Q40 22 55 18 Q70 14 80 20 Q95 26 110 18 Q120 14 130 15"
        fill="none" stroke="#b49872" strokeWidth="1.5" />
      {/* Crease lines */}
      <line x1="50" y1="25" x2="58" y2="115" stroke="#b49872" strokeWidth="0.5" opacity="0.4" />
      <line x1="80" y1="20" x2="80" y2="125" stroke="#b49872" strokeWidth="0.5" opacity="0.3" />
      <line x1="110" y1="25" x2="102" y2="115" stroke="#b49872" strokeWidth="0.5" opacity="0.4" />
      {/* Twine bow */}
      <path d="M65 45 Q55 35 60 30 Q65 25 70 35" stroke="#8d6e4a" strokeWidth="2" fill="none" />
      <path d="M70 35 Q75 25 80 30 Q85 35 75 45" stroke="#8d6e4a" strokeWidth="2" fill="none" />
      <circle cx="70" cy="40" r="3" fill="#8d6e4a" />
      <path d="M67 43 Q60 55 55 60" stroke="#8d6e4a" strokeWidth="1.5" fill="none" />
      <path d="M73 43 Q80 55 85 58" stroke="#8d6e4a" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function CeramicPot({ size }) {
  return (
    <svg viewBox="0 0 160 130" width={size} height={size * 0.8}>
      <defs>
        <radialGradient id="cp-grad" cx="40%" cy="30%">
          <stop offset="0%" stopColor="#efe0d0" />
          <stop offset="100%" stopColor="#c8b8a8" />
        </radialGradient>
      </defs>
      {/* Pot body - round */}
      <ellipse cx="80" cy="85" rx="48" ry="38" fill="url(#cp-grad)" stroke="#b0a090" strokeWidth="1.5" />
      {/* Pot neck */}
      <path d="M55 20 Q55 15 60 12 L100 12 Q105 15 105 20 L108 52 Q108 55 105 55 L55 55 Q52 55 52 52 Z"
        fill="#d8c8b8" stroke="#b0a090" strokeWidth="1" />
      {/* Rim */}
      <ellipse cx="80" cy="12" rx="22" ry="5" fill="#e8d8c8" stroke="#b0a090" strokeWidth="1" />
      {/* Decorative band */}
      <ellipse cx="80" cy="75" rx="45" ry="3" fill="none" stroke="#a09080" strokeWidth="1" opacity="0.5" />
      <ellipse cx="80" cy="95" rx="42" ry="3" fill="none" stroke="#a09080" strokeWidth="1" opacity="0.5" />
      {/* Hand-painted dots */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        const rad = (angle * Math.PI) / 180;
        return (
          <circle key={i} cx={80 + Math.cos(rad) * 35} cy={85 + Math.sin(rad) * 25} r="3"
            fill="#a09080" opacity="0.3" />
        );
      })}
    </svg>
  );
}
