import { useState, useCallback } from 'react';
import { spotifyApi } from '@/services/spotify';
import { useSpotifyContext } from '@/contexts/SpotifyContext';


// Define search result types
interface SearchResults {
  tracks?: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: any[]; // You can replace with SpotifyTrack[] if you have the type
  };
  artists?: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: any[]; // You can replace with SpotifyArtist[] if you have the type
  };
  albums?: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: any[]; // You can replace with SpotifyAlbum[] if you have the type
  };
  playlists?: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: any[]; // You can replace with SpotifyPlaylist[] if you have the type
  };
}

interface UseSpotifySearchReturn {
  // State
  searchResults: SearchResults | null;
  loading: boolean;
  error: string | null;

  // Actions
  search: ( 
    query: string, 
    type: string,
    options?: { limit?: number; offset?: number; market?: string; include_external?: string }
  ) => Promise<void>;
  clearResults: () => void;
}

export const useSpotifySearch = (): UseSpotifySearchReturn => {
  const { getAccessToken } = useSpotifyContext();

  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (
    query: string,
    type: string,
    options?: { 
      limit?: number; 
      offset?: number; 
      market?: string; 
      include_external?: string 
    }
  ) => {
    if (!query.trim()) {
      setError('Search query cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Build search parameters
      const searchParams = new URLSearchParams({
        q: query,
        type: type
      });

      if (options?.limit) searchParams.append('limit', options.limit.toString());
      if (options?.offset) searchParams.append('offset', options.offset.toString());
      if (options?.market) searchParams.append('market', options.market);
      if (options?.include_external) searchParams.append('include_external', options.include_external);

      const accessToken = await getAccessToken();
      const data = await spotifyApi.search(accessToken, query, type);
      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform search');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults(null);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    search,
    clearResults,
  };
};