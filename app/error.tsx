'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Runtime Exception Caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b2a73] text-[#f3f6ff] p-6 font-mono">
      <div className="border border-[#9db9ff]/40 p-8 max-w-lg w-full bg-[#0b2a73]/90 shadow-2xl">
        <div className="text-xs tracking-widest text-[#9db9ff] uppercase mb-4 border-b border-[#9db9ff]/20 pb-2 flex justify-between items-center">
          <span>Sheet 00 // Runtime Exception</span>
          {error.digest && <span className="opacity-60 text-[10px]">#{error.digest.slice(0, 8)}</span>}
        </div>
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight font-sans text-white">SYSTEM_FAULT</h1>
        <p className="text-sm text-[#9db9ff] mb-6 leading-relaxed font-sans">
          An unexpected exception occurred during runtime execution. Technical state telemetry has been logged to the console.
        </p>
        {error.message && (
          <div className="bg-[#051740] border border-[#9db9ff]/20 rounded p-3 mb-6 text-xs text-[#ffd60a] break-words">
            {error.message}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center px-4 py-2 border border-[#ffd60a] text-xs uppercase tracking-widest text-[#ffd60a] hover:bg-[#ffd60a] hover:text-[#14213d] transition-colors cursor-pointer"
          >
            Retry Operation ⟳
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-[#f3f6ff] text-xs uppercase tracking-widest text-[#f3f6ff] hover:bg-[#f3f6ff] hover:text-[#0b2a73] transition-colors"
          >
            Return to Blueprint →
          </Link>
        </div>
      </div>
    </div>
  );
}
