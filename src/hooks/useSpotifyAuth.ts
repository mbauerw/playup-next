'use client';

import { useSession } from 'next-auth/react';
import { useState, useCallback } from 'react';

export const useSpotifyAuth = () => {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = status === 'authenticated' && !!session?.spotifyAccessToken;
  const isLoading = status === 'loading';

  const getAccessToken = useCallback(async (): Promise<string> => {
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    if (session.spotifyAccessToken && session.spotifyTokenExpires) {
      const now = Date.now() / 1000;
      const expiresAt = session.spotifyTokenExpires;
      
      console.log(" Ain't no need to hit the DB. You can just get the token from MEEEE");
      if (expiresAt > now + 300) {
        return session.spotifyAccessToken;
      }
    }

    // Token is expired or missing, fetch a fresh one from your API
    try {
      const response = await fetch('/api/spotify/token', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to refresh Spotify token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get token';
      setError(errorMessage);
      throw err;
    }
  }, [session]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    error,
    getAccessToken,
    clearError,
    user: session?.user
  };
};