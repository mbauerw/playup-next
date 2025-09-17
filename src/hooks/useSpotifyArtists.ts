import { useState, useCallback } from 'react';
import { spotifyArtists } from '@/services/spotify/artists';
import type { SpotifyArtist } from '@/types';

interface UseSpotifyArtistsReturn {
  // State
  artist: SpotifyArtist | null;
  artists: SpotifyArtist[] | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchArtist: (accessToken: string, artistId: string) => Promise<void>;
  fetchSeveralArtists: (accessToken: string, artistIds: string[]) => Promise<void>;
  clearData: () => void;
}

export const useSpotifyArtists = (): UseSpotifyArtistsReturn => {
  const [artist, setArtist] = useState<SpotifyArtist | null>(null);
  const [artists, setArtists] = useState<SpotifyArtist[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtist = useCallback(async (
    accessToken: string,
    artistId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyArtists.getArtist(accessToken, artistId);
      setArtist(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch artist');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSeveralArtists = useCallback(async (
    accessToken: string,
    artistIds: string[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const idsString = artistIds.join(',');
      const data = await spotifyArtists.getSeveralArtists(accessToken, idsString);
      setArtists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch artists');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setArtist(null);
    setArtists(null);
    setError(null);
  }, []);

  return {
    artist,
    artists,
    loading,
    error,
    fetchArtist,
    fetchSeveralArtists,
    clearData,
  };
};