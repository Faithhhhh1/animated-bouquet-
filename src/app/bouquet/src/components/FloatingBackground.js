'use client';

import { useState, useEffect } from 'react';
import FlowerSVG from './FlowerSVG';

const backgroundFlowers = [
  // Row 1 — top
  { id: 'rose', x: 5, y: 3, size: 150, rotate: -20, delay: 0, duration: 5 },
  { id: 'lavender', x: 35, y: 5, size: 120, rotate: 15, delay: 1.2, duration: 6.5 },
  { id: 'orchid', x: 65, y: 2, size: 140, rotate: 25, delay: 0.8, duration: 6 },
  { id: 'tulip', x: 88, y: 6, size: 130, rotate: -10, delay: 1.5, duration: 5.8 },

  // Row 2 — upper-mid
  { id: 'daisy', x: 15, y: 25, size: 125, rotate: -35, delay: 0.6, duration: 5.5 },
  { id: 'sunflower', x: 50, y: 22, size: 145, rotate: 10, delay: 0.5, duration: 5.5 },
  { id: 'peony', x: 80, y: 28, size: 135, rotate: 30, delay: 0.3, duration: 6.2 },

  // Row 3 — middle
  { id: 'iris', x: 3, y: 48, size: 120, rotate: 40, delay: 2.0, duration: 7 },
  { id: 'carnation', x: 30, y: 50, size: 130, rotate: -30, delay: 1.4, duration: 6 },
  { id: 'lily', x: 60, y: 46, size: 115, rotate: 55, delay: 2.2, duration: 5.3 },
  { id: 'anemone', x: 88, y: 50, size: 125, rotate: -45, delay: 1.8, duration: 5.2 },

  // Row 4 — lower-mid
  { id: 'chrysanthemum', x: 18, y: 72, size: 135, rotate: -20, delay: 1.0, duration: 6.8 },
  { id: 'rose', x: 48, y: 70, size: 120, rotate: 35, delay: 0.7, duration: 5.6 },
  { id: 'lavender', x: 78, y: 74, size: 125, rotate: -15, delay: 1.6, duration: 6.3 },

  // Row 5 — bottom
  { id: 'tulip', x: 6, y: 90, size: 130, rotate: 20, delay: 0.4, duration: 5.4 },
  { id: 'orchid', x: 40, y: 88, size: 140, rotate: -25, delay: 1.1, duration: 6.1 },
  { id: 'daisy', x: 70, y: 92, size: 115, rotate: 45, delay: 1.9, duration: 5.7 },
];

export default function FloatingBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {backgroundFlowers.map((flower, i) => (
        <div
          key={`bg-${flower.id}-${i}`}
          className="absolute"
          style={{
            left: `${flower.x}%`,
            top: `${flower.y}%`,
            opacity: 0.2,
            transform: `rotate(${flower.rotate}deg)`,
            animation: `bgFloat ${flower.duration}s ease-in-out ${flower.delay}s infinite`,
          }}
        >
          <FlowerSVG flowerId={flower.id} size={flower.size} />
        </div>
      ))}
    </div>
  );
}
