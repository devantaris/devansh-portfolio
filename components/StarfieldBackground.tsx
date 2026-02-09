'use client';

import { useEffect, useRef } from 'react';

export default function MultiLayerStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Star layers with different depths
    interface Star {
      x: number;
      y: number;
      z: number; // depth layer (1 = far, 3 = near)
      size: number;
      opacity: number;
      speedX: number;
      speedY: number;
    }

    const stars: Star[] = [];
    const starCounts = { far: 150, mid: 80, near: 40 }; // Reduced density for cleaner look

    // Initialize stars
    const initStars = () => {
      stars.length = 0;

      // Far stars (background) - very subtle
      for (let i = 0; i < starCounts.far; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: 1,
          size: Math.random() * 0.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.2,
          speedX: (Math.random() - 0.5) * 0.01, // Reduced from 0.02
          speedY: (Math.random() - 0.5) * 0.01,
        });
      }

      // Mid-ground stars - subtle
      for (let i = 0; i < starCounts.mid; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: 2,
          size: Math.random() * 1 + 0.8,
          opacity: Math.random() * 0.4 + 0.3,
          speedX: (Math.random() - 0.5) * 0.025, // Reduced from 0.05
          speedY: (Math.random() - 0.5) * 0.025,
        });
      }

      // Foreground stars - still subtle
      for (let i = 0; i < starCounts.near; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: 3,
          size: Math.random() * 1.5 + 1,
          opacity: Math.random() * 0.5 + 0.4,
          speedX: (Math.random() - 0.5) * 0.05, // Reduced from 0.1
          speedY: (Math.random() - 0.5) * 0.05,
        });
      }
    };

    initStars();

    // Mouse position for parallax
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Apply VERY SUBTLE parallax (matching edwinle.com intensity)
        const parallaxX = mouseX * star.z * 3; // Reduced from 10 to 3
        const parallaxY = (mouseY * star.z * 3) + (scrollY * star.z * 0.05); // Reduced multipliers

        // Drift over time (very slow)
        star.x += star.speedX;
        star.y += star.speedY;

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Calculate render position
        const renderX = star.x + parallaxX;
        const renderY = star.y + parallaxY;

        // Draw star with glow
        ctx.beginPath();

        // Outer glow (violet tint)
        const gradient = ctx.createRadialGradient(
          renderX, renderY, 0,
          renderX, renderY, star.size * 3
        );
        gradient.addColorStop(0, `rgba(200, 180, 220, ${star.opacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(124, 111, 181, ${star.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(124, 111, 181, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(
          renderX - star.size * 3,
          renderY - star.size * 3,
          star.size * 6,
          star.size * 6
        );

        // Core star
        ctx.beginPath();
        ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 pointer-events-none"
      style={{ background: '#0a0a0f' }}
    />
  );
}
