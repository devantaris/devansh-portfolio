'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LorenzAttractor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Scene setup
        const scene = new THREE.Scene();
        
        // Perspective Camera
        const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 95);

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Lorenz Attractor Parameters
        // Standard chaotic values: sigma = 10, beta = 8/3 (2.667), rho = 28
        let sigma = 10;
        let beta = 8/3;
        let rho = 28;

        // Dynamic targets that change with scroll
        let targetRho = 28;

        // Particles setup
        const numParticles = 15000;
        const positions = new Float32Array(numParticles * 3);
        const colors = new Float32Array(numParticles * 3);
        
        // Track individual coordinates for integration
        const coords = Array.from({ length: numParticles }, () => ({
            x: (Math.random() - 0.5) * 40,
            y: (Math.random() - 0.5) * 40,
            z: Math.random() * 50
        }));

        const colorPalette = [
            new THREE.Color('#00f5ff'), // Radioactive Cyan
            new THREE.Color('#bd00ff'), // Cosmic Purple
            new THREE.Color('#ff5700')  // Solar Orange
        ];

        for (let i = 0; i < numParticles; i++) {
            positions[i * 3] = coords[i].x;
            positions[i * 3 + 1] = coords[i].y;
            positions[i * 3 + 2] = coords[i].z;

            // Gradient distribution
            const mixRatio = i / numParticles;
            let color = new THREE.Color();
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

        // Custom Shader Material for glowing responsive particles
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uHoverRadius: { value: 30.0 }
            },
            vertexShader: `
                uniform float uTime;
                uniform vec2 uMouse;
                uniform float uHoverRadius;
                
                varying vec3 vColor;
                varying float vDist;

                void main() {
                    vColor = color;
                    vec3 pos = position;

                    // Subtle continuous flow wave
                    pos.x += sin(pos.z * 0.05 + uTime) * 0.4;
                    pos.y += cos(pos.x * 0.05 + uTime) * 0.4;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    vec4 projectedPos = projectionMatrix * mvPosition;

                    // Interaction tracking
                    vec2 ndcPos = projectedPos.xy / projectedPos.w;
                    float dist = length(ndcPos - uMouse);
                    vDist = dist;

                    // Magnify particles close to the mouse
                    float sizeMultiplier = 1.0;
                    if (dist < 0.4) {
                        sizeMultiplier = 1.0 + (0.4 - dist) * 3.5;
                        projectedPos.xy += normalize(ndcPos - uMouse) * (0.4 - dist) * 0.1 * projectedPos.w;
                    }

                    gl_PointSize = sizeMultiplier * 2.8 * (300.0 / -mvPosition.z);
                    gl_Position = projectedPos;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vDist;

                void main() {
                    // Turn squares into circles
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    // Neon core center highlight
                    float alpha = (1.0 - smoothstep(0.0, 0.5, dist));
                    
                    // Extra glow factor if close to interaction
                    float glow = 1.0;
                    if (vDist < 0.4) {
                        glow = 1.0 + (0.4 - vDist) * 1.5;
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

        // Interaction States
        let mouseX = 0;
        let mouseY = 0;
        let targetRotX = 0;
        let targetRotY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            // Normalized Device Coordinates [-1, 1]
            mouseX = ((e.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
            mouseY = -((e.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

            targetRotY = mouseX * 0.4;
            targetRotX = -mouseY * 0.4;
        };

        const handleScroll = () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            // Dynamic morph: rho increases on scroll, widening the chaotic orbit wings!
            targetRho = 28 + scrollPercent * 40;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Animation Loop
        let animId: number;
        const clock = new THREE.Clock();
        const dt = 0.007; // Integration step size

        const animate = () => {
            animId = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            // Interpolate lorenz values toward dynamic scroll states
            rho += (targetRho - rho) * 0.05;

            // Read geometry position attribute
            const posAttr = geometry.attributes.position;
            const posArray = posAttr.array as Float32Array;

            // Integrate chaotic paths
            for (let i = 0; i < numParticles; i++) {
                const c = coords[i];

                // Lorenz equations system
                const dx = sigma * (c.y - c.x) * dt;
                const dy = (c.x * (rho - c.z) - c.y) * dt;
                const dz = (c.x * c.y - beta * c.z) * dt;

                c.x += dx;
                c.y += dy;
                c.z += dz;

                // Reset particles if they fly off out of chaotic boundaries
                if (Math.abs(c.x) > 150 || Math.abs(c.y) > 150 || c.z > 200) {
                    c.x = (Math.random() - 0.5) * 20;
                    c.y = (Math.random() - 0.5) * 20;
                    c.z = Math.random() * 40;
                }

                // Center coordinates vertically on visualization
                posArray[i * 3] = c.x;
                posArray[i * 3 + 1] = c.y;
                posArray[i * 3 + 2] = c.z - 25; // Shift z coordinate slightly down
            }

            posAttr.needsUpdate = true;

            // Smooth rotation interpolation
            points.rotation.y += (targetRotY - points.rotation.y) * 0.05;
            points.rotation.x += (targetRotX - points.rotation.x) * 0.05;

            // Add standard rotation drift
            points.rotation.y += 0.002;

            // Update shader uniform states
            material.uniforms.uTime.value = time;
            material.uniforms.uMouse.value.set(mouseX, mouseY);

            renderer.render(scene, camera);
        };

        animate();

        // Handle Resize
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
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
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
                filter: 'drop-shadow(0 0 50px rgba(0, 245, 255, 0.15))'
            }} 
        />
    );
}
