'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ProceduralVinesHandle {
  bloomAt: (x: number, y: number) => void;
  triggerGlobalBloom: () => void;
}

interface Blossom {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  petals: number;
  color: string;
  petalColor: string;
  rotation: number;
  life: number;
  growth: number;
}

interface VineNode {
  x: number;
  y: number;
  angle: number;
  length: number;
  thickness: number;
  children: VineNode[];
  leaf?: {
    size: number;
    angle: number;
    color: string;
  };
}

interface ProceduralVinesProps {
  overgrowthLevel?: number; // 0 = minimal, 1 = normal, 2 = lush wilderness
  className?: string;
  onBloomCountChange?: (count: number) => void;
}

export const ProceduralVines = forwardRef<ProceduralVinesHandle, ProceduralVinesProps>(
  function ProceduralVines({ overgrowthLevel = 2, className = '', onBloomCountChange }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const blossomsRef = useRef<Blossom[]>([]);
    const vineTreesRef = useRef<VineNode[]>([]);
    const animIdRef = useRef<number | null>(null);

    const flowerColors = [
      { core: '#00e5ff', petal: 'rgba(0, 229, 255, 0.75)' },
      { core: '#50fa7b', petal: 'rgba(80, 250, 123, 0.75)' },
      { core: '#ff79c6', petal: 'rgba(255, 121, 198, 0.75)' },
      { core: '#f1fa8c', petal: 'rgba(241, 250, 140, 0.75)' },
      { core: '#bd93f9', petal: 'rgba(189, 147, 249, 0.75)' },
    ];

    const spawnBlossom = (x: number, y: number, big = false) => {
      const col = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      blossomsRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: big ? Math.random() * 10 + 12 : Math.random() * 7 + 6,
        petals: Math.random() > 0.5 ? 5 : 6,
        color: col.core,
        petalColor: col.petal,
        rotation: Math.random() * Math.PI * 2,
        life: 1,
        growth: 0,
      });
      if (onBloomCountChange) {
        onBloomCountChange(blossomsRef.current.length);
      }
    };

    useImperativeHandle(ref, () => ({
      bloomAt: (x: number, y: number) => {
        spawnBlossom(x, y, true);
        // spawn 2-3 satellite little buds
        for (let i = 0; i < 3; i++) {
          const offsetX = (Math.random() - 0.5) * 40;
          const offsetY = (Math.random() - 0.5) * 40;
          setTimeout(() => spawnBlossom(x + offsetX, y + offsetY, false), i * 90);
        }
      },
      triggerGlobalBloom: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const w = canvas.width;
        const h = canvas.height;
        for (let i = 0; i < 18; i++) {
          setTimeout(() => {
            const rx = Math.random() * w;
            const ry = Math.random() * h;
            spawnBlossom(rx, ry, Math.random() > 0.6);
          }, i * 70);
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

      // Build organic vines growing inwards from corners and borders
      const generateVineBranch = (
        startX: number,
        startY: number,
        angle: number,
        depth: number,
        maxDepth: number
      ): VineNode => {
        const length = (Math.random() * 32 + 20) * (depth === 0 ? 1.4 : 1);
        const thickness = Math.max(1.2, (maxDepth - depth) * 1.6);
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;

        const children: VineNode[] = [];
        if (depth < maxDepth) {
          const numChildren = Math.random() > 0.4 ? 2 : 1;
          for (let i = 0; i < numChildren; i++) {
            const angleSpread = (Math.random() - 0.5) * 0.9;
            children.push(generateVineBranch(endX, endY, angle + angleSpread, depth + 1, maxDepth));
          }
        }

        const hasLeaf = depth > 1 && Math.random() > 0.3;
        const leaf = hasLeaf
          ? {
              size: Math.random() * 9 + 5,
              angle: angle + (Math.random() > 0.5 ? Math.PI / 2 : -Math.PI / 2) + (Math.random() - 0.5) * 0.4,
              color: Math.random() > 0.5 ? 'rgba(80, 250, 123, 0.85)' : 'rgba(38, 166, 91, 0.85)',
            }
          : undefined;

        return {
          x: endX,
          y: endY,
          angle,
          length,
          thickness,
          children,
          leaf,
        };
      };

      const seedVines = () => {
        const trees: VineNode[] = [];
        const depth = overgrowthLevel === 0 ? 2 : overgrowthLevel === 1 ? 4 : 5;

        // Top-left corner
        trees.push(generateVineBranch(0, 0, Math.PI * 0.22, 0, depth));
        trees.push(generateVineBranch(0, 40, Math.PI * 0.15, 0, depth));
        // Top-right corner
        trees.push(generateVineBranch(width, 0, Math.PI * 0.78, 0, depth));
        trees.push(generateVineBranch(width, 50, Math.PI * 0.85, 0, depth));
        // Bottom-left corner
        trees.push(generateVineBranch(0, height, -Math.PI * 0.22, 0, depth));
        trees.push(generateVineBranch(60, height, -Math.PI * 0.35, 0, depth));
        // Bottom-right corner
        trees.push(generateVineBranch(width, height, -Math.PI * 0.78, 0, depth));
        trees.push(generateVineBranch(width - 50, height, -Math.PI * 0.65, 0, depth));

        // Center bottom creeping root
        if (overgrowthLevel >= 1) {
          trees.push(generateVineBranch(width * 0.3, height, -Math.PI * 0.45, 0, depth - 1));
          trees.push(generateVineBranch(width * 0.7, height, -Math.PI * 0.55, 0, depth - 1));
        }

        vineTreesRef.current = trees;
      };

      seedVines();

      const handleResize = () => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        seedVines();
      };

      window.addEventListener('resize', handleResize);

      const drawBranch = (
        node: VineNode,
        parentX: number,
        parentY: number,
        currentProgress: number
      ) => {
        const curX = parentX + (node.x - parentX) * currentProgress;
        const curY = parentY + (node.y - parentY) * currentProgress;

        ctx.beginPath();
        ctx.moveTo(parentX, parentY);
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = overgrowthLevel === 0 ? '#4a3f35' : '#1b4332';
        ctx.lineWidth = node.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Inner glowing tendril core
        if (overgrowthLevel >= 1) {
          ctx.beginPath();
          ctx.moveTo(parentX, parentY);
          ctx.lineTo(curX, curY);
          ctx.strokeStyle = 'rgba(80, 250, 123, 0.25)';
          ctx.lineWidth = Math.max(0.7, node.thickness * 0.35);
          ctx.stroke();
        }

        // Draw leaf
        if (node.leaf && currentProgress >= 0.8 && overgrowthLevel >= 1) {
          ctx.save();
          ctx.translate(curX, curY);
          ctx.rotate(node.leaf.angle);

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(
            node.leaf.size * 0.6,
            -node.leaf.size * 0.4,
            node.leaf.size * 0.9,
            0,
            node.leaf.size,
            0
          );
          ctx.bezierCurveTo(
            node.leaf.size * 0.9,
            0,
            node.leaf.size * 0.6,
            node.leaf.size * 0.4,
            0,
            0
          );
          ctx.fillStyle = node.leaf.color;
          ctx.fill();

          // Leaf vein
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(node.leaf.size * 0.85, 0);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 0.6;
          ctx.stroke();

          ctx.restore();
        }

        if (currentProgress >= 1) {
          for (const child of node.children) {
            drawBranch(child, node.x, node.y, 1);
          }
        }
      };

      let growthProgress = 0;
      let frame = 0;

      const render = () => {
        frame++;
        ctx.clearRect(0, 0, width, height);

        growthProgress = Math.min(1, growthProgress + 0.015);

        // 1. Draw Creeping Tendrils
        for (const tree of vineTreesRef.current) {
          const originX = tree.x - Math.cos(tree.angle) * tree.length;
          const originY = tree.y - Math.sin(tree.angle) * tree.length;
          drawBranch(tree, originX, originY, growthProgress);
        }

        // 2. Draw Interactive Blossoms
        const blossoms = blossomsRef.current;
        for (let i = blossoms.length - 1; i >= 0; i--) {
          const b = blossoms[i];
          b.growth = Math.min(1, b.growth + 0.05);
          const currentRadius = b.maxRadius * b.growth;

          ctx.save();
          ctx.translate(b.x, b.y);
          ctx.rotate(b.rotation + Math.sin(frame * 0.02) * 0.05);

          // Draw petals
          for (let p = 0; p < b.petals; p++) {
            const petalAngle = (p * Math.PI * 2) / b.petals;
            ctx.save();
            ctx.rotate(petalAngle);

            ctx.beginPath();
            ctx.ellipse(
              currentRadius * 0.7,
              0,
              currentRadius * 0.65,
              currentRadius * 0.38,
              0,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = b.petalColor;
            ctx.shadowColor = b.color;
            ctx.shadowBlur = 10;
            ctx.fill();

            ctx.restore();
          }

          // Flower glowing pistil center
          ctx.beginPath();
          ctx.arc(0, 0, currentRadius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.shadowColor = '#fff';
          ctx.shadowBlur = 14;
          ctx.fill();

          ctx.restore();
        }

        animIdRef.current = requestAnimationFrame(render);
      };

      animIdRef.current = requestAnimationFrame(render);

      return () => {
        if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
        window.removeEventListener('resize', handleResize);
      };
    }, [overgrowthLevel, onBloomCountChange]);

    return (
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 z-20 w-full h-full ${className}`}
      />
    );
  }
);
