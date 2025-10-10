import { getPlaylistTracks, getPlaylistArtists, rankPlaylistTracks } from '../parsers/parseSpotifyPlaylist'
import { spotifyPlaylists } from '@/services/spotify';
import { rankSongPopularity } from '../parsers/parseAlbumTracks';
import { MultipleTracks, SpotifyPlaylist } from '@/types';
import { createMockSpotifyArtist } from '@/lib/test-utils/fixtures';

// Mock the dependencies
jest.mock('@/services/spotify', () => ({
  spotifyPlaylists: {
    getPlaylistItems: jest.fn()
  }
}));

jest.mock('../analysis/parsers/parseAlbumTracks', () => ({
  rankSongPopularity: jest.fn()
}));

// Type the mocks
const mockGetPlaylistItems = spotifyPlaylists.getPlaylistItems as jest.MockedFunction<typeof spotifyPlaylists.getPlaylistItems>;
const mockRankSongPopularity = rankSongPopularity as jest.MockedFunction<typeof rankSongPopularity>;

// Helper to create multiple artists
const createMockArtists = (count: number) => {
  return Array.from({ length: count }, (_, i) => 
    createMockSpotifyArtist({ 
      id: `artist-${i + 1}`, 
      name: `Artist ${i + 1}`,
      popularity: Math.floor(Math.random() * 100) // Random popularity 0-99
    })
  );
};

describe('parseSpotifyPlaylist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlaylistTracks', () => {
    it('should extract tracks from playlist items', async () => {
      // Arrange
      const mockArtists = createMockArtists(2);
      const mockPlaylistItems = {
        items: [
          { track: { id: '1', name: 'Song 1', artists: [mockArtists[0]] } },
          { track: { id: '2', name: 'Song 2', artists: [mockArtists[1]] } },
        ]
      };
      
      mockGetPlaylistItems.mockResolvedValue(mockPlaylistItems as any);
      
      const playlist = { id: 'playlist-123' } as SpotifyPlaylist;
      const token = 'fake-token';

      // Act
      const result = await getPlaylistTracks(playlist, token);

      // Assert
      expect(result.tracks).toHaveLength(2);
      expect(result.tracks[0].id).toBe('1');
      expect(result.tracks[1].id).toBe('2');
      expect(result.tracks[0].artists[0].name).toBe('Artist 1');
      expect(mockGetPlaylistItems).toHaveBeenCalledWith(token, 'playlist-123', undefined);
    });

    it('should filter out null tracks', async () => {
      const mockArtist = createMockSpotifyArtist();
      const mockPlaylistItems = {
        items: [
          { track: { id: '1', name: 'Song 1', artists: [mockArtist] } },
          { track: null },
          { track: undefined },
          { track: { id: '2', name: 'Song 2', artists: [mockArtist] } },
        ]
      };
      
      mockGetPlaylistItems.mockResolvedValue(mockPlaylistItems as any);

      const result = await getPlaylistTracks('playlist-123', 'token');

      expect(result.tracks).toHaveLength(2);
      expect(result.tracks[0].id).toBe('1');
      expect(result.tracks[1].id).toBe('2');
    });

    it('should handle string playlist ID', async () => {
      mockGetPlaylistItems.mockResolvedValue({ items: [] } as any);
      
      await getPlaylistTracks('playlist-456', 'token');
      
      expect(mockGetPlaylistItems).toHaveBeenCalledWith('token', 'playlist-456', undefined);
    });

    it('should pass options to getPlaylistItems', async () => {
      mockGetPlaylistItems.mockResolvedValue({ items: [] } as any);
      const options = { limit: 10, offset: 5 };
      
      await getPlaylistTracks('playlist-123', 'token', options);
      
      expect(mockGetPlaylistItems).toHaveBeenCalledWith('token', 'playlist-123', options);
    });
  });

  describe('getPlaylistArtists', () => {
    it('should extract artists from all tracks', () => {
      // Arrange - Create 10 random artists
      const tenArtists = createMockArtists(10);
      
      const multipleTracks: MultipleTracks = {
        tracks: [
          { 
            id: '1', 
            artists: [tenArtists[0], tenArtists[1]]
          },
          { 
            id: '2', 
            artists: [tenArtists[2]]
          },
          { 
            id: '3', 
            artists: tenArtists.slice(3, 10) // Remaining 7 artists
          },
        ]
      } as MultipleTracks;

      // Act
      const result = getPlaylistArtists(multipleTracks);

      // Assert
      expect(result.artists).toHaveLength(3);
      expect(result.artists[0]).toHaveLength(2); // First track has 2 artists
      expect(result.artists[1]).toHaveLength(1); // Second track has 1 artist
      expect(result.artists[2]).toHaveLength(7); // Third track has 7 artists
      expect(result.artists[0][0].name).toBe('Artist 1');
      expect(result.artists[0][1].name).toBe('Artist 2');
    });

    it('should filter out null tracks', () => {
      const mockArtist = createMockSpotifyArtist({ name: 'Solo Artist' });
      const multipleTracks: MultipleTracks = {
        tracks: [
          { id: '1', artists: [mockArtist] },
          null,
          { id: '2', artists: [mockArtist] },
        ]
      } as any;

      const result = getPlaylistArtists(multipleTracks);

      expect(result.artists).toHaveLength(2);
      expect(result.artists[0][0].name).toBe('Solo Artist');
    });

    it('should handle empty tracks array', () => {
      const multipleTracks: MultipleTracks = { tracks: [] };

      const result = getPlaylistArtists(multipleTracks);

      expect(result.artists).toHaveLength(0);
    });
  });

  describe('rankPlaylistTracks', () => {
    it('should get tracks and rank them by popularity', async () => {
      // Arrange
      const mockArtists = createMockArtists(2);
      const mockTracks: MultipleTracks = {
        tracks: [
          { id: '1', popularity: 30, artists: [mockArtists[0]] },
          { id: '2', popularity: 90, artists: [mockArtists[1]] },
        ]
      } as MultipleTracks;

      const mockRankedTracks: MultipleTracks = {
        tracks: [
          { id: '2', popularity: 90, artists: [mockArtists[1]] },
          { id: '1', popularity: 30, artists: [mockArtists[0]] },
        ]
      } as MultipleTracks;

      mockGetPlaylistItems.mockResolvedValue({
        items: [
          { track: mockTracks.tracks[0] },
          { track: mockTracks.tracks[1] },
        ]
      } as any);

      mockRankSongPopularity.mockReturnValue(mockRankedTracks);

      const playlist = { id: 'playlist-123' } as SpotifyPlaylist;
      const token = 'token';

      // Act
      const result = await rankPlaylistTracks(playlist, token);

      // Assert
      expect(mockGetPlaylistItems).toHaveBeenCalledWith(token, 'playlist-123', undefined);
      expect(mockRankSongPopularity).toHaveBeenCalledWith(mockTracks);
      expect(result).toEqual(mockRankedTracks);
      expect(result.tracks[0].popularity).toBe(90); // Highest first
    });

    it('should pass options through to getPlaylistTracks', async () => {
      mockGetPlaylistItems.mockResolvedValue({ items: [] } as any);
      mockRankSongPopularity.mockReturnValue({ tracks: [] });

      const options = { limit: 50, offset: 10 };
      await rankPlaylistTracks({ id: 'playlist-123' } as SpotifyPlaylist, 'token', options);

      expect(mockGetPlaylistItems).toHaveBeenCalledWith('token', 'playlist-123', options);
    });
  });
});