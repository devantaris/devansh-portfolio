'use client';

import dynamic from 'next/dynamic';
import { useMotionCapable } from '@/hooks/useMotionCapable';
import ClassicSite from '@/components/ClassicSite';

// The navigable universe — client-only, desktop / fine-pointer / motion-ok devices.
const Universe = dynamic(() => import('@/components/world/Universe'), { ssr: false });

export default function Home() {
  const motionCapable = useMotionCapable();
  return motionCapable ? <Universe /> : <ClassicSite />;
}
