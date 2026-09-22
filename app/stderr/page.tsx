import type { Metadata } from 'next';
import PostApocalypticError from '@/components/error/PostApocalypticError';

export const metadata: Metadata = {
  title: 'STDERR (fd 2): Post-Silicon Earth Telemetry — Devansh Kumar',
  description: 'An interactive diagnostic terminal from a post-apocalyptic Earth where nature has reclaimed ancient computer mainframes and robotic ruins.',
};

export default function StderrPage() {
  return <PostApocalypticError errorType="STDERR" />;
}
