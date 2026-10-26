import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404: Not Found — Devansh Kumar',
  description: 'Page not found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b2a73] text-[#f3f6ff] p-6 font-mono">
      <div className="border border-[#9db9ff]/40 p-8 max-w-md w-full bg-[#0b2a73]/90 shadow-2xl">
        <div className="text-xs tracking-widest text-[#9db9ff] uppercase mb-4 border-b border-[#9db9ff]/20 pb-2">
          Sheet 00 // Error
        </div>
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight font-sans text-white">404</h1>
        <p className="text-sm text-[#9db9ff] mb-6 leading-relaxed">
          The requested coordinate does not exist in this system drawing.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-[#f3f6ff] text-xs uppercase tracking-widest text-[#f3f6ff] hover:bg-[#ffd60a] hover:text-[#14213d] hover:border-[#14213d] transition-colors"
        >
          Return to Blueprint →
        </Link>
      </div>
    </div>
  );
}
