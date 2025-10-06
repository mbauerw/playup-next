import { useState, useCallback } from 'react';
import { spotifyUsers } from '@/services/spotify/users';
import type { CurrentUser, UserTopItems, FollowedArtists } from '@/types';
import { useSpotifyContext } from '@/contexts/SpotifyContext';


interface UseSpotifyUsersReturn {
  // State
  currentUser: CurrentUser | null;
  topItems: UserTopItems | null;
  followedArtists: FollowedArtists | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchCurrentUser: (accessToken: string) => Promise<void>;
  fetchTopItems: (
    type: 'artists' | 'tracks',
    options?: {
      time_range?: 'short_term' | 'medium_term' | 'long_term';
      limit?: number;
      offset?: number;
    }
  ) => Promise<void>;
  fetchFollowedArtists: (
    options?: { type?: string; after?: string; limit?: number }
  ) => Promise<void>;
  clearData: () => void;
}

export const useSpotifyUsers = (): UseSpotifyUsersReturn => {
  const { getAccessToken } = useSpotifyContext();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [topItems, setTopItems] = useState<UserTopItems | null>(null);
  const [followedArtists, setFollowedArtists] = useState<FollowedArtists | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      const data = await spotifyUsers.getCurrentUser(accessToken);
      setCurrentUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch current user');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTopItems = useCallback(async (
    type: 'artists' | 'tracks',
    options?: {
      time_range?: 'short_term' | 'medium_term' | 'long_term';
      limit?: number;
      offset?: number;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      const data = await spotifyUsers.getTopItems(accessToken, type, options);
      setTopItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch top items');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFollowedArtists = useCallback(async (
    options?: { type?: string; after?: string; limit?: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      const data = await spotifyUsers.getFollowedArtists(accessToken, options);
      setFollowedArtists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch followed artists');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setCurrentUser(null);
    setTopItems(null);
    setFollowedArtists(null);
    setError(null);
  }, []);

  return {
    currentUser,
    topItems,
    followedArtists,
    loading,
    error,
    fetchCurrentUser,
    fetchTopItems,
    fetchFollowedArtists,
    clearData,
  };
};