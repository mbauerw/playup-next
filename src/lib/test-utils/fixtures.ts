import { SpotifyTrack, MultipleTracks, AlbumTrack, AlbumTracks, SpotifyAlbum, SpotifyArtist, SpotifyExternalUrls, SpotifyImage, Followers } from '@/types';

export const createMockSpotifyTrack = (overrides?: Partial<SpotifyTrack>): SpotifyTrack => ({
  album: {} as any,
  artists: [],
  available_markets: [],
  disc_number: 1,
  duration_ms: 180000,
  explicit: false,
  external_ids: {} as any,
  external_urls: {} as any,
  href: 'https://api.spotify.com/v1/tracks/test',
  id: 'test-id',
  is_playable: true,
  name: 'Test Track',
  popularity: 50,
  preview_url: null,
  track_number: 1,
  type: 'track',
  uri: 'spotify:track:test',
  is_local: false,
  ...overrides, // Override specific properties
});

// Helper to create a mock Followers
export const createMockFollowers = (overrides?: Partial<Followers>): Followers => ({
  href: null,
  total: 10000,
  ...overrides,
});

// Helper to create a mock SpotifyExternalUrls
export const createMockExternalUrls = (overrides?: Partial<SpotifyExternalUrls>): SpotifyExternalUrls => ({
  spotify: 'https://open.spotify.com/test',
  ...overrides,
});

// Helper to create a mock SpotifyImage
export const createMockSpotifyImage = (overrides?: Partial<SpotifyImage>): SpotifyImage => ({
  url: 'https://i.scdn.co/image/test',
  height: 640,
  width: 640,
  ...overrides,
});

// Helper to create a mock SpotifyArtist
export const createMockSpotifyArtist = (overrides?: Partial<SpotifyArtist>): SpotifyArtist => ({
  external_urls: createMockExternalUrls({ spotify: 'https://open.spotify.com/artist/test' }),
  followers: createMockFollowers(),
  genres: ['pop', 'rock'],
  href: 'https://api.spotify.com/v1/artists/test',
  id: 'artist-test-id',
  images: [
    createMockSpotifyImage({ height: 640, width: 640 }),
    createMockSpotifyImage({ height: 320, width: 320 }),
    createMockSpotifyImage({ height: 160, width: 160 }),
  ],
  name: 'Test Artist',
  popularity: 75,
  type: 'artist',
  uri: 'spotify:artist:test',
  ...overrides,
});

// Helper to create a mock AlbumTrack
export const createMockAlbumTrack = (overrides?: Partial<AlbumTrack>): AlbumTrack => ({
  artists: [createMockSpotifyArtist()],
  available_markets: ['US', 'CA', 'GB'],
  disc_number: 1,
  duration_ms: 180000,
  explicit: false,
  external_urls: createMockExternalUrls(),
  href: 'https://api.spotify.com/v1/tracks/test',
  id: 'track-test-id',
  is_playable: true,
  name: 'Test Track',
  preview_url: 'https://p.scdn.co/mp3-preview/test',
  track_number: 1,
  type: 'track',
  uri: 'spotify:track:test',
  is_local: false,
  ...overrides,
});

// Helper to create a mock AlbumTracks collection
export const createMockAlbumTracks = (overrides?: Partial<AlbumTracks>): AlbumTracks => ({
  href: 'https://api.spotify.com/v1/albums/test/tracks',
  limit: 20,
  next: null,
  offset: 0,
  previous: null,
  total: 10,
  items: [
    createMockAlbumTrack({ id: 'track-1', name: 'Track 1', track_number: 1 }),
    createMockAlbumTrack({ id: 'track-2', name: 'Track 2', track_number: 2 }),
  ],
  ...overrides,
});

// Helper to create a mock SpotifyAlbum
export const createMockSpotifyAlbum = (overrides?: Partial<SpotifyAlbum>): SpotifyAlbum => ({
  album_type: 'album',
  total_tracks: 10,
  available_markets: ['US', 'CA', 'GB'],
  external_urls: createMockExternalUrls(),
  href: 'https://api.spotify.com/v1/albums/test',
  id: 'album-test-id',
  images: [
    createMockSpotifyImage({ height: 640, width: 640 }),
    createMockSpotifyImage({ height: 300, width: 300 }),
    createMockSpotifyImage({ height: 64, width: 64 }),
  ],
  name: 'Test Album',
  release_date: '2024-01-01',
  release_date_precision: 'day',
  type: 'album',
  uri: 'spotify:album:test',
  artists: [createMockSpotifyArtist()],
  ...overrides,
});