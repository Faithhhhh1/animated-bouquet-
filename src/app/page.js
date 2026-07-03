'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FlowerSVG from '@/components/FlowerSVG';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Main content */}
      <div className="relative z-10 text-center max-w-lg">
        {/* Animated hero flower */}
        <div className={`mx-auto mb-6 transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="animate-float">
            <FlowerSVG flowerId="rose" size={100} />
          </div>
        </div>

        {/* Title */}
        <h1
          className={`font-script text-7xl md:text-9xl mb-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          style={{ color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,180,200,0.4), 0 2px 10px rgba(140,40,70,0.6)' }}
        >
          Bloomshire
        </h1>

        {/* Tagline */}
        <p
          className={`font-display text-sm md:text-base tracking-[0.25em] mb-12 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          style={{ color: 'rgba(255,255,255,0.85)' }}
        >
          BEAUTIFUL FLOWERS<br />DELIVERED DIGITALLY
        </p>

        {/* CTA Buttons */}
        <div
          className={`space-y-4 transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <Link href="/animated-bouquet/build" className="romantic-btn-primary block mx-auto max-w-xs text-center">
            BUILD A BOUQUET
          </Link>

          <Link href="/build?bw=true" className="romantic-btn-secondary block mx-auto max-w-xs text-center">
            BUILD IT IN BLACK AND WHITE
          </Link>

          <Link href="/animated-bouquet/garden" className="romantic-btn-ghost block mx-auto">
            VIEW GARDEN
          </Link>
        </div>
      </div>
    </main>
  );
}
