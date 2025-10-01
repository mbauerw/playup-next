import { SpotifyCursors, SpotifyExternalUrls, SpotifyImage, Followers } from './common';

export interface SpotifyArtist {
  external_urls: SpotifyExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface MultipleTrackArtists {
  artists: SpotifyArtist[][];
}

export interface PlaylistArtists {
  artists: SpotifyArtist[][];
  counts: Map<string, number>;
}

export interface PlaylistTopArtists {
  artists: SpotifyArtist[];
  counts: Map<string, number>
}

export interface FollowedArtistsData {
  href: string;
  limit: number;
  next: string | null;
  cursors: SpotifyCursors;
  total: number;
  items: SpotifyArtist[];
}

export interface FollowedArtists {
  artists: FollowedArtistsData;
}

