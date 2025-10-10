import { useState, useCallback } from 'react';
import { spotifyTracks } from '@/services/spotify/tracks';
import type { SavedTracks, SpotifyTrack, MultipleTracks, LimitOffsetParams } from '@/types';
import { useSpotifyContext } from '@/contexts/SpotifyContext';

interface UseSpotifyTracksReturn {
  // State
  savedTracks: SavedTracks | null;
  singleTrack: SpotifyTrack | null;
  multipleTracks: MultipleTracks | null;
  savedTrackStatus: Boolean[] | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchTrack: (trackId: string, market?: string) => Promise<void>;
  fetchSavedTracks: (options?: { limit?: number; offset?: number; market?: string }) => Promise<void>;
  fetchSeveralTracks: (trackIds: string[], market?: string) => Promise<MultipleTracks | null>;
  checkSavedStatus: (trackIds: string[], market?: string) => Promise<void>;
  clearData: () => void;
}

export const useSpotifyTracks = (): UseSpotifyTracksReturn => {
  const { getAccessToken } = useSpotifyContext();

  const [savedTracks, setSavedTracks] = useState<SavedTracks | null>(null);
  const [singleTrack, setSingleTrack] = useState<SpotifyTrack | null>(null);
  const [multipleTracks, setMultipleTracks] = useState<MultipleTracks | null>(null);
  const [savedTrackStatus, setSavedTrackStatus] = useState<Boolean[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrack = useCallback(async (
    trackId: string,
    market?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      const data = await spotifyTracks.getTrack(accessToken, trackId, market);
      setSingleTrack(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch track');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSavedTracks = useCallback(async (
    options?: {
      limit?: number,
      offset?: number,
      market?: string 
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      const data = await spotifyTracks.getSavedTracks(accessToken, options);
      setSavedTracks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch saved tracks');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSeveralTracks = useCallback(async (
    trackIds: string[],
    market?: string
  ): Promise<MultipleTracks | null> => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      const data = await spotifyTracks.getSeveralTracks(accessToken, trackIds, market);
      setMultipleTracks(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch several tracks');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkSavedStatus = useCallback(async (
    trackIds: string[],
    market?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      const data = await spotifyTracks.checkUsersSavedTracks(accessToken, trackIds, market);
      setSavedTrackStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check saved track status');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setSavedTracks(null);
    setSingleTrack(null);
    setMultipleTracks(null);
    setSavedTrackStatus(null);
    setError(null);
  }, []);

  return {
    savedTracks,
    singleTrack,
    multipleTracks,
    savedTrackStatus,
    loading,
    error,
    fetchTrack,
    fetchSavedTracks,
    fetchSeveralTracks,
    checkSavedStatus,
    clearData,
  };
};