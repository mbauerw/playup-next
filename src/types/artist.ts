import { SpotifyCursors, SpotifyExternalUrls, SpotifyImage, Followers } from './common';

export interface SpotifyArtist {
  id: string;
  name: string;
  popularity: number;
  genres: string[];
  images: SpotifyImage[];
  followers: Followers;
  href: string;
  external_urls: SpotifyExternalUrls;
  type: string;
  uri: string;
}

export interface MultipleTrackArtists {
  artists: SpotifyArtist[][];
}

export interface MultipleTopArtists {
  artists: SpotifyArtist[];
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

