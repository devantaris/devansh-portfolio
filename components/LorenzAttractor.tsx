'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LorenzAttractor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 95);

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        // Lorenz Attractor Parameters
        const sigma = 10;
        const beta = 8/3;
        let rho = 28;
        let targetRho = 28;

        const numParticles = 14000;
        const positions = new Float32Array(numParticles * 3);
        const colors = new Float32Array(numParticles * 3);
        
        const coords = Array.from({ length: numParticles }, () => ({
            x: (Math.random() - 0.5) * 40,
            y: (Math.random() - 0.5) * 40,
            z: Math.random() * 50
        }));

        // Vibrant high-fashion HSL colors
        const colorPalette = [
            new THREE.Color('#00e5ff'), // Radioactive Cyan HSL
            new THREE.Color('#b500fa'), // Cosmic Violet HSL
            new THREE.Color('#ff5500')  // Solar Amber HSL
        ];

        for (let i = 0; i < numParticles; i++) {
            positions[i * 3] = coords[i].x;
            positions[i * 3 + 1] = coords[i].y;
            positions[i * 3 + 2] = coords[i].z;

            const mixRatio = i / numParticles;
            const color = new THREE.Color();
            if (mixRatio < 0.5) {
                color.copy(colorPalette[0]).lerp(colorPalette[1], mixRatio * 2);
            } else {
                color.copy(colorPalette[1]).lerp(colorPalette[2], (mixRatio - 0.5) * 2);
            }

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0, 0) }
            },
            vertexShader: `
                attribute vec3 color;
                uniform float uTime;
                uniform vec2 uMouse;
                
                varying vec3 vColor;
                varying float vDist;

                void main() {
                    vColor = color;
                    vec3 pos = position;

                    // Continuous wave
                    pos.x += sin(pos.z * 0.05 + uTime) * 0.4;
                    pos.y += cos(pos.x * 0.05 + uTime) * 0.4;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    vec4 projectedPos = projectionMatrix * mvPosition;

                    vec2 ndcPos = projectedPos.xy / projectedPos.w;
                    float dist = length(ndcPos - uMouse);
                    vDist = dist;

                    float sizeMultiplier = 1.0;
                    if (dist < 0.4 && dist > 0.001) {
                        sizeMultiplier = 1.0 + (0.4 - dist) * 2.5;
                        projectedPos.xy += normalize(ndcPos - uMouse) * (0.4 - dist) * 0.08 * projectedPos.w;
                    }

                    gl_PointSize = sizeMultiplier * 1.1 * (300.0 / max(0.1, -mvPosition.z));
                    gl_Position = projectedPos;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vDist;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = (1.0 - smoothstep(0.0, 0.5, dist));
                    
                    float glow = 1.0;
                    if (vDist < 0.4) {
                        glow = 1.0 + (0.4 - vDist) * 1.2;
                    }

                    gl_FragColor = vec4(vColor * glow, alpha * 0.85);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // Interaction coordinates & Inertia Drag variables
        let mouseX = 0;
        let mouseY = 0;
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        let rotSpeedX = 0;
        let rotSpeedY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
            mouseY = -((e.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

            if (isDragging) {
                const deltaMove = {
                    x: e.clientX - previousMousePosition.x,
                    y: e.clientY - previousMousePosition.y
                };
                
                // Inject rotation speed (momentum) on drag
                rotSpeedY = deltaMove.x * 0.006;
                rotSpeedX = deltaMove.y * 0.006;
            }

            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        };

        const handleMouseDown = (e: MouseEvent) => {
            isDragging = true;
            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        };

        const handleMouseUp = () => {
            isDragging = false;
        };

        const handleScroll = () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            targetRho = 28 + scrollPercent * 40;
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Touch support
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                isDragging = true;
                previousMousePosition = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging && e.touches.length > 0) {
                const deltaMove = {
                    x: e.touches[0].clientX - previousMousePosition.x,
                    y: e.touches[0].clientY - previousMousePosition.y
                };
                rotSpeedY = deltaMove.x * 0.01;
                rotSpeedX = deltaMove.y * 0.01;
                
                previousMousePosition = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
            }
        };

        canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
        canvas.addEventListener('touchend', handleMouseUp);

        // Animation Loop
        let animId: number;
        let isVisible = true;
        const intersectionObserver = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
        }, { threshold: 0.02 });
        intersectionObserver.observe(canvas);

        const clock = new THREE.Clock();
        const dt = 0.007;

        const animate = () => {
            animId = requestAnimationFrame(animate);
            if (!isVisible) return;
            const time = clock.getElapsedTime();

            rho += (targetRho - rho) * 0.05;

            const posAttr = geometry.attributes.position;
            const posArray = posAttr.array as Float32Array;

            for (let i = 0; i < numParticles; i++) {
                const c = coords[i];

                const dx = sigma * (c.y - c.x) * dt;
                const dy = (c.x * (rho - c.z) - c.y) * dt;
                const dz = (c.x * c.y - beta * c.z) * dt;

                c.x += dx;
                c.y += dy;
                c.z += dz;

                if (Math.abs(c.x) > 150 || Math.abs(c.y) > 150 || c.z > 200) {
                    c.x = (Math.random() - 0.5) * 20;
                    c.y = (Math.random() - 0.5) * 20;
                    c.z = Math.random() * 40;
                }

                posArray[i * 3] = c.x;
                posArray[i * 3 + 1] = c.y;
                posArray[i * 3 + 2] = c.z - 25;
            }

            posAttr.needsUpdate = true;

            // Apply drag rotations with momentum decay friction (friction coefficient = 0.94)
            points.rotation.y += rotSpeedY;
            points.rotation.x += rotSpeedX;
            
            rotSpeedY *= 0.94;
            rotSpeedX *= 0.94;

            // Subtle default drift when not dragging
            if (!isDragging) {
                points.rotation.y += 0.0035;
            }

            material.uniforms.uTime.value = time;
            material.uniforms.uMouse.value.set(mouseX, mouseY);

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        };

        const resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(canvas);

        return () => {
            cancelAnimationFrame(animId);
            intersectionObserver.disconnect();
            canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('scroll', handleScroll);
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleMouseUp);
            resizeObserver.disconnect();
            
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            style={{ 
                width: '100%', 
                height: '100%', 
                display: 'block',
                cursor: 'grab' // Grab cursor to hint that it is fully drag-interactive!
            }} 
        />
    );
}
