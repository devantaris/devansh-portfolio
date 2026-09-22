'use client';

import { useEffect } from 'react';
import PostApocalypticError from '@/components/error/PostApocalypticError';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log uncaught error to console
    console.error('STDERR Runtime Exception Caught:', error);
  }, [error]);

  return (
    <PostApocalypticError
      errorType="PANIC"
      errorMessage={error.message}
      errorDigest={error.digest}
      reset={reset}
    />
  );
}
