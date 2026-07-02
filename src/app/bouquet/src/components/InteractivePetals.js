'use client';

import { useCallback, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useState, useEffect } from 'react';

export default function InteractivePetals() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setInit(true));
    }, []);

    const particlesLoaded = useCallback(async (container) => {
        // particles loaded
    }, []);

    const options = useMemo(() => ({
        fullScreen: false,
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: 'repulse',
                },
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4,
                    speed: 0.5,
                },
            },
        },
        particles: {
            number: {
                value: 35,
                density: {
                    enable: true,
                    area: 800,
                },
            },
            color: {
                value: ['#f4a0b5', '#e84057', '#ff8fa3', '#ffb3c1', '#f48fb1', '#ef9a9a', '#d4618c', '#f06292'],
            },
            shape: {
                type: 'circle',
            },
            opacity: {
                value: { min: 0.3, max: 0.7 },
                animation: {
                    enable: true,
                    speed: 0.5,
                    minimumValue: 0.2,
                    sync: false,
                },
            },
            size: {
                value: { min: 4, max: 12 },
                animation: {
                    enable: true,
                    speed: 1,
                    minimumValue: 3,
                    sync: false,
                },
            },
            move: {
                enable: true,
                speed: { min: 0.3, max: 1.2 },
                direction: 'bottom',
                outModes: {
                    default: 'out',
                    top: 'out',
                    bottom: 'out',
                    left: 'out',
                    right: 'out',
                },
                straight: false,
                drift: 0,
                random: true,
            },
            wobble: {
                enable: true,
                distance: 15,
                speed: 3,
            },
            tilt: {
                enable: true,
                direction: 'random',
                value: { min: 0, max: 360 },
                animation: {
                    enable: true,
                    speed: 5,
                },
            },
            roll: {
                darken: {
                    enable: true,
                    value: 20,
                },
                enable: true,
                speed: { min: 5, max: 15 },
            },
            shadow: {
                blur: 4,
                color: { value: '#ff8fa3' },
                enable: true,
                offset: { x: 1, y: 2 },
            },
        },
        detectRetina: true,
    }), []);

    if (!init) return null;

    return (
        <div className="fixed inset-0 z-[5] pointer-events-none">
            <Particles
                id="petal-particles"
                particlesLoaded={particlesLoaded}
                options={options}
                style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
            />
        </div>
    );
}
