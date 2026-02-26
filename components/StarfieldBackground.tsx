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

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.00025);

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 20, 100);

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8;

    // ── Post-processing (bloom) ──
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(
      new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.5,  // strength — subtle glow
        0.4,  // radius
        0.6   // threshold
      )
    );

    // ── Stars ──
    const starLayers: THREE.Points[] = [];
    const STAR_COUNT = 5000;

    for (let layerIdx = 0; layerIdx < 3; layerIdx++) {
      const positions = new Float32Array(STAR_COUNT * 3);
      const colors = new Float32Array(STAR_COUNT * 3);
      const sizes = new Float32Array(STAR_COUNT);

      for (let j = 0; j < STAR_COUNT; j++) {
        // Spherically distributed
        const radius = 200 + Math.random() * 800;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[j * 3 + 2] = radius * Math.cos(phi);

        // Color variation: mostly white, some warm, some blue
        const color = new THREE.Color();
        const r = Math.random();
        if (r < 0.7) {
          color.setHSL(0, 0, 0.8 + Math.random() * 0.2);
        } else if (r < 0.9) {
          color.setHSL(0.08, 0.5, 0.8);
        } else {
          color.setHSL(0.6, 0.5, 0.8);
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
        uniforms: {
          time: { value: 0 },
          depth: { value: layerIdx },
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          uniform float depth;

          void main() {
            vColor = color;
            vec3 pos = position;

            // Slow rotation per layer
            float angle = time * 0.05 * (1.0 - depth * 0.3);
            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            pos.xy = rot * pos.xy;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;

          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;

            float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
            gl_FragColor = vec4(vColor, opacity);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      starLayers.push(points);
    }

    // ── Subtle atmosphere sphere (glow) ──
    const atmosphereGeo = new THREE.SphereGeometry(600, 32, 32);
    const atmosphereMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform float time;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
          float pulse = sin(time * 2.0) * 0.1 + 0.9;
          atmosphere *= pulse;
          gl_FragColor = vec4(atmosphere, intensity * 0.03); // Reduced atmosphere glow
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphere);

    // ── Scroll state ──
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ── Mouse parallax ──
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ── Animation loop ──
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Update star shader time
      starLayers.forEach((layer) => {
        if (layer.material instanceof THREE.ShaderMaterial) {
          layer.material.uniforms.time.value = time;
        }
      });

      // Update atmosphere
      if (atmosphereMat.uniforms) {
        atmosphereMat.uniforms.time.value = time;
      }

      // Calculate scroll-based camera target
      const docHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = Math.min(scrollY / docHeight, 1);

      // Camera moves deeper into the starfield as user scrolls
      const targetX = mouseX * 8;
      const targetY = 30 - progress * 20 + mouseY * 5;
      const targetZ = 100 - progress * 150; // zoom into the stars

      // Smooth camera movement
      const smooth = 0.04;
      smoothCameraPos.current.x += (targetX - smoothCameraPos.current.x) * smooth;
      smoothCameraPos.current.y += (targetY - smoothCameraPos.current.y) * smooth;
      smoothCameraPos.current.z += (targetZ - smoothCameraPos.current.z) * smooth;

      // Add subtle floating
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
      atmosphereGeo.dispose();
      atmosphereMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 pointer-events-none"
      style={{ background: '#030014' }}
    />
  );
}
