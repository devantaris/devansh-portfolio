'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default function MultiLayerStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Scene ── pure black, no fog tint
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.00015);

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 20, 100);

    // ── Renderer ── pure black clear color
    const isMobile = window.innerWidth <= 768;
    // Cap pixel ratio to 1.5 on desktop to keep post-processing fast, 1 on mobile
    const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false, // Antialiasing is expensive and unnecessary for Points
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 1); // Pure black
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // ── Post-processing — bloom only on bright stars (DISABLED ON MOBILE) ──
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(pixelRatio); // Prevents default scaling on heavy high-DPI displays
    composer.addPass(new RenderPass(scene, camera));

    // Only add the expensive Bloom pass on Desktop
    if (!isMobile) {
      composer.addPass(
        new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          0.4,  // strength — gentle glow on stars only
          0.3,  // radius
          0.85  // threshold — high so only bright stars bloom
        )
      );
    }

    // ── Stars ──
    const starLayers: THREE.Points[] = [];

    // Reduce overall star count to half, heavily reducing slower moving stars (higher depth)
    const getLayerStarCount = (layerIdx: number) => {
      // Drastically reduce star count on mobile to prevent crashes
      const base = isMobile ? 0.25 : 1;

      if (layerIdx === 0) return Math.floor(4000 * base); // Fastest moving (front)
      if (layerIdx === 1) return Math.floor(2000 * base); // Medium speed
      if (layerIdx === 2) return Math.floor(1500 * base); // Slowest moving (back)
      return Math.floor(1500 * base);
    };

    for (let layerIdx = 0; layerIdx < 3; layerIdx++) {
      const STAR_COUNT = getLayerStarCount(layerIdx);
      const positions = new Float32Array(STAR_COUNT * 3);
      const colors = new Float32Array(STAR_COUNT * 3);
      const sizes = new Float32Array(STAR_COUNT);

      for (let j = 0; j < STAR_COUNT; j++) {
        // Spherically distributed. Using a power function pushes more stars outward, reducing center density.
        const radius = 100 + Math.pow(Math.random(), 0.5) * 800;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[j * 3 + 2] = radius * Math.cos(phi);

        // Color: mostly pure white, some warm, some cool blue tint
        const color = new THREE.Color();
        const r = Math.random();
        if (r < 0.75) {
          color.setHSL(0, 0, 0.85 + Math.random() * 0.15); // white
        } else if (r < 0.9) {
          color.setHSL(0.08, 0.3, 0.85); // warm white
        } else {
          color.setHSL(0.6, 0.2, 0.85); // cool white (subtle)
        }
        colors[j * 3] = color.r;
        colors[j * 3 + 1] = color.g;
        colors[j * 3 + 2] = color.b;

        sizes[j] = Math.random() * 3 + 1;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        precision: 'highp',
        uniforms: {
          time: { value: 0 },
          depth: { value: layerIdx },
          uMouse: { value: new THREE.Vector2(-1000, -1000) },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vBlurAmount;
          uniform float time;
          uniform float depth;
          uniform vec2 uMouse;
          uniform vec2 uResolution;

          void main() {
            vColor = color;
            vec3 pos = position;

            // Slow rotation per layer
            float angle = time * 0.05 * (1.0 - depth * 0.3);
            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            pos.xy = rot * pos.xy;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            vec4 projectedPos = projectionMatrix * mvPosition;
            
            // Calculate blur amount based on distance to mouse
            vec2 ndcPos = projectedPos.xy / projectedPos.w;
            vec2 screenPos = vec2(
              (ndcPos.x * 0.5 + 0.5) * uResolution.x,
              (1.0 - (ndcPos.y * 0.5 + 0.5)) * uResolution.y
            );
            
            float distToMouse = length(screenPos - uMouse);
            // Radius of 120px clear, blurring out to 300px
            vBlurAmount = smoothstep(120.0, 300.0, distToMouse);

            float baseSize = size * (300.0 / -mvPosition.z);
            // Increase size for blurred stars up to 2.5x, making them look out of focus
            gl_PointSize = baseSize * (1.0 + vBlurAmount * 1.5);
            
            gl_Position = projectedPos;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vBlurAmount;

          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;

            float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
            // Faint down the blurred stars to keep brightness balanced
            opacity *= mix(1.0, 0.25, vBlurAmount);
            
            gl_FragColor = vec4(vColor, opacity);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false, // Disabling depth test skips Z-buffer reading for performance
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      starLayers.push(points);
    }

    // NO atmosphere sphere — pure black space

    // ── Scroll state ──
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ── Mouse parallax ──
    let mouseX = 0;
    let mouseY = 0;
    let clientX = -1000;
    let clientY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      clientX = e.clientX;
      clientY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ── Animation loop ──
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      // Update star shader uniforms
      starLayers.forEach((layer) => {
        if (layer.material instanceof THREE.ShaderMaterial) {
          layer.material.uniforms.time.value = time;
          layer.material.uniforms.uMouse.value.set(clientX, clientY);
          layer.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }
      });

      // Calculate scroll-based camera target
      const docHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = Math.min(scrollY / docHeight, 1);

      // Camera moves deeper into the starfield as user scrolls
      const targetX = mouseX * 8;
      const targetY = 30 - progress * 20 + mouseY * 5;
      const targetZ = 100 - progress * 150;

      // Smooth camera movement
      const smooth = 0.04;
      smoothCameraPos.current.x += (targetX - smoothCameraPos.current.x) * smooth;
      smoothCameraPos.current.y += (targetY - smoothCameraPos.current.y) * smooth;
      smoothCameraPos.current.z += (targetZ - smoothCameraPos.current.z) * smooth;

      // Subtle floating
      const floatX = Math.sin(time * 0.1) * 2;
      const floatY = Math.cos(time * 0.15) * 1;

      camera.position.x = smoothCameraPos.current.x + floatX;
      camera.position.y = smoothCameraPos.current.y + floatY;
      camera.position.z = smoothCameraPos.current.z;
      camera.lookAt(0, 10, -600);

      composer.render();
    };

    animate();

    // ── Resize ──
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);

      starLayers.forEach((s) => {
        s.geometry.dispose();
        (s.material as THREE.ShaderMaterial).dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 pointer-events-none"
      style={{ background: '#000000' }}
    />
  );
}
