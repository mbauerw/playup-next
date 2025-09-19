import { useState, useCallback } from 'react';
import { spotifyAlbums } from '@/services/spotify/albums';
import type { 
  SpotifyAlbum, 
  MultipleAlbums,
  AlbumTracks,
  SavedAlbums 
} from '@/types';

interface UseSpotifyAlbumsReturn {
  // State
  album: SpotifyAlbum | null;
  albums: MultipleAlbums | null;
  albumTracks: AlbumTracks | null;
  savedAlbums: SavedAlbums | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchAlbum: (accessToken: string, albumId: string, market?: string) => Promise<void>;
  fetchAlbums: (accessToken: string, albumIds: string[], market?: string) => Promise<void>;
  fetchAlbumTracks: (
    accessToken: string, 
    albumId: string,
    options?: { 
      market?: string;
      limit?: number;
      offset?: number;
    }
  ) => Promise<void>;
  fetchSavedAlbums: (
    accessToken: string,
    options?: { 
      limit?: number;
      offset?: number;
      market?: string;
    }
  ) => Promise<void>;
  clearData: () => void;
}

export const useSpotifyAlbums = (): UseSpotifyAlbumsReturn => {
  const [album, setAlbum] = useState<SpotifyAlbum | null>(null);
  const [albums, setAlbums] = useState<MultipleAlbums | null>(null);
  const [albumTracks, setAlbumTracks] = useState<AlbumTracks | null>(null);
  const [savedAlbums, setSavedAlbums] = useState<SavedAlbums | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlbum = useCallback(async (
    accessToken: string,
    albumId: string,
    market?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyAlbums.getAlbum(accessToken, albumId, market);
      setAlbum(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch album');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlbums = useCallback(async (
    accessToken: string,
    albumIds: string[],
    market?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyAlbums.getAlbums(accessToken, albumIds, market);
      setAlbums(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch albums');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlbumTracks = useCallback(async (
    accessToken: string,
    albumId: string,
    options?: { 
      market?: string;
      limit?: number;
      offset?: number;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyAlbums.getAlbumTracks(accessToken, albumId, options);
      setAlbumTracks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch album tracks');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSavedAlbums = useCallback(async (
    accessToken: string,
    options?: { 
      limit?: number;
      offset?: number;
      market?: string;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyAlbums.getSavedAlbums(accessToken, options);
      setSavedAlbums(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch saved albums');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setAlbum(null);
    setAlbums(null);
    setAlbumTracks(null);
    setSavedAlbums(null);
    setError(null);
  }, []);

  return {
    album,
    albums,
    albumTracks,
    savedAlbums,
    loading,
    error,
    fetchAlbum,
    fetchAlbums,
    fetchAlbumTracks,
    fetchSavedAlbums,
    clearData,
  };
};