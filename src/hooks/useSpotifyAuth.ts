'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateRandomString, generateCodeChallenge } from '@/lib/auth';
import { spotifyApi } from '@/services/spotifyApi';
import type { UsePkceAuthReturn } from '@/types';

export const useSpotifyAuth = (
  scope: string = 'user-read-private user-read-email playlist-read-private playlist-modify-private user-follow-read'
): UsePkceAuthReturn => {
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const authCode = searchParams.get('code');
    const authError = searchParams.get('error');

    if (authError) {
      setError(`Authentication failed: ${authError}`);
    } else if (authCode) {
      setCode(authCode);
      console.log("Auth Code is: ", authCode);
      // Clean up URL without page reload
      router.replace('/');
    }
  }, [searchParams, router]);

  const initiateAuth = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID) {
        throw new Error('Client ID not found in environment variables');
      }

      // Generate PKCE parameters
      const codeVerifier = generateRandomString(64);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Store code verifier for later use
      if (typeof window !== 'undefined') {
        localStorage.setItem('code_verifier', codeVerifier);
      }

      // Build authorization URL
      const authUrl = new URL("https://accounts.spotify.com/authorize");
      const params = {
        response_type: 'code',
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
      };

      authUrl.search = new URLSearchParams(params).toString();
      
      // Redirect to Spotify authorization
      window.location.href = authUrl.toString();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate authentication';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [scope]);

  const clearAuth = useCallback((): void => {
    setCode('');
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('code_verifier');
    }
  }, []);

  return {
    code,
    isLoading,
    error,
    initiateAuth,
    clearAuth
  };
};

export const useSpotifyToken = (code: string) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = useCallback(async (): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const verifier = typeof window !== 'undefined' ? localStorage.getItem("code_verifier") : null;
      
      if (!verifier) {
        throw new Error('Code verifier not found in localStorage');
      }
  
      const result = await spotifyApi.getToken(code, verifier);
      setToken(result.access_token);
      
      return result.access_token;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get token';
      setError(errorMessage);
      console.error('Token request failed:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [code]);

  const clearToken = useCallback(() => {
    setToken(null);
    setError(null);
  }, []);

  return { 
    token, 
    loading, 
    error, 
    fetchToken, 
    clearToken 
  };
};