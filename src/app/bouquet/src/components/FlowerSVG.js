'use client';

import { useId } from 'react';

export default function FlowerSVG({ flowerId, size = 100, className = '' }) {
  const reactId = useId();
  const uid = `${flowerId}-${reactId.replace(/:/g, '')}`;

  const flowerMap = {
    rose: <RoseSVG id={uid} size={size} />,
    sunflower: <SunflowerSVG id={uid} size={size} />,
    tulip: <TulipSVG id={uid} size={size} />,
    daisy: <DaisySVG id={uid} size={size} />,
    lily: <LilySVG id={uid} size={size} />,
    peony: <PeonySVG id={uid} size={size} />,
    lavender: <LavenderSVG id={uid} size={size} />,
    orchid: <OrchidSVG id={uid} size={size} />,
    carnation: <CarnationSVG id={uid} size={size} />,
    iris: <IrisSVG id={uid} size={size} />,
    chrysanthemum: <ChrysanthemumSVG id={uid} size={size} />,
    anemone: <AnemoneSVG id={uid} size={size} />,
  };

  return (
    <div className={className} style={{ width: size, height: size }}>
      {flowerMap[flowerId] || null}
    </div>
  );
}

/* ─── Shared watercolor filter defs ─── */
function WatercolorDefs({ id }) {
  return (
    <defs>
      <filter id={`wc-${id}`} x="-25%" y="-25%" width="150%" height="150%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" result="warp" />
        <feGaussianBlur in="warp" stdDeviation="0.6" result="soft" />
        <feMerge>
          <feMergeNode in="soft" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id={`wash-${id}`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
      </filter>
      <filter id={`wash-sm-${id}`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" />
      </filter>
    </defs>
  );
}

/* ════════════════════════════════════════════
   ROSE — Realistic rose with heart-shaped cupped petals
   ════════════════════════════════════════════ */
function RoseSVG({ id, size }) {
  const cx = 60, cy = 50;

  // Helper: point at angle + distance from center
  const pt = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];

  // Create a rose petal path with heart-shaped tip and organic curves
  // angleDeg: direction, r: length, w: width factor, asym: asymmetry amount
  function rosePetal(angleDeg, r, w, asym = 0) {
    const a = (angleDeg * Math.PI) / 180;
    const perp = a + Math.PI / 2;
    const sideR = r * w;

    // ── Key petal points ──
    // Notch at top center (heart shape) — slightly pulled back from the tip
    const notchDepth = r * 0.08;
    const [notchX, notchY] = pt(a, r - notchDepth);

    // Left and right tip lobes (the two bumps of the heart)
    const lobeDist = r * 1.02;  // slightly beyond the notch
    const lobeSpread = sideR * 0.38;
    const [ltX, ltY] = [
      cx + Math.cos(a) * lobeDist + Math.cos(perp) * lobeSpread,
      cy + Math.sin(a) * lobeDist + Math.sin(perp) * lobeSpread
    ];
    const [rtX, rtY] = [
      cx + Math.cos(a) * lobeDist - Math.cos(perp) * lobeSpread,
      cy + Math.sin(a) * lobeDist - Math.sin(perp) * lobeSpread
    ];

    // Widest part of petal (about 60-70% out from center)
    const bulgePos = 0.62 + asym * 0.04;
    const bulgeWidth = sideR * 1.1;
    const [blX, blY] = [
      cx + Math.cos(a) * r * bulgePos + Math.cos(perp) * bulgeWidth,
      cy + Math.sin(a) * r * bulgePos + Math.sin(perp) * bulgeWidth
    ];
    const [brX, brY] = [
      cx + Math.cos(a) * r * bulgePos - Math.cos(perp) * (bulgeWidth * (1 - asym * 0.1)),
      cy + Math.sin(a) * r * bulgePos - Math.sin(perp) * (bulgeWidth * (1 - asym * 0.1))
    ];

    // Base control points (narrow at center)
    const baseWidth = sideR * 0.25;
    const [bclX, bclY] = [cx + Math.cos(perp) * baseWidth, cy + Math.sin(perp) * baseWidth];
    const [bcrX, bcrY] = [cx - Math.cos(perp) * baseWidth, cy - Math.sin(perp) * baseWidth];

    // ── Build path: center → left edge → left lobe → notch → right lobe → right edge → center ──
    return [
      `M${cx},${cy}`,
      // Left edge: narrow base curves out to wide bulge
      `C${bclX},${bclY} ${blX},${blY} ${ltX},${ltY}`,
      // Left lobe curves to notch (heart indent)
      `Q${cx + Math.cos(a) * r * 1.08 + Math.cos(perp) * lobeSpread * 0.2},${cy + Math.sin(a) * r * 1.08 + Math.sin(perp) * lobeSpread * 0.2} ${notchX},${notchY}`,
      // Notch curves to right lobe
      `Q${cx + Math.cos(a) * r * 1.08 - Math.cos(perp) * lobeSpread * 0.2},${cy + Math.sin(a) * r * 1.08 - Math.sin(perp) * lobeSpread * 0.2} ${rtX},${rtY}`,
      // Right lobe curves back down to base
      `C${brX},${brY} ${bcrX},${bcrY} ${cx},${cy}`,
    ].join(' ');
  }

  // Ring definitions
  const rings = [
    { count: 5, r: 38, w: 0.46, off: 0, colors: ['#b71c1c', '#c62828', '#b71c1c', '#c62828', '#b71c1c'], op: 0.72, sw: 1.8 },
    { count: 5, r: 28, w: 0.44, off: 36, colors: ['#d32f2f', '#c62828', '#e53935', '#c62828', '#d32f2f'], op: 0.72, sw: 1.6 },
    { count: 5, r: 20, w: 0.42, off: 16, colors: ['#e53935', '#ef5350', '#e53935', '#ef5350', '#e53935'], op: 0.72, sw: 1.4 },
    { count: 4, r: 13, w: 0.4, off: 45, colors: ['#ff5252', '#ef5350', '#ff5252', '#ff8a80'], op: 0.7, sw: 1.3 },
  ];

  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />
      {/* Soft wash behind */}
      <circle cx={cx} cy={cy} r="44" fill="#c62828" opacity="0.18" filter={`url(#wash-${id})`} />
      <circle cx={cx - 3} cy={cy + 3} r="30" fill="#e53935" opacity="0.12" filter={`url(#wash-${id})`} />

      <g filter={`url(#wc-${id})`}>
        {/* Petal rings */}
        {rings.map((ring, ri) => (
          <g key={`ring${ri}`}>
            {[...Array(ring.count)].map((_, i) => {
              const angle = (i * 360) / ring.count - 90 + ring.off;
              const asymmetry = (i % 3 === 0) ? 0.5 : (i % 3 === 1) ? -0.3 : 0;
              return (
                <path key={`r${ri}p${i}`}
                  d={rosePetal(angle, ring.r, ring.w, asymmetry)}
                  fill={ring.colors[i % ring.colors.length]}
                  fillOpacity={ring.op}
                  stroke="#2a2a2a" strokeWidth={ring.sw}
                  strokeLinecap="round" strokeLinejoin="round" />
              );
            })}
          </g>
        ))}

        {/* Petal fold/vein lines on outer ring for realism */}
        {[...Array(5)].map((_, i) => {
          const angle = ((i * 360) / 5 - 90) * Math.PI / 180;
          const [sx, sy] = pt(angle, 6);
          const [ex, ey] = pt(angle, 32);
          return (
            <path key={`vein${i}`}
              d={`M${sx},${sy} Q${cx + Math.cos(angle) * 20},${cy + Math.sin(angle) * 20} ${ex},${ey}`}
              fill="none" stroke="#2a2a2a" strokeWidth="0.5" opacity="0.2" strokeLinecap="round" />
          );
        })}

        {/* ── Centre: tight spiral bud ── */}
        <circle cx={cx} cy={cy} r="7" fill="#b71c1c" fillOpacity="0.9"
          stroke="#2a2a2a" strokeWidth="1.8" />
        {/* Spiral swirl */}
        <path d={`M${cx - 3},${cy - 1} C${cx - 3},${cy + 3} ${cx + 1},${cy + 4} ${cx + 3},${cy + 1} C${cx + 4},${cy - 1} ${cx + 1},${cy - 3} ${cx - 1},${cy - 2} C${cx - 2},${cy - 1} ${cx - 1},${cy + 1} ${cx + 1},${cy}`}
          fill="none" stroke="#4a0000" strokeWidth="1.2" opacity="0.7" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="3" fill="#8b0000" fillOpacity="0.85"
          stroke="#2a2a2a" strokeWidth="1.2" />
      </g>

      {/* Stem */}
      <path d="M60 88 C58 98, 59 108, 60 118" stroke="#2e7d32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M57 98 C44 92, 32 94, 34 104 C40 100, 50 98, 57 100"
        fill="#4a7c34" fillOpacity="0.65" stroke="#2a2a2a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M63 104 C76 98, 86 100, 84 110 C78 106, 70 104, 63 106"
        fill="#3d6b2e" fillOpacity="0.6" stroke="#2a2a2a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Leaf veins */}
      <path d="M57 98 C48 94, 40 96, 36 102" fill="none" stroke="#2a2a2a" strokeWidth="0.6" opacity="0.35" strokeLinecap="round" />
      <path d="M63 104 C72 100, 80 102, 82 108" fill="none" stroke="#2a2a2a" strokeWidth="0.6" opacity="0.35" strokeLinecap="round" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   SUNFLOWER — Bold petals with hatching, brown centre with diamond
   ════════════════════════════════════════════ */
function SunflowerSVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />
      {/* Wash blob */}
      <circle cx="60" cy="56" r="46" fill="#f9a825" opacity="0.2" filter={`url(#wash-${id})`} />
      <circle cx="54" cy="60" r="32" fill="#ffb300" opacity="0.15" filter={`url(#wash-${id})`} />

      <g filter={`url(#wc-${id})`}>
        {/* Back row of petals (slightly offset) */}
        {[0, 26, 52, 78, 104, 130, 156, 182, 208, 234, 260, 286, 312, 338].map((angle, i) => {
          const rad = ((angle + 13) * Math.PI) / 180;
          const bx = 60 + Math.cos(rad) * 12;
          const by = 56 + Math.sin(rad) * 12;
          const tx = 60 + Math.cos(rad) * 44;
          const ty = 56 + Math.sin(rad) * 44;
          const cx1 = 60 + Math.cos(rad + 0.22) * 30;
          const cy1 = 56 + Math.sin(rad + 0.22) * 30;
          const cx2 = 60 + Math.cos(rad - 0.22) * 30;
          const cy2 = 56 + Math.sin(rad - 0.22) * 30;
          return (
            <path key={`b${i}`}
              d={`M${bx},${by} Q${cx1},${cy1} ${tx},${ty} Q${cx2},${cy2} ${bx},${by}`}
              fill={i % 2 === 0 ? '#f9a825' : '#f57f17'}
              fillOpacity="0.5"
              stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          );
        })}

        {/* Front row of petals */}
        {[0, 26, 52, 78, 104, 130, 156, 182, 208, 234, 260, 286, 312, 338].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const bx = 60 + Math.cos(rad) * 10;
          const by = 56 + Math.sin(rad) * 10;
          const tx = 60 + Math.cos(rad) * 42;
          const ty = 56 + Math.sin(rad) * 42;
          const cx1 = 60 + Math.cos(rad + 0.2) * 28;
          const cy1 = 56 + Math.sin(rad + 0.2) * 28;
          const cx2 = 60 + Math.cos(rad - 0.2) * 28;
          const cy2 = 56 + Math.sin(rad - 0.2) * 28;
          const fillColor = i % 3 === 0 ? '#fdd835' : i % 3 === 1 ? '#fbc02d' : '#f9a825';
          return (
            <g key={`f${i}`}>
              <path
                d={`M${bx},${by} Q${cx1},${cy1} ${tx},${ty} Q${cx2},${cy2} ${bx},${by}`}
                fill={fillColor}
                fillOpacity="0.65"
                stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {/* Internal hatching line on each petal */}
              <line
                x1={60 + Math.cos(rad) * 14} y1={56 + Math.sin(rad) * 14}
                x2={60 + Math.cos(rad) * 36} y2={56 + Math.sin(rad) * 36}
                stroke="#1a1a1a" strokeWidth="0.7" opacity="0.3" strokeLinecap="round" />
            </g>
          );
        })}

        {/* Centre disc */}
        <circle cx="60" cy="56" r="17" fill="#5d4037" fillOpacity="0.85" stroke="#1a1a1a" strokeWidth="2.2" />
        <circle cx="60" cy="56" r="13" fill="#4e342e" fillOpacity="0.7" stroke="none" />
        <circle cx="60" cy="56" r="9" fill="#3e2723" fillOpacity="0.5" stroke="none" />

        {/* Crosshatch pattern in centre */}
        {[...Array(7)].map((_, i) => (
          <line key={`ch${i}`} x1={48} y1={46 + i * 3} x2={72} y2={46 + i * 3}
            stroke="#2c1810" strokeWidth="0.6" opacity="0.5" />
        ))}
        {[...Array(7)].map((_, i) => (
          <line key={`cv${i}`} x1={50 + i * 3} y1={44} x2={50 + i * 3} y2={68}
            stroke="#2c1810" strokeWidth="0.6" opacity="0.5" />
        ))}
        {/* Diamond motif */}
        <path d="M54 56 L60 48 L66 56 L60 64 Z" fill="none" stroke="#1a1a1a" strokeWidth="1.2" opacity="0.7" />
        <path d="M57 56 L60 52 L63 56 L60 60 Z" fill="none" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.5" />
      </g>

      {/* Stem */}
      <path d="M60 82 C58 94, 60 108, 60 118" stroke="#33691e" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M57 96 C42 88, 32 92, 34 102 C42 98, 50 96, 57 98" fill="#558b2f" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   TULIP — Cup-shaped petals, red-pink, bold ink
   ════════════════════════════════════════════ */
function TulipSVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />
      <ellipse cx="60" cy="44" rx="28" ry="34" fill="#e53935" opacity="0.2" filter={`url(#wash-${id})`} />

      <g filter={`url(#wc-${id})`}>
        {/* Left outer petal */}
        <path d="M60 16 C44 22, 30 40, 32 62 C34 70, 42 74, 50 68 C54 62, 56 44, 58 28"
          fill="#e53935" fillOpacity="0.6" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Right outer petal */}
        <path d="M60 16 C76 22, 90 40, 88 62 C86 70, 78 74, 70 68 C66 62, 64 44, 62 28"
          fill="#c62828" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Centre petal overlay */}
        <path d="M60 12 C50 24, 44 44, 46 64 C48 70, 56 72, 60 66 C64 72, 72 70, 74 64 C76 44, 70 24, 60 12"
          fill="#ff5252" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Internal fold/vein lines */}
        <path d="M52 24 C50 38, 48 52, 48 62" fill="none" stroke="#1a1a1a" strokeWidth="0.9" opacity="0.35" strokeLinecap="round" />
        <path d="M68 24 C70 38, 72 52, 72 62" fill="none" stroke="#1a1a1a" strokeWidth="0.9" opacity="0.35" strokeLinecap="round" />
        <path d="M60 18 C60 34, 60 50, 60 64" fill="none" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />

        {/* Highlight wash */}
        <path d="M54 26 C52 38, 50 50, 50 58" fill="none" stroke="#ffcdd2" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
      </g>

      {/* Stem */}
      <path d="M60 72 C58 86, 60 104, 60 118" stroke="#2e7d32" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M56 88 C38 78, 26 84, 30 96 C38 92, 48 90, 56 90"
        fill="#43a047" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M64 80 C82 72, 92 78, 88 90 C80 86, 72 82, 64 82"
        fill="#388e3c" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
      {/* Leaf vein lines */}
      <path d="M56 88 C44 84, 36 88, 34 94" fill="none" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.3" strokeLinecap="round" />
      <path d="M64 80 C76 76, 84 80, 86 88" fill="none" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   DAISY — Simple white petals, yellow center, bold ink
   ════════════════════════════════════════════ */
