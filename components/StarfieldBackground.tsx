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
    scene.fog = new THREE.FogExp2(0x020205, 0.001); // Subtle cyber-midnight fog

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 20, 100);

    // ── Renderer ──
    const isMobile = window.innerWidth <= 768;
    const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x020205, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // ── Post-processing ──
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(pixelRatio);
    composer.addPass(new RenderPass(scene, camera));

    if (!isMobile) {
      composer.addPass(
        new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          0.6,  // strength
          0.4,  // radius
          0.7   // threshold
        )
      );
    }

    // ── Nebula / Cosmic Dust Background ──
    const nebulaGeo = new THREE.SphereGeometry(800, 32, 32);
    const nebulaMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;

        // Simple 2D noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m; m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 p = vUv * 3.0;
          float n = snoise(p + time * 0.02) * 0.5 + 0.5;
          float n2 = snoise(p * 2.0 - time * 0.03) * 0.5 + 0.5;
          
          vec3 color1 = vec3(0.0, 0.1, 0.2); // deep cyan/blue
          vec3 color2 = vec3(0.1, 0.0, 0.2); // deep purple
          
          vec3 finalColor = mix(color1, color2, n2) * n * 0.15; // faint
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
    scene.add(nebula);

    // ── Stars ──
    const starLayers: THREE.Points[] = [];

    const getLayerStarCount = (layerIdx: number) => {
      const base = isMobile ? 0.25 : 1;
      if (layerIdx === 0) return Math.floor(4000 * base);
      if (layerIdx === 1) return Math.floor(2000 * base);
      return Math.floor(1500 * base);
    };

    for (let layerIdx = 0; layerIdx < 3; layerIdx++) {
      const STAR_COUNT = getLayerStarCount(layerIdx);
      const positions = new Float32Array(STAR_COUNT * 3);
      const colors = new Float32Array(STAR_COUNT * 3);
      const sizes = new Float32Array(STAR_COUNT);
      const randoms = new Float32Array(STAR_COUNT);

      for (let j = 0; j < STAR_COUNT; j++) {
        const radius = 100 + Math.pow(Math.random(), 0.5) * 800;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[j * 3 + 2] = radius * Math.cos(phi);

        // Cyber Anomalies
        const color = new THREE.Color();
        const r = Math.random();
        if (r < 0.8) {
          color.setHSL(0, 0, 0.85 + Math.random() * 0.15); // white
        } else if (r < 0.9) {
          color.setHex(0x00f0ff); // neon cyan
        } else if (r < 0.98) {
          color.setHex(0x9d4edd); // vivid purple
        } else {
          color.setHex(0xff00ff); // hot pink
        }
        
        colors[j * 3] = color.r;
        colors[j * 3 + 1] = color.g;
        colors[j * 3 + 2] = color.b;

        sizes[j] = Math.random() * 3 + 1;
        randoms[j] = Math.random(); // For twinkling
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('random', new THREE.BufferAttribute(randoms, 1));

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
          attribute float random;
          
          varying vec3 vColor;
          varying float vOpacity;
          
          uniform float time;
          uniform float depth;
          uniform vec2 uMouse;
          uniform vec2 uResolution;

          void main() {
            vColor = color;
            vec3 pos = position;

            // Slow rotation
            float angle = time * 0.05 * (1.0 - depth * 0.3);
            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            pos.xy = rot * pos.xy;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            vec4 projectedPos = projectionMatrix * mvPosition;
            
            // Mouse Repulsion (Screen Space)
            vec2 ndcPos = projectedPos.xy / projectedPos.w;
            vec2 screenPos = vec2(
              (ndcPos.x * 0.5 + 0.5) * uResolution.x,
              (1.0 - (ndcPos.y * 0.5 + 0.5)) * uResolution.y
            );
            
            float distToMouse = length(screenPos - uMouse);
            float repulsionRadius = 250.0;
            
            if (distToMouse < repulsionRadius) {
              float force = (repulsionRadius - distToMouse) / repulsionRadius;
              vec2 dir = normalize(screenPos - uMouse);
              
              // Push the projected position away
              // Notice we must invert the Y direction for NDC (where +Y is up)
              vec2 pushNDC = (dir * force * 150.0) / uResolution * 2.0;
              pushNDC.y = -pushNDC.y; 
              projectedPos.xy += pushNDC * projectedPos.w;
            }

            // Chaotic Twinkling
            float twinkle = sin(time * (2.0 + random * 5.0) + random * 10.0) * 0.5 + 0.5;
            float twinkleFactor = mix(1.0, twinkle, random > 0.5 ? 0.8 : 0.2);
            
            vOpacity = twinkleFactor;

            float baseSize = size * (300.0 / -mvPosition.z);
            gl_PointSize = baseSize * twinkleFactor;
            
            gl_Position = projectedPos;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vOpacity;

          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;

            float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * vOpacity;
            
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      starLayers.push(points);
    }

    // ── Scroll state ──
    let scrollY = window.scrollY;
    const handleScroll = () => scrollY = window.scrollY;
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

      nebulaMat.uniforms.time.value = time;

      starLayers.forEach((layer) => {
        if (layer.material instanceof THREE.ShaderMaterial) {
          layer.material.uniforms.time.value = time;
          layer.material.uniforms.uMouse.value.set(clientX, clientY);
          layer.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }
      });

      const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(scrollY / docHeight, 1);

      const targetX = mouseX * 8;
      const targetY = 30 - progress * 20 + mouseY * 5;
      const targetZ = 100 - progress * 150;

      const smooth = 0.04;
      smoothCameraPos.current.x += (targetX - smoothCameraPos.current.x) * smooth;
      smoothCameraPos.current.y += (targetY - smoothCameraPos.current.y) * smooth;
      smoothCameraPos.current.z += (targetZ - smoothCameraPos.current.z) * smooth;

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

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);

      nebulaGeo.dispose();
      nebulaMat.dispose();

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
      style={{ background: '#020205' }}
    />
  );
}
