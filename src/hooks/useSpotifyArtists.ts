import { useState, useCallback } from 'react';
import { spotifyArtists } from '@/services/spotify/artists';
import type { SpotifyArtist, ArtistAlbums, MultipleTracks } from '@/types';
import { useSpotifyContext } from '@/contexts/SpotifyContext';


interface UseSpotifyArtistsReturn {
  // State
  artist: SpotifyArtist | null;
  artists: SpotifyArtist[] | null;
  artistAlbums: ArtistAlbums | null;
  artistTopTracks: MultipleTracks | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchArtist: (artistId: string) => Promise<void>;
  fetchSeveralArtists: (artistIds: string[]) => Promise<void>;
  fetchArtistAlbums: (
    artistId: string,
    options?: {
      include_groups?: string;
      market?: string;
      limit?: number;
      offset?: number;
    }
  ) => Promise<void>;
  fetchArtistTopTracks: (
    artistId: string,
    market?: string
  ) => Promise<void>;
  clearData: () => void;
}

export const useSpotifyArtists = (): UseSpotifyArtistsReturn => {
  const { getAccessToken } = useSpotifyContext();

  const [artist, setArtist] = useState<SpotifyArtist | null>(null);
  const [artists, setArtists] = useState<SpotifyArtist[] | null>(null);
  const [artistAlbums, setArtistAlbums] = useState<ArtistAlbums | null>(null);
  const [artistTopTracks, setArtistTopTracks] = useState<MultipleTracks | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtist = useCallback(async (
    artistId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      const data = await spotifyArtists.getArtist(accessToken, artistId);
      setArtist(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch artist');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSeveralArtists = useCallback(async (
    artistIds: string[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      const idsString = artistIds.join(',');
      const data = await spotifyArtists.getSeveralArtists(accessToken, idsString);
      setArtists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch artists');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArtistAlbums = useCallback(async (
    artistId: string,
    options?: {
      include_groups?: string;
      market?: string;
      limit?: number;
      offset?: number;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      const data = await spotifyArtists.getArtistAlbums(accessToken, artistId, options);
      setArtistAlbums(data);
      console.log("fetchArtistAlbums: ", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch artist albums');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArtistTopTracks = useCallback(async (
    artistId: string,
    market?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = await getAccessToken();
      const data = await spotifyArtists.getArtistTopTracks(accessToken, artistId, market);
      setArtistTopTracks(data);
      console.log("fetchArtistTopTracks: ", data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch artist top tracks');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setArtist(null);
    setArtists(null);
    setArtistAlbums(null);
    setArtistTopTracks(null);
    setError(null);
  }, []);

  return {
    artist,
    artists,
    artistAlbums,
    artistTopTracks,
    loading,
    error,
    fetchArtist,
    fetchSeveralArtists,
    fetchArtistAlbums,
    fetchArtistTopTracks,
    clearData,
  };
};