function DaisySVG({ id, size }) {
  const petals = 12;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />

      <g filter={`url(#wc-${id})`}>
        {/* Petals — elongated ellipses radiating out */}
        {[...Array(petals)].map((_, i) => {
          const angle = (i * 360) / petals - 90;
          const rad = (angle * Math.PI) / 180;
          const cx = 60 + Math.cos(rad) * 22;
          const cy = 54 + Math.sin(rad) * 22;
          // Elongated petal as two curves meeting at tip
          const bx1 = 60 + Math.cos(rad + 0.35) * 8;
          const by1 = 54 + Math.sin(rad + 0.35) * 8;
          const bx2 = 60 + Math.cos(rad - 0.35) * 8;
          const by2 = 54 + Math.sin(rad - 0.35) * 8;
          const tx = 60 + Math.cos(rad) * 38;
          const ty = 54 + Math.sin(rad) * 38;
          return (
            <g key={i}>
              <path
                d={`M${bx1},${by1} Q${cx + Math.cos(rad + 0.3) * 8},${cy + Math.sin(rad + 0.3) * 8} ${tx},${ty} Q${cx + Math.cos(rad - 0.3) * 8},${cy + Math.sin(rad - 0.3) * 8} ${bx2},${by2}`}
                fill="white"
                fillOpacity="0.9"
                stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {/* Centre vein line */}
              <line
                x1={60 + Math.cos(rad) * 10} y1={54 + Math.sin(rad) * 10}
                x2={60 + Math.cos(rad) * 34} y2={54 + Math.sin(rad) * 34}
                stroke="#1a1a1a" strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />
            </g>
          );
        })}
        {/* Centre — yellow with texture dots */}
        <circle cx="60" cy="54" r="12" fill="#fdd835" fillOpacity="0.85" stroke="#1a1a1a" strokeWidth="2.2" />
        <circle cx="60" cy="54" r="8" fill="#f9a825" fillOpacity="0.5" stroke="none" />
        {/* Texture dots */}
        <circle cx="56" cy="51" r="1.5" fill="#f57f17" opacity="0.5" />
        <circle cx="64" cy="52" r="1.3" fill="#f57f17" opacity="0.4" />
        <circle cx="60" cy="57" r="1.4" fill="#e65100" opacity="0.35" />
        <circle cx="58" cy="55" r="1" fill="#f57f17" opacity="0.4" />
        <circle cx="63" cy="56" r="1" fill="#e65100" opacity="0.3" />
        <circle cx="57" cy="53" r="0.8" fill="#f57f17" opacity="0.35" />
      </g>

      {/* Stem */}
      <path d="M60 72 C59 88, 60 104, 61 118" stroke="#43a047" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M59 92 C46 86, 36 90, 38 100 C46 96, 54 94, 59 94" fill="#4caf50" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   LILY — Star-shaped, purple, watercolor wash bleeding out
   ════════════════════════════════════════════ */
function LilySVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />
      {/* Prominent wash background */}
      <circle cx="56" cy="50" r="40" fill="#7e57c2" opacity="0.22" filter={`url(#wash-${id})`} />
      <ellipse cx="66" cy="44" rx="30" ry="36" fill="#5e35b1" opacity="0.15" filter={`url(#wash-${id})`} />

      <g filter={`url(#wc-${id})`}>
        {/* Back petals */}
        <path d="M60 8 C50 16, 42 32, 44 48 C44 56, 50 60, 56 54 C56 44, 58 26, 60 8"
          fill="#7e57c2" fillOpacity="0.6" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M60 8 C70 16, 78 32, 76 48 C76 56, 70 60, 64 54 C64 44, 62 26, 60 8"
          fill="#5e35b1" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Side petals — spreading left and right */}
        <path d="M24 28 C32 30, 44 38, 50 50 C52 56, 48 60, 42 56 C36 50, 28 38, 24 28"
          fill="#7e57c2" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M96 28 C88 30, 76 38, 70 50 C68 56, 72 60, 78 56 C84 50, 92 38, 96 28"
          fill="#5e35b1" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Lower petals */}
        <path d="M30 76 C38 66, 48 58, 54 54 C58 52, 58 58, 54 64 C48 72, 38 78, 30 76"
          fill="#9575cd" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M90 76 C82 66, 72 58, 66 54 C62 52, 62 58, 66 64 C72 72, 82 78, 90 76"
          fill="#7e57c2" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

        {/* Internal petal vein lines */}
        <path d="M60 14 C58 28, 52 42, 50 52" fill="none" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
        <path d="M60 14 C62 28, 68 42, 70 52" fill="none" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
        <path d="M30 34 C38 40, 44 46, 48 52" fill="none" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.25" strokeLinecap="round" />
        <path d="M90 34 C82 40, 76 46, 72 52" fill="none" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.25" strokeLinecap="round" />

        {/* Centre */}
        <circle cx="60" cy="52" r="6" fill="#ede7f6" fillOpacity="0.8" stroke="#1a1a1a" strokeWidth="1.5" />
        {/* Stamens */}
        <line x1="56" y1="48" x2="52" y2="34" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="64" y1="48" x2="68" y2="34" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="60" y1="46" x2="60" y2="32" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="52" cy="33" r="2" fill="#ff8f00" stroke="#1a1a1a" strokeWidth="0.8" />
        <circle cx="68" cy="33" r="2" fill="#ff8f00" stroke="#1a1a1a" strokeWidth="0.8" />
        <circle cx="60" cy="31" r="2" fill="#ff8f00" stroke="#1a1a1a" strokeWidth="0.8" />
      </g>

      {/* Stem */}
      <path d="M60 78 C58 92, 60 106, 60 118" stroke="#2e7d32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M57 96 C42 88, 32 92, 36 102 C44 98, 52 96, 57 98" fill="#388e3c" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   PEONY — Soft pink ruffled layers, visible yellow centre, wash behind
   ════════════════════════════════════════════ */
function PeonySVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />
      {/* Prominent pink wash */}
      <circle cx="60" cy="52" r="44" fill="#ec407a" opacity="0.22" filter={`url(#wash-${id})`} />
      <circle cx="52" cy="58" r="30" fill="#f48fb1" opacity="0.18" filter={`url(#wash-${id})`} />

      <g filter={`url(#wc-${id})`}>
        {/* Outer ruffled petals — large */}
        <path d="M22 50 C20 34, 34 18, 52 22 C44 30, 30 42, 26 54 C24 60, 22 58, 22 50"
          fill="#f48fb1" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M98 50 C100 34, 86 18, 68 22 C76 30, 90 42, 94 54 C96 60, 98 58, 98 50"
          fill="#ec407a" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M48 20 C56 16, 64 16, 72 20 C66 26, 56 26, 48 20"
          fill="#f06292" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M24 62 C18 74, 28 90, 48 88 C38 82, 28 72, 26 62 Z"
          fill="#f8bbd0" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M96 62 C102 74, 92 90, 72 88 C82 82, 92 72, 94 62 Z"
          fill="#f48fb1" fillOpacity="0.45" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M48 88 C54 94, 66 94, 72 88 C66 86, 54 86, 48 88"
          fill="#fce4ec" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" />

        {/* Mid ruffled petals */}
        <path d="M34 32 C28 42, 30 58, 42 66 C40 54, 36 44, 36 36 Z"
          fill="#f06292" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M86 32 C92 42, 90 58, 78 66 C80 54, 84 44, 84 36 Z"
          fill="#ec407a" fillOpacity="0.45" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M44 24 C38 34, 38 50, 48 60 C48 48, 46 36, 46 28 Z"
          fill="#f48fb1" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M76 24 C82 34, 82 50, 72 60 C72 48, 74 36, 74 28 Z"
          fill="#f06292" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" />

        {/* Inner petals */}
        <path d="M48 38 C44 46, 46 58, 54 64 C54 56, 50 46, 50 40 Z"
          fill="#fce4ec" fillOpacity="0.6" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M72 38 C76 46, 74 58, 66 64 C66 56, 70 46, 70 40 Z"
          fill="#f8bbd0" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M54 30 C50 40, 52 54, 58 60 C58 50, 56 40, 56 34 Z"
          fill="#fce4ec" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M66 30 C70 40, 68 54, 62 60 C62 50, 64 40, 64 34 Z"
          fill="#f8bbd0" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />

        {/* Internal fold/vein detail lines */}
        <path d="M34 36 C36 48, 38 56, 42 64" fill="none" stroke="#c2185b" strokeWidth="0.7" opacity="0.3" strokeLinecap="round" />
        <path d="M86 36 C84 48, 82 56, 78 64" fill="none" stroke="#c2185b" strokeWidth="0.7" opacity="0.3" strokeLinecap="round" />
        <path d="M50 28 C50 40, 50 52, 54 60" fill="none" stroke="#c2185b" strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />
        <path d="M70 28 C70 40, 70 52, 66 60" fill="none" stroke="#c2185b" strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />

        {/* Yellow centre */}
        <circle cx="60" cy="52" r="8" fill="#fff9c4" fillOpacity="0.85" stroke="#1a1a1a" strokeWidth="1.5" />
        <circle cx="60" cy="52" r="5" fill="#fdd835" fillOpacity="0.6" stroke="none" />
        <circle cx="57" cy="50" r="1.5" fill="#f9a825" opacity="0.6" />
        <circle cx="63" cy="53" r="1.2" fill="#f9a825" opacity="0.5" />
        <circle cx="60" cy="55" r="1" fill="#f57f17" opacity="0.4" />
      </g>

      {/* Stem */}
      <path d="M60 88 C58 100, 60 110, 60 118" stroke="#2e7d32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M57 100 C42 94, 32 98, 36 108 C44 104, 52 102, 57 102" fill="#388e3c" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   LAVENDER — Multiple bud spikes, purple watercolor
   ════════════════════════════════════════════ */
function LavenderSVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />
      <ellipse cx="50" cy="36" rx="18" ry="32" fill="#b39ddb" opacity="0.18" filter={`url(#wash-${id})`} />
      <ellipse cx="70" cy="40" rx="16" ry="28" fill="#9575cd" opacity="0.15" filter={`url(#wash-${id})`} />

      <g filter={`url(#wc-${id})`}>
        {/* Left spike */}
        {[...Array(8)].map((_, i) => (
          <ellipse key={`l${i}`} cx={50 - i * 0.4} cy={14 + i * 8} rx={4 + Math.min(i, 4) * 0.8} ry={4}
            fill={i % 2 === 0 ? '#9575cd' : '#b39ddb'} fillOpacity={0.6 - i * 0.03}
            stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        ))}
        {/* Right spike */}
        {[...Array(7)].map((_, i) => (
          <ellipse key={`r${i}`} cx={70 + i * 0.3} cy={20 + i * 8} rx={3.5 + Math.min(i, 3) * 0.7} ry={3.5}
            fill={i % 2 === 0 ? '#b39ddb' : '#7e57c2'} fillOpacity={0.55 - i * 0.03}
            stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        ))}
        {/* Small centre spike */}
        {[...Array(5)].map((_, i) => (
          <ellipse key={`c${i}`} cx={60} cy={28 + i * 7} rx={3 + Math.min(i, 2) * 0.5} ry={3}
            fill={i % 2 === 0 ? '#7e57c2' : '#9575cd'} fillOpacity={0.5 - i * 0.04}
            stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" />
        ))}
      </g>

      {/* Stems */}
      <path d="M50 78 C48 56, 49 36, 50 14" stroke="#558b2f" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M70 78 C69 58, 69 40, 70 20" stroke="#558b2f" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M60 72 C60 56, 60 42, 60 28" stroke="#558b2f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Main stem down */}
      <path d="M50 78 C54 92, 58 106, 60 118" stroke="#33691e" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M70 78 C66 92, 62 106, 60 118" stroke="#33691e" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M60 72 C60 86, 60 100, 60 118" stroke="#33691e" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Leaves */}
      <path d="M54 94 C40 86, 28 90, 32 100 C40 96, 48 94, 54 96"
        fill="#689f38" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
      <path d="M66 88 C80 82, 90 86, 86 96 C78 92, 72 90, 66 90"
        fill="#558b2f" fillOpacity="0.45" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   ORCHID — Exotic shape, purple-pink, spots
   ════════════════════════════════════════════ */
function OrchidSVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />
      <circle cx="60" cy="50" r="38" fill="#ce93d8" opacity="0.2" filter={`url(#wash-${id})`} />

      <g filter={`url(#wc-${id})`}>
        {/* Top sepal */}
        <path d="M60 10 C48 18, 44 32, 50 46 C54 40, 56 26, 60 10"
          fill="#ce93d8" fillOpacity="0.6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M60 10 C72 18, 76 32, 70 46 C66 40, 64 26, 60 10"
          fill="#ba68c8" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Side sepals */}
        <path d="M26 26 C36 30, 44 38, 48 48 C44 44, 36 36, 26 26"
          fill="#ce93d8" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M94 26 C84 30, 76 38, 72 48 C76 44, 84 36, 94 26"
          fill="#ba68c8" fillOpacity="0.45" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" />

        {/* Wide lateral petals */}
        <path d="M22 54 C30 44, 42 40, 52 48 C44 54, 34 60, 22 62 C18 62, 18 58, 22 54"
          fill="#e1bee7" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M98 54 C90 44, 78 40, 68 48 C76 54, 86 60, 98 62 C102 62, 102 58, 98 54"
          fill="#ce93d8" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Lip / labellum */}
        <path d="M42 52 C36 62, 42 78, 60 82 C78 78, 84 62, 78 52 C72 60, 66 68, 60 70 C54 68, 48 60, 42 52"
          fill="#f48fb1" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Petal vein lines */}
        <path d="M60 14 C58 28, 54 38, 52 44" fill="none" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.3" strokeLinecap="round" />
        <path d="M60 14 C62 28, 66 38, 68 44" fill="none" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.3" strokeLinecap="round" />
        <path d="M28 56 C38 52, 44 50, 50 48" fill="none" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />
        <path d="M92 56 C82 52, 76 50, 70 48" fill="none" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />

        {/* Column */}
        <ellipse cx="60" cy="48" rx="6" ry="8" fill="#fce4ec" fillOpacity="0.8" stroke="#1a1a1a" strokeWidth="1.5" />

        {/* Spots on lip */}
        <circle cx="52" cy="62" r="2" fill="#880e4f" opacity="0.4" />
        <circle cx="68" cy="62" r="2" fill="#880e4f" opacity="0.4" />
        <circle cx="60" cy="68" r="1.5" fill="#880e4f" opacity="0.35" />
        <circle cx="56" cy="58" r="1.5" fill="#880e4f" opacity="0.3" />
        <circle cx="64" cy="58" r="1.5" fill="#880e4f" opacity="0.3" />
        <circle cx="54" cy="66" r="1" fill="#880e4f" opacity="0.25" />
        <circle cx="66" cy="66" r="1" fill="#880e4f" opacity="0.25" />
      </g>

      {/* Stem */}
      <path d="M60 82 C58 94, 60 108, 60 118" stroke="#2e7d32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M57 100 C42 94, 32 98, 36 108 C44 104, 52 102, 57 102" fill="#388e3c" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   CARNATION — Dense ruffled round shape, pink outlines
   ════════════════════════════════════════════ */
function CarnationSVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />
      {/* Pink wash */}
      <circle cx="60" cy="48" r="42" fill="#f48fb1" opacity="0.22" filter={`url(#wash-${id})`} />

      <g filter={`url(#wc-${id})`}>
        {/* Outer ruffled ring — scalloped edges */}
        <path d="M28 42 C24 32, 34 18, 48 22 C42 28, 32 36, 30 44 Z"
          fill="#f06292" fillOpacity="0.55" stroke="#c2185b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M48 22 C56 16, 64 16, 72 22 C66 28, 54 28, 48 22"
          fill="#ec407a" fillOpacity="0.5" stroke="#c2185b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M72 22 C86 18, 96 32, 92 42 C90 36, 80 26, 72 22"
          fill="#f48fb1" fillOpacity="0.55" stroke="#c2185b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M92 42 C98 52, 96 66, 86 76 C88 66, 92 54, 92 42"
          fill="#ec407a" fillOpacity="0.5" stroke="#c2185b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M86 76 C78 86, 64 88, 54 84 C64 82, 78 80, 86 76"
          fill="#f48fb1" fillOpacity="0.55" stroke="#c2185b" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M54 84 C42 86, 30 80, 26 68 C32 76, 44 82, 54 84"
          fill="#f06292" fillOpacity="0.5" stroke="#c2185b" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M26 68 C22 56, 24 46, 28 42 C28 50, 26 60, 26 68"
          fill="#ec407a" fillOpacity="0.5" stroke="#c2185b" strokeWidth="1.8" strokeLinecap="round" />

        {/* Second ruffled ring */}
        <path d="M36 34 C32 42, 34 54, 44 62 C42 52, 38 44, 38 36 Z"
          fill="#fce4ec" fillOpacity="0.55" stroke="#c2185b" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M52 26 C46 36, 46 50, 54 58 C54 48, 52 38, 54 30 Z"
          fill="#f8bbd0" fillOpacity="0.55" stroke="#c2185b" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M68 26 C74 36, 74 50, 66 58 C66 48, 68 38, 66 30 Z"
          fill="#f48fb1" fillOpacity="0.5" stroke="#c2185b" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M84 34 C88 42, 86 54, 76 62 C78 52, 82 44, 82 36 Z"
          fill="#fce4ec" fillOpacity="0.55" stroke="#c2185b" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M44 62 C40 70, 46 78, 56 78 C50 74, 44 68, 44 62"
          fill="#f8bbd0" fillOpacity="0.55" stroke="#c2185b" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M76 62 C80 70, 74 78, 64 78 C70 74, 76 68, 76 62"
          fill="#f48fb1" fillOpacity="0.5" stroke="#c2185b" strokeWidth="1.4" strokeLinecap="round" />

        {/* Inner ruffles */}
        <path d="M46 42 C42 48, 44 58, 52 62 C50 56, 48 48, 48 44 Z"
          fill="#fce4ec" fillOpacity="0.6" stroke="#c2185b" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M74 42 C78 48, 76 58, 68 62 C70 56, 72 48, 72 44 Z"
          fill="#f8bbd0" fillOpacity="0.55" stroke="#c2185b" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M54 36 C50 44, 52 56, 58 60 C58 52, 56 42, 56 38 Z"
          fill="#fce4ec" fillOpacity="0.6" stroke="#c2185b" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M66 36 C70 44, 68 56, 62 60 C62 52, 64 42, 64 38 Z"
          fill="#f8bbd0" fillOpacity="0.55" stroke="#c2185b" strokeWidth="1.3" strokeLinecap="round" />

        {/* Centre ruffle detail */}
        <path d="M54 46 C52 52, 56 58, 60 58 C64 58, 68 52, 66 46 C64 50, 60 52, 56 50 Z"
          fill="#fce4ec" fillOpacity="0.65" stroke="#c2185b" strokeWidth="1.4" strokeLinecap="round" />

        {/* Additional ruffle detail lines */}
        <path d="M40 38 C42 48, 44 56, 46 60" fill="none" stroke="#c2185b" strokeWidth="0.7" opacity="0.3" strokeLinecap="round" />
        <path d="M80 38 C78 48, 76 56, 74 60" fill="none" stroke="#c2185b" strokeWidth="0.7" opacity="0.3" strokeLinecap="round" />
      </g>

      {/* Calyx */}
      <path d="M48 80 Q60 74 72 80 Q68 70 60 66 Q52 70 48 80" fill="#2e7d32" fillOpacity="0.75" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Stem */}
      <path d="M60 80 C58 94, 60 108, 60 118" stroke="#2e7d32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   IRIS — Blue-purple, standards & falls, beard details
   ════════════════════════════════════════════ */
function IrisSVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />
      <ellipse cx="60" cy="44" rx="32" ry="38" fill="#5c6bc0" opacity="0.2" filter={`url(#wash-${id})`} />

      <g filter={`url(#wc-${id})`}>
        {/* Standards — upright petals */}
        <path d="M48 12 C40 22, 38 38, 44 50 C48 44, 50 30, 52 20 C52 16, 50 14, 48 12"
          fill="#7986cb" fillOpacity="0.6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M72 12 C80 22, 82 38, 76 50 C72 44, 70 30, 68 20 C68 16, 70 14, 72 12"
          fill="#5c6bc0" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M52 20 C52 30, 56 42, 60 48 C64 42, 68 30, 68 20 C66 14, 54 14, 52 20"
          fill="#9fa8da" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

        {/* Falls — drooping petals */}
        <path d="M40 50 C32 58, 22 70, 20 80 C24 78, 36 70, 44 60 C48 56, 44 52, 40 50"
          fill="#5c6bc0" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M80 50 C88 58, 98 70, 100 80 C96 78, 84 70, 76 60 C72 56, 76 52, 80 50"
          fill="#3f51b5" fillOpacity="0.55" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M48 54 C42 64, 40 78, 44 84 C48 78, 50 66, 54 58 C54 55, 50 54, 48 54"
          fill="#7986cb" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M72 54 C78 64, 80 78, 76 84 C72 78, 70 66, 66 58 C66 55, 70 54, 72 54"
          fill="#5c6bc0" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" />

        {/* Vein lines */}
        <path d="M50 16 C50 28, 48 40, 46 48" fill="none" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.3" strokeLinecap="round" />
        <path d="M70 16 C70 28, 72 40, 74 48" fill="none" stroke="#1a1a1a" strokeWidth="0.7" opacity="0.3" strokeLinecap="round" />
        <path d="M60 18 C60 30, 60 42, 60 48" fill="none" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />
        <path d="M36 54 C30 64, 26 72, 24 78" fill="none" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />
        <path d="M84 54 C90 64, 94 72, 96 78" fill="none" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />

        {/* Beards — fuzzy orange strokes */}
        <path d="M44 56 L38 66" stroke="#ffb74d" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M76 56 L82 66" stroke="#ffb74d" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M42 58 L40 64" stroke="#ffa726" strokeWidth="2" strokeLinecap="round" />
        <path d="M78 58 L80 64" stroke="#ffa726" strokeWidth="2" strokeLinecap="round" />

        {/* Centre */}
        <ellipse cx="60" cy="50" rx="6" ry="4" fill="#c5cae9" fillOpacity="0.7" stroke="#1a1a1a" strokeWidth="1.2" />
      </g>

      {/* Stem */}
      <path d="M60 76 C58 90, 60 106, 60 118" stroke="#33691e" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M57 94 C42 88, 32 92, 36 102 C44 98, 52 96, 57 96" fill="#558b2f" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   CHRYSANTHEMUM — Many thin petals, warm gold wash
   ════════════════════════════════════════════ */
