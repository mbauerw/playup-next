import { useState, useCallback } from 'react';
import { spotifyPlaylists } from '@/services/spotify/playlists';
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
  fetchPlaylist: (accessToken: string, playlistId: string) => Promise<void>;
  fetchPlaylistItems: (
    accessToken: string, 
    playlistId: string,
    options?: { limit?: number; offset?: number }
  ) => Promise<void>;
  fetchCurrentUserPlaylists: (
    accessToken: string,
    options?: { limit?: number; offset?: number }
  ) => Promise<void>;
  fetchUserPlaylists: (
    accessToken: string, 
    userId: string,
    options?: { limit?: number; offset?: number }
  ) => Promise<void>;
  createPlaylist: (
    accessToken: string, 
    userId: string, 
    data: CreatePlaylistData
  ) => Promise<void>;
  addItemsToPlaylist: (
    accessToken: string, 
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

  const fetchPlaylist = useCallback(async (
    accessToken: string,
    playlistId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyPlaylists.getPlaylist(accessToken, playlistId);
      setPlaylist(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch playlist');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPlaylistItems = useCallback(async (
    accessToken: string,
    playlistId: string,
    options?: { limit?: number; offset?: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyPlaylists.getPlaylistItems(accessToken, playlistId, options);
      setPlaylistItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch playlist items');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUserPlaylists = useCallback(async (
    accessToken: string,
    options?: { limit?: number; offset?: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyPlaylists.getCurrentUserPlaylists(accessToken, options);
      setCurrentUserPlaylists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch current user playlists');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserPlaylists = useCallback(async (
    accessToken: string,
    userId: string,
    options?: { limit?: number; offset?: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyPlaylists.getUserPlaylists(accessToken, userId, options);
      setUserPlaylists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user playlists');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlaylist = useCallback(async (
    accessToken: string,
    userId: string,
    data: CreatePlaylistData
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await spotifyPlaylists.createPlaylist(accessToken, userId, data);
      setCreatedPlaylist(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  }, []);

  const addItemsToPlaylist = useCallback(async (
    accessToken: string,
    playlistId: string,
    trackUris: string[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await spotifyPlaylists.addItemsToPlaylist(accessToken, playlistId, trackUris);
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