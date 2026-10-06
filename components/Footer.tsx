'use client';

import { withBasePath } from '@/lib/content';

export default function Footer() {
    return (
        <footer 
            id="footer" 
            className="relative w-full overflow-hidden"
            style={{
                background: '#383b34',
                position: 'relative',
                minHeight: '100vh',
            }}
        >
            {/* Seamless gradient bridge from black to forest floor */}
            <div 
                className="w-full h-24 pointer-events-none absolute top-0 left-0 right-0 z-20"
                style={{
                    background: 'linear-gradient(to bottom, #020204 0%, rgba(56, 59, 52, 0.4) 60%, transparent 100%)',
                }}
            />

            {/* Living World Interactive Footer Stage */}
            <iframe
                src={withBasePath('/footer.html')}
                title="Living World Interactive Footer"
                className="w-full border-0 block"
                style={{
                    width: '100%',
                    height: '100vh',
                    minHeight: '880px',
                    display: 'block',
                    border: 'none',
                }}
                loading="lazy"
            />
        </footer>
    );
}
