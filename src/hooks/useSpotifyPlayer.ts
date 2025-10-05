import { useState, useCallback } from 'react';
import { spotifyApi } from '@/services/spotify';
import { Device, PlaybackState, RecentlyPlayedTracks } from '@/types';
import { useSpotifyContext } from '@/contexts/SpotifyContext';



interface UseSpotifyPlayerReturn {
  // State
  playbackState: PlaybackState | null;
  recentTracks: RecentlyPlayedTracks | null;
  loading: boolean;
  error: string | null;

  // Actions
  getCurrentPlayback: (accessToken: string, market?: string) => Promise<void>;
  pausePlayback: (accessToken: string, deviceId?: string) => Promise<void>;
  fetchRecentlyPlayed: (accessToken: string, options?: {limit?: number, after?: number, before?: number}) => Promise<void>;
  resumePlayback: (
    accessToken: string, 
    deviceId?: string,
    contextUri?: string,
    uris?: string[],
    offset?: { position?: number; uri?: string },
    positionMs?: number
  ) => Promise<void>;
  skipToNext: (accessToken: string, deviceId?: string) => Promise<void>;
  skipToPrevious: (accessToken: string, deviceId?: string) => Promise<void>;
  setVolume: (accessToken: string, volumePercent: number, deviceId?: string) => Promise<void>;
  toggleShuffle: (accessToken: string, state: boolean, deviceId?: string) => Promise<void>;
  setRepeatMode: (accessToken: string, state: 'track' | 'context' | 'off', deviceId?: string) => Promise<void>;
  clearData: () => void;
}

export const useSpotifyPlayer = (): UseSpotifyPlayerReturn => {
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  const [recentTracks, setRecentTracks] = useState<RecentlyPlayedTracks | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentPlayback = useCallback(async (
    accessToken: string,
    market?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyApi.getCurrentPlayback(accessToken);
      setPlaybackState(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current playback');
    } finally {
      setLoading(false);
    }
  }, []);

  const pausePlayback = useCallback(async (
    accessToken: string,
    deviceId?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await spotifyApi.pausePlayback(accessToken);
      // Refresh playback state after pausing
      await getCurrentPlayback(accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause playback');
    } finally {
      setLoading(false);
    }
  }, [getCurrentPlayback]);

  const fetchRecentlyPlayed = useCallback(async (
    accessToken: string,
    options?: {limit?: number, after?: number, before?: number}
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyApi.getRecentlyPlayed(accessToken, options);
      setRecentTracks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recently played');
    } finally {
      setLoading(false);
    }
  }, []);

  // Note: The following functions assume you'll extend your spotifyApi to include these methods
  const resumePlayback = useCallback(async (
    accessToken: string,
    deviceId?: string,
    contextUri?: string,
    uris?: string[],
    offset?: { position?: number; uri?: string },
    positionMs?: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      // This would need to be implemented in your spotifyApi
      const endpoint = deviceId ? `/me/player/play?device_id=${deviceId}` : '/me/player/play';
      const body: any = {};
      
      if (contextUri) body.context_uri = contextUri;
      if (uris) body.uris = uris;
      if (offset) body.offset = offset;
      if (positionMs) body.position_ms = positionMs;

      const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Resume playback failed: ${response.status}`);
      }

      // Refresh playback state after resuming
      await getCurrentPlayback(accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume playback');
    } finally {
      setLoading(false);
    }
  }, [getCurrentPlayback]);

  const skipToNext = useCallback(async (
    accessToken: string,
    deviceId?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = deviceId ? `/me/player/next?device_id=${deviceId}` : '/me/player/next';
      const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Skip to next failed: ${response.status}`);
      }

      // Refresh playback state after skipping
      await getCurrentPlayback(accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to skip to next track');
    } finally {
      setLoading(false);
    }
  }, [getCurrentPlayback]);

  const skipToPrevious = useCallback(async (
    accessToken: string,
    deviceId?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = deviceId ? `/me/player/previous?device_id=${deviceId}` : '/me/player/previous';
      const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Skip to previous failed: ${response.status}`);
      }

      // Refresh playback state after skipping
      await getCurrentPlayback(accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to skip to previous track');
    } finally {
      setLoading(false);
    }
  }, [getCurrentPlayback]);

  const setVolume = useCallback(async (
    accessToken: string,
    volumePercent: number,
    deviceId?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ volume_percent: volumePercent.toString() });
      if (deviceId) params.append('device_id', deviceId);

      const response = await fetch(`https://api.spotify.com/v1/me/player/volume?${params}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Set volume failed: ${response.status}`);
      }

      // Refresh playback state after volume change
      await getCurrentPlayback(accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set volume');
    } finally {
      setLoading(false);
    }
  }, [getCurrentPlayback]);

  const toggleShuffle = useCallback(async (
    accessToken: string,
    state: boolean,
    deviceId?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ state: state.toString() });
      if (deviceId) params.append('device_id', deviceId);

      const response = await fetch(`https://api.spotify.com/v1/me/player/shuffle?${params}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Toggle shuffle failed: ${response.status}`);
      }

      // Refresh playback state after shuffle change
      await getCurrentPlayback(accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle shuffle');
    } finally {
      setLoading(false);
    }
  }, [getCurrentPlayback]);

  const setRepeatMode = useCallback(async (
    accessToken: string,
    state: 'track' | 'context' | 'off',
    deviceId?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ state });
      if (deviceId) params.append('device_id', deviceId);

      const response = await fetch(`https://api.spotify.com/v1/me/player/repeat?${params}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Set repeat mode failed: ${response.status}`);
      }

      // Refresh playback state after repeat change
      await getCurrentPlayback(accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set repeat mode');
    } finally {
      setLoading(false);
    }
  }, [getCurrentPlayback]);

  const clearData = useCallback(() => {
    setPlaybackState(null);
    setRecentTracks(null);
    setError(null);
  }, []);

  return {
    playbackState,
    recentTracks,
    loading,
    error,
    getCurrentPlayback,
    pausePlayback,
    fetchRecentlyPlayed,
    resumePlayback,
    skipToNext,
    skipToPrevious,
    setVolume,
    toggleShuffle,
    setRepeatMode,
    clearData,
  };
};