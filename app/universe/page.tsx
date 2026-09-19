import type { Metadata } from 'next';
import UniverseEntry from '@/components/world/UniverseEntry';

export const metadata: Metadata = {
  title: 'The Devantaris System — Devansh Kumar',
  description: 'A navigable star system: explore Devansh Kumar\u2019s projects, research, and experience as planets, moons, and signals in a WebGL universe.',
};

export default function UniversePage() {
  return <UniverseEntry />;
}
