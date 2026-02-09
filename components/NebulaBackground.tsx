'use client';

import { useEffect, useState } from 'react';

export default function NebulaBackground() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            {/* Large nebula gradients with parallax */}
            <div
                className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-[0.08]"
                style={{
                    background: 'radial-gradient(circle, rgba(124, 111, 181, 0.6) 0%, rgba(74, 95, 199, 0.3) 50%, transparent 70%)',
                    top: `${20 - scrollY * 0.3}%`,
                    left: '10%',
                    transform: 'translate(-50%, -50%)',
                }}
            />

            <div
                className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-[0.06]"
                style={{
                    background: 'radial-gradient(circle, rgba(157, 143, 199, 0.5) 0%, rgba(124, 111, 181, 0.2) 60%, transparent 80%)',
                    top: `${60 - scrollY * 0.2}%`,
                    right: '15%',
                    transform: 'translate(50%, -50%)',
                }}
            />

            <div
                className="absolute w-[700px] h-[700px] rounded-full blur-[110px] opacity-[0.05]"
                style={{
                    background: 'radial-gradient(circle, rgba(74, 95, 199, 0.4) 0%, rgba(124, 111, 181, 0.2) 50%, transparent 75%)',
                    bottom: `${-20 - scrollY * 0.15}%`,
                    left: '50%',
                    transform: 'translate(-50%, 50%)',
                }}
            />
        </div>
    );
}
