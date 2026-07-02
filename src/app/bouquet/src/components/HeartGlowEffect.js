'use client';

import { useEffect, useState } from 'react';

export default function HeartGlowEffect() {
    const [hearts, setHearts] = useState([]);

    useEffect(() => {
        const count = 8;
        const newHearts = Array.from({ length: count }, (_, i) => ({
            id: i,
            left: 10 + Math.random() * 80,
            top: 10 + Math.random() * 80,
            size: 20 + Math.random() * 40,
            delay: Math.random() * 6,
            duration: 3 + Math.random() * 4,
            opacity: 0.15 + Math.random() * 0.2,
        }));
        setHearts(newHearts);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden" aria-hidden="true">
            {hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="absolute"
                    style={{
                        left: `${heart.left}%`,
                        top: `${heart.top}%`,
                        animation: `heartPulse ${heart.duration}s ease-in-out ${heart.delay}s infinite`,
                        opacity: 0,
                    }}
                >
                    <svg
                        width={heart.size}
                        height={heart.size}
                        viewBox="0 0 50 50"
                        style={{
                            filter: `drop-shadow(0 0 ${heart.size / 3}px rgba(255,100,150,0.6))`,
                        }}
                    >
                        <path
                            d="M25,42 C25,42 5,30 5,18 C5,10 12,5 19,5 C22,5 25,7 25,10 C25,7 28,5 31,5 C38,5 45,10 45,18 C45,30 25,42 25,42 Z"
                            fill="rgba(255,130,170,0.5)"
                            stroke="rgba(255,180,200,0.4)"
                            strokeWidth="1"
                        />
                    </svg>
                </div>
            ))}

            <style jsx>{`
        @keyframes heartPulse {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          30% {
            opacity: var(--heart-opacity, 0.3);
            transform: scale(1);
          }
          50% {
            opacity: var(--heart-opacity, 0.3);
            transform: scale(1.15);
          }
          70% {
            opacity: var(--heart-opacity, 0.3);
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.3);
          }
        }
      `}</style>
        </div>
    );
}
