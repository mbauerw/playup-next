'use client'

import { useState, useCallback } from 'react';
import { playlistsAPI } from '@/services/api/playlists';
import type { 
  SpotifyPlaylist, 
  PlaylistItems, 
  CurrentUserPlaylists,
  CreatePlaylistData 
} from '@/types';

interface UseSpotifyPlaylistsReturn {
  // State
  playlist: SpotifyPlaylist | null;
  playlistItems: PlaylistItems | null;
  currentUserPlaylists: CurrentUserPlaylists | null;
  userPlaylists: CurrentUserPlaylists | null;
  createdPlaylist: SpotifyPlaylist | null;
  addItemsResponse: { snapshot_id: string } | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchPlaylist: (playlistId: string) => Promise<void>;
  fetchPlaylistItems: (
    playlistId: string,
    options?: { limit?: number; offset?: number }
  ) => Promise<void>;
  fetchCurrentUserPlaylists: (
    options?: { limit?: number; offset?: number }
  ) => Promise<void>;
  fetchUserPlaylists: (
    userId: string,
    options?: { limit?: number; offset?: number }
  ) => Promise<void>;
  createPlaylist: ( 
    userId: string, 
    data: CreatePlaylistData
  ) => Promise<void>;
  addItemsToPlaylist: (
    playlistId: string, 
    trackUris: string[]
  ) => Promise<void>;
  clearData: () => void;
}

export const useSpotifyPlaylists = (): UseSpotifyPlaylistsReturn => {
  
  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [playlistItems, setPlaylistItems] = useState<PlaylistItems | null>(null);
  const [currentUserPlaylists, setCurrentUserPlaylists] = useState<CurrentUserPlaylists | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<CurrentUserPlaylists | null>(null);
  const [createdPlaylist, setCreatedPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [addItemsResponse, setAddItemsResponse] = useState<{ snapshot_id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylist = useCallback(async (playlistId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await playlistsAPI.getPlaylist(playlistId);
      setPlaylist(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch playlist');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPlaylistItems = useCallback(async (
    playlistId: string,
    options?: { limit?: number; offset?: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await playlistsAPI.getPlaylistItems(playlistId, options);
      setPlaylistItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch playlist items');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUserPlaylists = useCallback(async (
    options?: { limit?: number; offset?: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await playlistsAPI.getCurrentUserPlaylists(options);
      setCurrentUserPlaylists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch current user playlists');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserPlaylists = useCallback(async (
    userId: string,
    options?: { limit?: number; offset?: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await playlistsAPI.getUserPlaylists(userId, options);
      setUserPlaylists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user playlists');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlaylist = useCallback(async (
    userId: string,
    data: CreatePlaylistData
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await playlistsAPI.createPlaylist(userId, data);
      setCreatedPlaylist(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  }, []);

  const addItemsToPlaylist = useCallback(async (
    playlistId: string,
    trackUris: string[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await playlistsAPI.addItemsToPlaylist(playlistId, trackUris);
      setAddItemsResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add items to playlist');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setPlaylist(null);
    setPlaylistItems(null);
    setCurrentUserPlaylists(null);
    setUserPlaylists(null);
    setCreatedPlaylist(null);
    setAddItemsResponse(null);
    setError(null);
  }, []);

  return {
    playlist,
    playlistItems,
    currentUserPlaylists,
    userPlaylists,
    createdPlaylist,
    addItemsResponse,
    loading,
    error,
    fetchPlaylist,
    fetchPlaylistItems,
    fetchCurrentUserPlaylists,
    fetchUserPlaylists,
    createPlaylist,
    addItemsToPlaylist,
    clearData,
  };
};