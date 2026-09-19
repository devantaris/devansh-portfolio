'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useMotionCapable } from '@/hooks/useMotionCapable';

const Universe = dynamic(() => import('@/components/world/Universe'), { ssr: false });

/**
 * Entry point for the Devantaris System. The navigable universe is a
 * desktop-class WebGL experience — on touch / small / reduced-motion devices
 * we show a notice instead of a broken or sluggish scene.
 */
export default function UniverseEntry() {
  const motionCapable = useMotionCapable();

  if (!motionCapable) {
    return (
      <main style={{
        minHeight: '100vh', background: '#020205', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}>
        <div style={{
          border: '1px solid rgba(0,229,255,0.25)', padding: '40px 32px',
          maxWidth: '420px', textAlign: 'center', display: 'flex',
          flexDirection: 'column', gap: '16px', background: 'rgba(3,3,8,0.7)',
        }}>
          <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>DEVANTARIS.SYSTEM</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 200, fontSize: '26px', color: '#fff', letterSpacing: '-0.02em' }}>
            This transmission needs a bigger screen.
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontWeight: 300, lineHeight: 1.7, margin: 0 }}>
            The navigable system is a WebGL experience built for desktop devices. The full portfolio works everywhere:
          </p>
          <Link href="/" className="glow-btn" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)', textAlign: 'center' }}>
            ← BACK TO MAIN SITE
          </Link>
        </div>
      </main>
    );
  }

  return <Universe />;
}
