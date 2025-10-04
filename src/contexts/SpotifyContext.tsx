'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface SpotifyContextType {
  // Token management
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenError: string | null;
  
  // Token operations
  getAccessToken: () => Promise<string>;
  refreshToken: () => Promise<void>;
  clearToken: () => void;
  
  // User info
  userId: string | null;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const SpotifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isAuthenticated = status === 'authenticated' && !!accessToken;
  const isLoading = status === 'loading' || isRefreshing;
  const userId = session?.user?.id || null;

  // check and refresh token if needed
  const getAccessToken = useCallback(async (): Promise<string> => {
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    if (accessToken && session.spotifyTokenExpires) {
      const now = Date.now() / 1000;
      const expiresAt = session.spotifyTokenExpires;
      
      if (expiresAt > now + 300) {
        return accessToken;
      }
    }

    try {
      setIsRefreshing(true);
      const response = await fetch('/api/spotify/token', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to refresh Spotify token');
      }

      const data = await response.json();
      setAccessToken(data.access_token);
      setTokenError(null);
      return data.access_token;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get token';
      setTokenError(errorMessage);
      throw err;
    } finally {
      setIsRefreshing(false);
    }
  }, [session, accessToken]);

  // Explicit refresh function
  const refreshToken = useCallback(async () => {
    setAccessToken(null); // Clear current token to force refresh
    await getAccessToken();
  }, [getAccessToken]);

  // Clear token
  const clearToken = useCallback(() => {
    setAccessToken(null);
    setTokenError(null);
  }, []);

  // Initialize token on mount if session exists
  useEffect(() => {
    if (session?.spotifyAccessToken && !accessToken) {
      setAccessToken(session.spotifyAccessToken);
    }
  }, [session, accessToken]);

  const value: SpotifyContextType = {
    accessToken,
    isAuthenticated,
    isLoading,
    tokenError,
    getAccessToken,
    refreshToken,
    clearToken,
    userId,
  };

  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
};

// Custom hook to use the Spotify context
export const useSpotifyContext = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotifyContext must be used within a SpotifyProvider');
  }
  return context;
};