function ChrysanthemumSVG({ id, size }) {
  const outerCount = 20;
  const midCount = 16;
  const innerCount = 10;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />
      <circle cx="60" cy="52" r="44" fill="#ffc107" opacity="0.2" filter={`url(#wash-${id})`} />

      <g filter={`url(#wc-${id})`}>
        {/* Outer long thin petals */}
        {[...Array(outerCount)].map((_, i) => {
          const a = (i * 360) / outerCount - 90;
          const r = (a * Math.PI) / 180;
          const sx = 60 + Math.cos(r) * 12;
          const sy = 52 + Math.sin(r) * 12;
          const ex = 60 + Math.cos(r) * 44;
          const ey = 52 + Math.sin(r) * 44;
          const off = i % 2 === 0 ? 0.18 : -0.18;
          const c1x = 60 + Math.cos(r + off) * 30;
          const c1y = 52 + Math.sin(r + off) * 30;
          const c2x = 60 + Math.cos(r - off) * 30;
          const c2y = 52 + Math.sin(r - off) * 30;
          return (
            <g key={`o${i}`}>
              <path
                d={`M${sx},${sy} Q${c1x},${c1y} ${ex},${ey} Q${c2x},${c2y} ${sx},${sy}`}
                fill={i % 3 === 0 ? '#ffc107' : i % 3 === 1 ? '#fdd835' : '#ffb300'}
                fillOpacity="0.55"
                stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" />
              <line x1={60 + Math.cos(r) * 14} y1={52 + Math.sin(r) * 14}
                x2={60 + Math.cos(r) * 38} y2={52 + Math.sin(r) * 38}
                stroke="#1a1a1a" strokeWidth="0.5" opacity="0.2" strokeLinecap="round" />
            </g>
          );
        })}

        {/* Mid petals */}
        {[...Array(midCount)].map((_, i) => {
          const a = (i * 360) / midCount - 80;
          const r = (a * Math.PI) / 180;
          const sx = 60 + Math.cos(r) * 8;
          const sy = 52 + Math.sin(r) * 8;
          const ex = 60 + Math.cos(r) * 30;
          const ey = 52 + Math.sin(r) * 30;
          const off = i % 2 === 0 ? 0.22 : -0.22;
          return (
            <path key={`m${i}`}
              d={`M${sx},${sy} Q${60 + Math.cos(r + off) * 20},${52 + Math.sin(r + off) * 20} ${ex},${ey} Q${60 + Math.cos(r - off) * 20},${52 + Math.sin(r - off) * 20} ${sx},${sy}`}
              fill={i % 2 === 0 ? '#ffe082' : '#ffca28'}
              fillOpacity="0.6"
              stroke="#1a1a1a" strokeWidth="1.3" strokeLinecap="round" />
          );
        })}

        {/* Inner petals */}
        {[...Array(innerCount)].map((_, i) => {
          const a = (i * 360) / innerCount - 70;
          const r = (a * Math.PI) / 180;
          const sx = 60 + Math.cos(r) * 5;
          const sy = 52 + Math.sin(r) * 5;
          const ex = 60 + Math.cos(r) * 18;
          const ey = 52 + Math.sin(r) * 18;
          return (
            <path key={`in${i}`}
              d={`M${sx},${sy} Q${60 + Math.cos(r + 0.3) * 12},${52 + Math.sin(r + 0.3) * 12} ${ex},${ey} Q${60 + Math.cos(r - 0.3) * 12},${52 + Math.sin(r - 0.3) * 12} ${sx},${sy}`}
              fill={i % 2 === 0 ? '#fff8e1' : '#ffe082'}
              fillOpacity="0.6"
              stroke="#1a1a1a" strokeWidth="1.1" strokeLinecap="round" />
          );
        })}

        {/* Centre */}
        <circle cx="60" cy="52" r="8" fill="#f57f17" fillOpacity="0.7" stroke="#1a1a1a" strokeWidth="1.5" />
        <circle cx="60" cy="52" r="5" fill="#e65100" fillOpacity="0.55" />
        <circle cx="58" cy="50" r="1.5" fill="#bf360c" opacity="0.4" />
        <circle cx="62" cy="53" r="1" fill="#bf360c" opacity="0.35" />
      </g>

      {/* Stem */}
      <path d="M60 82 C58 96, 60 108, 60 118" stroke="#33691e" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M63 98 C78 92, 88 96, 84 106 C76 102, 70 100, 63 100" fill="#689f38" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* ════════════════════════════════════════════
   ANEMONE — Rounded petals, dark navy centre, stamen ring
   ════════════════════════════════════════════ */
function AnemoneSVG({ id, size }) {
  const petalCount = 6;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />
      {/* Wash blob */}
      <circle cx="56" cy="52" r="40" fill="#90caf9" opacity="0.2" filter={`url(#wash-${id})`} />
      <ellipse cx="64" cy="48" rx="28" ry="32" fill="#64b5f6" opacity="0.15" filter={`url(#wash-${id})`} />

      <g filter={`url(#wc-${id})`}>
        {/* Back petals (slightly offset) */}
        {[...Array(petalCount)].map((_, i) => {
          const angle = (i * 360) / petalCount - 60;
          const rad = (angle * Math.PI) / 180;
          const sx = 60 + Math.cos(rad) * 12;
          const sy = 52 + Math.sin(rad) * 12;
          const ex = 60 + Math.cos(rad) * 42;
          const ey = 52 + Math.sin(rad) * 42;
          const cpD = 30;
          const cpOff = 0.5;
          return (
            <path key={`b${i}`}
              d={`M${sx},${sy} C${60 + Math.cos(rad + cpOff) * cpD},${52 + Math.sin(rad + cpOff) * cpD} ${ex + Math.cos(rad + 0.35) * 6},${ey + Math.sin(rad + 0.35) * 6} ${ex},${ey} C${ex + Math.cos(rad - 0.35) * 6},${ey + Math.sin(rad - 0.35) * 6} ${60 + Math.cos(rad - cpOff) * cpD},${52 + Math.sin(rad - cpOff) * cpD} ${sx},${sy}`}
              fill={i % 2 === 0 ? '#bbdefb' : '#90caf9'}
              fillOpacity="0.45"
              stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          );
        })}

        {/* Front petals */}
        {[...Array(petalCount)].map((_, i) => {
          const angle = (i * 360) / petalCount - 90;
          const rad = (angle * Math.PI) / 180;
          const sx = 60 + Math.cos(rad) * 10;
          const sy = 52 + Math.sin(rad) * 10;
          const ex = 60 + Math.cos(rad) * 40;
          const ey = 52 + Math.sin(rad) * 40;
          const cpD = 28;
          const cpOff = 0.48;
          const fillColor = i % 3 === 0 ? '#90caf9' : i % 3 === 1 ? '#64b5f6' : '#42a5f5';
          return (
            <g key={`f${i}`}>
              <path
                d={`M${sx},${sy} C${60 + Math.cos(rad + cpOff) * cpD},${52 + Math.sin(rad + cpOff) * cpD} ${ex + Math.cos(rad + 0.3) * 5},${ey + Math.sin(rad + 0.3) * 5} ${ex},${ey} C${ex + Math.cos(rad - 0.3) * 5},${ey + Math.sin(rad - 0.3) * 5} ${60 + Math.cos(rad - cpOff) * cpD},${52 + Math.sin(rad - cpOff) * cpD} ${sx},${sy}`}
                fill={fillColor}
                fillOpacity="0.55"
                stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              {/* Petal vein line */}
              <line
                x1={60 + Math.cos(rad) * 14} y1={52 + Math.sin(rad) * 14}
                x2={60 + Math.cos(rad) * 34} y2={52 + Math.sin(rad) * 34}
                stroke="#1a1a1a" strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />
            </g>
          );
        })}

        {/* Dark navy centre */}
        <circle cx="60" cy="52" r="14" fill="#1a237e" fillOpacity="0.85" stroke="#1a1a1a" strokeWidth="2.2" />
        <circle cx="60" cy="52" r="10" fill="#0d47a1" fillOpacity="0.65" stroke="none" />

        {/* Stamen ring */}
        {[...Array(12)].map((_, i) => {
          const a = (i * 360) / 12;
          const r = (a * Math.PI) / 180;
          return (
            <g key={`st${i}`}>
              <line x1={60 + Math.cos(r) * 6} y1={52 + Math.sin(r) * 6}
                x2={60 + Math.cos(r) * 10} y2={52 + Math.sin(r) * 10}
                stroke="#e8eaf6" strokeWidth="0.8" opacity="0.6" />
              <circle cx={60 + Math.cos(r) * 7} cy={52 + Math.sin(r) * 7} r="1.5"
                fill="#e8eaf6" fillOpacity="0.9" stroke="#1a1a1a" strokeWidth="0.5" />
            </g>
          );
        })}
        {/* Centre dot */}
        <circle cx="60" cy="52" r="3" fill="#0d47a1" fillOpacity="0.9" stroke="#1a1a1a" strokeWidth="0.8" />
      </g>

      {/* Stem */}
      <path d="M60 76 C58 90, 60 104, 60 118" stroke="#2e7d32" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M57 96 C42 90, 32 94, 36 104 C44 100, 52 98, 57 98" fill="#388e3c" fillOpacity="0.5" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
