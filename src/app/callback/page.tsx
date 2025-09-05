'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Spotify auth error:', error);
      router.push(`/?error=${encodeURIComponent(error)}`);
    } else if (code) {
      console.log('Spotify auth success, code:', code);
      router.push(`/?code=${encodeURIComponent(code)}`);
    } else {
      console.log('No code or error found, redirecting to home');
      router.push('/');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Spotify Authentication...</h1>
        <p className="text-gray-600">Please wait while we redirect you back to the app.</p>
      </div>
    </div>
  );
}