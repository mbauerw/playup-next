import { SpotifyExternalUrls, SpotifyImage, SpotifyLinkedFrom, SpotifyRestrictions, SpotifyExternalIds } from './common';
import { SpotifyArtist } from './artist';

// Simplified track interface for album tracks (missing some properties like album, external_ids, popularity)
export interface AlbumTrack {
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from?: SpotifyLinkedFrom;
  restrictions?: SpotifyRestrictions;
  name: string;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

export interface AlbumTracks {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: AlbumTrack[];
}
export interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: SpotifyRestrictions;
  type: 'album';
  uri: string;
  artists: SpotifyArtist[];
}

export interface MultipleAlbums {
  albums: (SpotifyAlbum | null)[];
}

export interface Copyright {
  text: string;
  type: string;
}

// Extended album interface for saved albums (includes additional metadata)
export interface SavedAlbumData extends SpotifyAlbum {
  tracks: AlbumTracks;
  copyrights: Copyright[];
  external_ids: SpotifyExternalIds;
  genres: string[];
  label: string;
  popularity: number;
}

// Individual saved album item
export interface SavedAlbum {
  added_at: string;
  album: SavedAlbumData;
}

// Response interface for saved albums
export interface SavedAlbums {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SavedAlbum[];
}