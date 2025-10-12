'use client'

import { useState, useCallback } from 'react';
import { playerAPI } from '@/services/api/player';
import { PlaybackState, RecentlyPlayedTracks } from '@/types';

interface UseSpotifyPlayerReturn {
  // State
  playbackState: PlaybackState | null;
  recentTracks: RecentlyPlayedTracks | null;
  loading: boolean;
  error: string | null;

  // Actions
  getCurrentPlayback: (market?: string) => Promise<void>;
  pausePlayback: (deviceId?: string) => Promise<void>;
  fetchRecentlyPlayed: (options?: {
    limit?: number;
    after?: number;
    before?: number;
  }) => Promise<void>;
  resumePlayback: (
    deviceId?: string,
    contextUri?: string,
    uris?: string[],
    offset?: { position?: number; uri?: string },
    positionMs?: number
  ) => Promise<void>;
  skipToNext: (deviceId?: string) => Promise<void>;
  skipToPrevious: (deviceId?: string) => Promise<void>;
  setVolume: (volumePercent: number, deviceId?: string) => Promise<void>;
  toggleShuffle: (state: boolean, deviceId?: string) => Promise<void>;
  setRepeatMode: (state: 'track' | 'context' | 'off', deviceId?: string) => Promise<void>;
  clearData: () => void;
}

export const useSpotifyPlayer = (): UseSpotifyPlayerReturn => {
  
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  const [recentTracks, setRecentTracks] = useState<RecentlyPlayedTracks | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentPlayback = useCallback(async (market?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await playerAPI.getCurrentPlayback(market);
      setPlaybackState(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current playback');
    } finally {
      setLoading(false);
    }
  }, []);

  const pausePlayback = useCallback(async (deviceId?: string) => {
    setLoading(true);
    setError(null);
    try {
      await playerAPI.pausePlayback(deviceId);
      await getCurrentPlayback();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause playback');
    } finally {
      setLoading(false);
    }
  }, [getCurrentPlayback]);

  const fetchRecentlyPlayed = useCallback(async (
    options?: { limit?: number; after?: number; before?: number }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await playerAPI.getRecentlyPlayed(options);
      setRecentTracks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recently played');
    } finally {
      setLoading(false);
    }
  }, []);

  const resumePlayback = useCallback(async (
    deviceId?: string,
    contextUri?: string,
    uris?: string[],
    offset?: { position?: number; uri?: string },
    positionMs?: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      await playerAPI.resumePlayback({
        deviceId,
        contextUri,
        uris,
        offset,
        positionMs,
      });
      await getCurrentPlayback();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume playback');
    } finally {
      setLoading(false);
    }
  }, [getCurrentPlayback]);

  const skipToNext = useCallback(async (deviceId?: string) => {
    setLoading(true);
    setError(null);
    try {
      await playerAPI.skipToNext(deviceId);
      await getCurrentPlayback();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to skip to next track');
    } finally {
      setLoading(false);
    }
  }, [getCurrentPlayback]);

  const skipToPrevious = useCallback(async (deviceId?: string) => {
    setLoading(true);
    setError(null);
    try {
      await playerAPI.skipToPrevious(deviceId);
      await getCurrentPlayback();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to skip to previous track');
    } finally {
      setLoading(false);
    }
  }, [getCurrentPlayback]);

  const setVolume = useCallback(async (
    volumePercent: number,
    deviceId?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await playerAPI.setVolume(volumePercent, deviceId);
      await getCurrentPlayback();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set volume');
    } finally {
      setLoading(false);
    }
  }, [getCurrentPlayback]);

  const toggleShuffle = useCallback(async (
    state: boolean,
    deviceId?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await playerAPI.toggleShuffle(state, deviceId);
      await getCurrentPlayback();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle shuffle');
    } finally {
      setLoading(false);
    }
  }, [getCurrentPlayback]);

  const setRepeatMode = useCallback(async (
    state: 'track' | 'context' | 'off',
    deviceId?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await playerAPI.setRepeatMode(state, deviceId);
      await getCurrentPlayback();
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