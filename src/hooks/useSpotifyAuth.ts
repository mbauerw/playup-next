'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateRandomString, generateCodeChallenge } from '@/lib/auth';
import { spotifyApi } from '@/services/spotify';
import type { UsePkceAuthReturn } from '@/types';

export const useSpotifyAuth = (
  scope: string = 'user-read-private user-read-email playlist-read-private playlist-modify-private user-follow-read'
): UsePkceAuthReturn => {
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load stored code on mount - this runs first
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCode = localStorage.getItem('spotify_auth_code');
      if (storedCode) {
        console.log("Loading stored auth code:", storedCode);
        setCode(storedCode);
      }
    }
  }, []);

  // Handle URL params from Spotify redirect - this runs when URL changes
  useEffect(() => {
    const authCode = searchParams.get('code');
    const authError = searchParams.get('error');

    if (authError) {
      console.log("Auth error from URL:", authError);
      setError(`Authentication failed: ${authError}`);
      // Clean up URL but don't redirect immediately
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    } else if (authCode && authCode !== code) {
      console.log("New auth code received from URL:", authCode);
      setCode(authCode);
      
      // Store code in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('spotify_auth_code', authCode);
      }
      
      // Clean up URL params without redirecting
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('state');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, code]);

  const initiateAuth = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID) {
        throw new Error('Client ID not found in environment variables');
      }

      if (typeof window !== 'undefined') {
        localStorage.removeItem('spotify_auth_code');
        localStorage.removeItem('code_verifier');
      }
      setCode(''); 

      // PKCE parameters
      const codeVerifier = generateRandomString(64);
      const codeChallenge = await generateCodeChallenge(codeVerifier);
 
      if (typeof window !== 'undefined') {
        localStorage.setItem('code_verifier', codeVerifier);
      }

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
      
      console.log("Redirecting to Spotify authorization...");
      // Redirect to Spotify authorization
      window.location.href = authUrl.toString();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate authentication';
      setError(errorMessage);
      console.error('Auth initiation failed:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [scope]);

  const clearAuth = useCallback((): void => {
    setCode('');
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('code_verifier');
      localStorage.removeItem('spotify_auth_code');
    }
    console.log("Auth data cleared");
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
    if (!code) {
      throw new Error('Authorization code not available');
    }

    setLoading(true);
    setError(null);

    try {
      const verifier = typeof window !== 'undefined' ? localStorage.getItem("code_verifier") : null;
      
      if (!verifier) {
        throw new Error('Code verifier not found in localStorage');
      }

      console.log('Fetching token with code:', code.substring(0, 10) + '...');
      const result = await spotifyApi.getToken(code, verifier);
      setToken(result.access_token);
      
      // Clear the auth code after successful token exchange
      if (typeof window !== 'undefined') {
        localStorage.removeItem('spotify_auth_code');
        localStorage.removeItem('code_verifier');
      }
      
      console.log('Token obtained successfully');
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
    console.log("Token cleared");
  }, []);

  return { 
    token, 
    loading, 
    error, 
    fetchToken, 
    clearToken 
  };
};