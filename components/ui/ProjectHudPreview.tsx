'use client';

import { useEffect, useRef } from 'react';
import { Project } from '@/lib/content';
import { renderProjectHud } from '@/lib/projectHudRenderer';

interface ProjectHudPreviewProps {
    project: Project;
    className?: string;
}

export default function ProjectHudPreview({ project, className }: ProjectHudPreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        let isVisible = true;
        let lastRender = 0;
        const startTime = performance.now();

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
            },
            { threshold: 0.05 }
        );
        observer.observe(canvas);

        const loop = (now: number) => {
            animId = requestAnimationFrame(loop);
            if (!isVisible || document.hidden) return;

            // Throttle to 30fps for crispness with minimal CPU/GPU load
            if (now - lastRender < 32) return;
            lastRender = now;

            const time = (now - startTime) * 0.001;
            renderProjectHud(ctx, project, canvas.width, canvas.height, time);
        };

        animId = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animId);
            observer.disconnect();
        };
    }, [project]);

    return (
        <canvas
            ref={canvasRef}
            width={1520}
            height={880}
            className={className}
            style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '38 / 22',
                display: 'block',
                borderRadius: '4px',
                border: `1px solid ${project.color}35`,
                background: '#040407',
            }}
        />
    );
}
