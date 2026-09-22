'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface BioParticlesHandle {
  burst: (x?: number, y?: number, count?: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
  color: string;
  isBurst?: boolean;
}

const colors = [
  'rgba(80, 250, 123, ',   // Bioluminescent moss green
  'rgba(0, 229, 255, ',    // Ghostly cyan
  'rgba(180, 255, 120, ',  // Fresh spore yellow-green
  'rgba(255, 230, 140, ',  // Dandelion pollen gold
  'rgba(140, 255, 218, ',  // Phosphor emerald
];

const createParticle = (width: number, height: number, customX?: number, customY?: number, isBurst = false): Particle => {
  const colorBase = colors[Math.floor(Math.random() * colors.length)];
  const size = isBurst ? Math.random() * 3 + 1.5 : Math.random() * 2.2 + 0.8;
  const angle = isBurst ? Math.random() * Math.PI * 2 : 0;
  const speed = isBurst ? Math.random() * 4 + 1.5 : 0;

  return {
    x: customX !== undefined ? customX : Math.random() * width,
    y: customY !== undefined ? customY : Math.random() * height,
    vx: isBurst ? Math.cos(angle) * speed : (Math.random() - 0.5) * 0.4,
    vy: isBurst ? Math.sin(angle) * speed : -(Math.random() * 0.5 + 0.2), // gentle upward buoyancy
    size,
    baseAlpha: Math.random() * 0.5 + 0.3,
    alpha: Math.random() * 0.5 + 0.3,
    pulseSpeed: Math.random() * 0.03 + 0.015,
    pulseOffset: Math.random() * Math.PI * 2,
    color: colorBase,
    isBurst,
  };
};

export const BioParticles = forwardRef<BioParticlesHandle, { className?: string }>(
  function BioParticles({ className = '' }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
    const particlesRef = useRef<Particle[]>([]);
    const animIdRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => ({
      burst: (x, y, count = 45) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const targetX = x ?? canvas.width / 2;
        const targetY = y ?? canvas.height / 2;
        for (let i = 0; i < count; i++) {
          particlesRef.current.push(createParticle(canvas.width, canvas.height, targetX, targetY, true));
        }
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      const count = Math.min(180, Math.floor((width * height) / 9000));
      particlesRef.current = Array.from({ length: count }, () => createParticle(width, height));

      const handleResize = () => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      };

      const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      };

      const handleMouseLeave = () => {
        mouseRef.current.active = false;
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);

      let frame = 0;
      const render = () => {
        frame++;
        ctx.clearRect(0, 0, width, height);

        const mouse = mouseRef.current;
        const particles = particlesRef.current;

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];

          // Pulsing glow
          p.alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(frame * p.pulseSpeed + p.pulseOffset));

          // Mouse interaction (repel & swirl)
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 130;

            if (dist < maxDist && dist > 0) {
              const force = (1 - dist / maxDist) * 1.8;
              p.vx += (dx / dist) * force * 0.6;
              p.vy += (dy / dist) * force * 0.6;
              // Add a bit of swirl
              p.vx += (-dy / dist) * force * 0.3;
              p.vy += (dx / dist) * force * 0.3;
            }
          }

          // Friction & natural movement
          if (p.isBurst) {
            p.vx *= 0.94;
            p.vy *= 0.94;
            p.baseAlpha -= 0.008;
            if (p.baseAlpha <= 0.05) {
              particles.splice(i, 1);
              continue;
            }
          } else {
            p.vx *= 0.98;
            p.vy = p.vy * 0.98 - 0.01; // gentle continuous lift
            if (p.vy < -1.2) p.vy = -1.2;

            // Subtle horizontal drift oscillation
            p.x += Math.sin(frame * 0.015 + p.pulseOffset) * 0.35;
          }

          p.x += p.vx;
          p.y += p.vy;

          // Wrap edges for ambient particles
          if (!p.isBurst) {
            if (p.y < -20) {
              p.y = height + 10;
              p.x = Math.random() * width;
            }
            if (p.x < -20) p.x = width + 10;
            if (p.x > width + 20) p.x = -10;
          }

          // Draw particle with outer bloom
          const fullColor = `${p.color}${Math.max(0, Math.min(1, p.alpha))})`;
          const glowColor = `${p.color}${Math.max(0, Math.min(1, p.alpha * 0.35))})`;

          // Outer halo
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = glowColor;
          ctx.fill();

          // Core bright spore
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = fullColor;
          ctx.fill();
        }

        animIdRef.current = requestAnimationFrame(render);
      };

      animIdRef.current = requestAnimationFrame(render);

      return () => {
        if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 z-10 w-full h-full ${className}`}
        style={{ mixBlendMode: 'screen' }}
      />
    );
  }
);
