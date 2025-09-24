import { SpotifyExternalUrls, SpotifyImage } from './common';
import { SpotifyUser } from './user';
import { SpotifyTrack, PlaylistTrack, SpotifyPlaylistTracks } from './track';

export interface SpotifyPlaylistOwner {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  type: "user";
  uri: string;
  display_name: string;
}


export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string | null;
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: SpotifyUser;
  primary_color: string | null;
  public: boolean;
  snapshot_id: string;
  tracks: SpotifyPlaylistTracks;
  type: 'playlist';
  uri: string;
}

export interface CurrentUserPlaylists {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyPlaylist[];
}

export interface LimitOffsetParams {
  limit?: number;
  offset?: number;
}

export interface PlaylistItems {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: PlaylistTrack[];
}

export interface CreatePlaylistData {
  name: string;
  description: string;
  public: boolean;
}

export interface RemovePlaylistItemsData {
  tracks: [
        {
            uri: string
        }
    ],
    snapshot_id: string
}