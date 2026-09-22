import type { Metadata } from 'next';
import PostApocalypticError from '@/components/error/PostApocalypticError';

export const metadata: Metadata = {
  title: '404: Sector Lost to Nature — Devansh Kumar',
  description: 'The requested sector has been reclaimed by wild nature, moss, and roots. STDERR transmission diagnostics.',
};

export default function NotFound() {
  return <PostApocalypticError errorType="404" />;
}
