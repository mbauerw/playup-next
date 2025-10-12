// hooks/useSpotifyAlbums.ts
import { useState, useCallback } from 'react';
import { albumsAPI } from '@/services/api/albums';

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
  fetchAlbum: (albumId: string, market?: string) => Promise<void>;
  fetchAlbums: (albumIds: string[], market?: string) => Promise<void>;
  fetchAlbumTracks: (
    albumId: string,
    options?: { 
      market?: string;
      limit?: number;
      offset?: number;
    }
  ) => Promise<AlbumTracks | null>;
  fetchSavedAlbums: (
    options?: { 
      limit?: number;
      offset?: number;
      market?: string;
    }
  ) => Promise<void>;
  clearData: () => void;
}

export const useSpotifyAlbums = (): UseSpotifyAlbumsReturn => {
  // No more getAccessToken - removed SpotifyContext dependency!
  
  const [album, setAlbum] = useState<SpotifyAlbum | null>(null);
  const [albums, setAlbums] = useState<MultipleAlbums | null>(null);
  const [albumTracks, setAlbumTracks] = useState<AlbumTracks | null>(null);
  const [savedAlbums, setSavedAlbums] = useState<SavedAlbums | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlbum = useCallback(async (
    albumId: string,
    market?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await albumsAPI.getAlbum(albumId, market);
      setAlbum(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch album');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlbums = useCallback(async (
    albumIds: string[],
    market?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await albumsAPI.getAlbums(albumIds, market);
      setAlbums(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch albums');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlbumTracks = useCallback(async (
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
      const data = await albumsAPI.getAlbumTracks(albumId, options);
      setAlbumTracks(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch album tracks');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSavedAlbums = useCallback(async (
    options?: { 
      limit?: number;
      offset?: number;
      market?: string;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await albumsAPI.getSavedAlbums(options);
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