'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    // Extract user data from URL parameters
    const sessionId = searchParams.get('session_id');
    const userId = searchParams.get('user_id');
    const spotifyId = searchParams.get('spotify_id');
    const displayName = searchParams.get('display_name');

    if (sessionId && userId) {
      // Create user object from URL parameters
      const user = {
        id: userId,
        spotify_id: spotifyId || '',
        display_name: displayName || ''
      };

      // Set session with the received data
      setSession(sessionId, user);
      router.push('/dashboard');
    } else {
      console.error('Missing session data in callback');
      router.push('/');
    }
  }, [searchParams, router, setSession]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse">Authenticating...</div>
    </div>
  );
}
