import { 
  SpotifyExternalUrls, 
  SpotifyExternalIds, 
  SpotifyRestrictions, 
  SpotifyLinkedFrom 
} from './common';
import { SpotifyArtist } from './artist';
import { SpotifyAlbum } from './album';
import { SpotifyUser } from './user';

export interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: SpotifyExternalIds;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from?: SpotifyLinkedFrom;
  restrictions?: SpotifyRestrictions;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: 'track';
  uri: string;
  is_local: boolean;
}

export interface MultipleTracks {
  tracks: (SpotifyTrack | null)[];
}

export interface SavedTrack {
  added_at: string;
  track: SpotifyTrack;
}

export interface SavedTracks {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SavedTrack[];
}

export interface PlaylistTrack {
  added_at: string;
  added_by: SpotifyUser;
  is_local: boolean;
  track: SpotifyTrack;
}

export interface SpotifyPlaylistTracks {
  href: string;
  total: number;
}

export interface UserTopItems {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyArtist[] | SpotifyTrack[];
}