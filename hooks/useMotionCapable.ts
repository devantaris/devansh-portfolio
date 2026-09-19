'use client';

import { useEffect, useState } from 'react';

/**
 * True when the device can afford heavy motion: fine pointer (desktop),
 * viewport wide enough, no touch screen, and the user hasn't asked for
 * reduced motion. Heavy canvases / scroll-jacks should no-op when false.
 */
export function useMotionCapable(): boolean {
    const [capable, setCapable] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(pointer: fine)');
        const wide = window.matchMedia('(min-width: 769px)');
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

        const update = () => setCapable(mq.matches && wide.matches && !reduced.matches && !('ontouchstart' in window && window.innerWidth <= 1024));
        update();

        mq.addEventListener('change', update);
        wide.addEventListener('change', update);
        reduced.addEventListener('change', update);
        return () => {
            mq.removeEventListener('change', update);
            wide.removeEventListener('change', update);
            reduced.removeEventListener('change', update);
        };
    }, []);

    return capable;
}
