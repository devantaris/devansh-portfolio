import { useEffect, useState, RefObject } from 'react';

interface CursorProximity {
    distance: number;
    proximity: number; // 0 = far, 1 = very close
}

export function useCursorProximity(ref: RefObject<HTMLElement | null>, maxDistance: number = 200): CursorProximity {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [proximity, setProximity] = useState({ distance: maxDistance, proximity: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;
        const rect = element.getBoundingClientRect();

        // Calculate center of element
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from cursor to element center
        const dx = cursorPos.x - centerX;
        const dy = cursorPos.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Normalize proximity (1 at center, 0 at maxDistance or beyond)
        const normalizedProximity = Math.max(0, 1 - distance / maxDistance);

        setProximity({
            distance,
            proximity: normalizedProximity,
        });
    }, [cursorPos, ref, maxDistance]);

    return proximity;
}
