'use client';

import { useState, useCallback } from 'react';
import { spotifyApi } from '@/services/spotifyApi';
import type { CurrentUser, CurrentUserPlaylists, SpotifyArtist } from '@/types';

export const useSpotifyProfile = (token: string | null) => {
  const [profile, setProfile] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (): Promise<CurrentUser | null> => {
    if (!token) {
      setError('No token available');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await spotifyApi.getCurrentUser(token);
      setProfile(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get profile';
      setError(errorMessage);
      console.error('Profile request failed:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    profile,
    loading,
    error,
    fetchProfile
  };
};

export const useSpotifyPlaylists = (token: string | null) => {
  const [playlists, setPlaylists] = useState<CurrentUserPlaylists | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylists = useCallback(async (): Promise<CurrentUserPlaylists | null> => {
    if (!token) {
      setError('No token available');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await spotifyApi.getCurrentUserPlaylists(token);
      setPlaylists(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get playlists';
      setError(errorMessage);
      console.error('Playlists request failed:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    playlists,
    loading,
    error,
    fetchPlaylists
  };
};

export const useSpotifyArtist = (token: string | null) => {
  const [artist, setArtist] = useState<SpotifyArtist | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtist = useCallback(async (artistId: string): Promise<SpotifyArtist | null> => {
    if (!token) {
      setError('No token available');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await spotifyApi.getArtist(token, artistId);
      setArtist(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get artist';
      setError(errorMessage);
      console.error('Artist request failed:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    artist,
    loading,
    error,
    fetchArtist
  };
};