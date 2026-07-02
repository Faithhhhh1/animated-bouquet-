'use client';

import { useEffect, useState } from 'react';

const petalColors = [
  '#f4a0b5', '#e84057', '#ff8fa3', '#ffb3c1', '#f48fb1',
  '#ef9a9a', '#e57373', '#d4618c', '#f06292', '#ec407a',
  '#ff6b8a', '#ff9eb5', '#ffc1cc', '#e8899a',
];

export default function PetalAnimation({ active = true, intensity = 'medium' }) {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    if (!active) return;

    const count = intensity === 'light' ? 12 : intensity === 'heavy' ? 30 : 20;

    const newPetals = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      size: 10 + Math.random() * 15,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      rotation: Math.random() * 360,
      swayAmount: 20 + Math.random() * 60,
      opacity: 0.4 + Math.random() * 0.5,
    }));

    setPetals(newPetals);
  }, [active, intensity]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal"
          style={{
            left: `${petal.left}%`,
            animation: `petalDrift ${petal.duration}s ease-in-out ${petal.delay}s infinite`,
          }}
        >
          <div
            className="petal-shape"
            style={{
              width: petal.size,
              height: petal.size * 1.3,
              backgroundColor: petal.color,
              transform: `rotate(${petal.rotation}deg)`,
              opacity: petal.opacity,
              borderRadius: '50% 0 50% 50%',
              boxShadow: `0 0 4px ${petal.color}40`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
