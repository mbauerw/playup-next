// src/lib/__tests__/useSpotifyArtists.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { useSpotifyArtists } from '../../hooks/useSpotifyArtists';
import { spotifyArtists } from '@/services/spotify/artists';
import { createMockSpotifyArtist } from '@/lib/test-utils/fixtures';

// Mock the Spotify service
jest.mock('@/services/spotify/artists', () => ({
  spotifyArtists: {
    getArtist: jest.fn(),
    getSeveralArtists: jest.fn(),
    getArtistAlbums: jest.fn(),
    getArtistTopTracks: jest.fn(),
  }
}));

// Mock the context
jest.mock('@/contexts/SpotifyContext', () => ({
  useSpotifyContext: jest.fn(() => ({
    accessToken: 'mock-token',
    getAccessToken: jest.fn().mockResolvedValue('mock-token'),
    isAuthenticated: true,
    isLoading: false,
    tokenError: null,
  })),
}));

const mockSpotifyArtists = spotifyArtists as jest.Mocked<typeof spotifyArtists>;

describe('useSpotifyArtists', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchArtist', () => {
    it('should fetch a single artist successfully', async () => {
      const mockArtist = createMockSpotifyArtist({ 
        id: 'artist-123', 
        name: 'Test Artist' 
      });
      mockSpotifyArtists.getArtist.mockResolvedValue(mockArtist);

      const { result } = renderHook(() => useSpotifyArtists());

      expect(result.current.artist).toBeNull();
      expect(result.current.loading).toBe(false);

      await act(async () => {
        await result.current.fetchArtist('artist-123');
      });

      expect(mockSpotifyArtists.getArtist).toHaveBeenCalledWith('mock-token', 'artist-123');
      expect(result.current.artist).toEqual(mockArtist);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      const errorMessage = 'Network error';
      mockSpotifyArtists.getArtist.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useSpotifyArtists());

      await act(async () => {
        await result.current.fetchArtist('artist-123');
      });

      expect(result.current.artist).toBeNull();
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('clearData', () => {
    it('should clear all data and error state', async () => {
      const mockArtist = createMockSpotifyArtist();
      mockSpotifyArtists.getArtist.mockResolvedValue(mockArtist);

      const { result } = renderHook(() => useSpotifyArtists());

      await act(async () => {
        await result.current.fetchArtist('artist-123');
      });

      expect(result.current.artist).not.toBeNull();

      act(() => {
        result.current.clearData();
      });

      expect(result.current.artist).toBeNull();
      expect(result.current.artists).toBeNull();
      expect(result.current.artistAlbums).toBeNull();
      expect(result.current.artistTopTracks).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });
});