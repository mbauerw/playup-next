import type { SpotifyTrack } from "./track";
import { SpotifyArtist } from './artist';
import { SpotifyAlbum } from './album';
import { SpotifyUser } from './user';
import { SpotifyPlaylist } from "./playlist";

export interface SearchResults {
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