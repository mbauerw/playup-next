'use client'

import { useState, useCallback } from 'react';
import { searchAPI } from '@/services/api/search';
import { SpotifyAlbum, SpotifyArtist, SpotifyPlaylist, SpotifyTrack } from '@/types';

// Define search result types
interface SearchResults {
  tracks?: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: SpotifyTrack[]; 
  };
  artists?: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: SpotifyArtist[]; 
  };
  albums?: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: SpotifyAlbum[]; 
  };
  playlists?: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: SpotifyPlaylist[];
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
      const data = await searchAPI.search(query, type, options);
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