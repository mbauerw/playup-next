
// Auth types
export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface UsePkceAuthReturn {
  code: string;
  isLoading: boolean;
  error: string | null;
  initiateAuth: () => Promise<void>;
  clearAuth: () => void;
}

// Spotify API types
export interface SpotifyImage {
  height: number | null;
  url: string;
  width: number | null;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyExplicitContent {
  filter_enabled: boolean;
  filter_locked: boolean;
}

export interface Followers {
  href: string | null;
  total: number;
}

export interface SpotifyUser {
  display_name: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  type: 'user';
  uri: string;
}

export interface CurrentUser {
  country: string;
  display_name: string;
  email: string;
  explicit_content: SpotifyExplicitContent;
  external_urls: SpotifyExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: SpotifyImage[];
  product: string;
  type: string;
  uri: string;
}

// Playlist types
export interface SpotifyPlaylistOwner {
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  type: "user";
  uri: string;
  display_name: string;
}

export interface SpotifyPlaylistTracks {
  href: string;
  total: number;
}

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string | null;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: SpotifyUser;
  primary_color: string | null;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
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

export interface GetPlaylistsParams {
  limit?: number;
  offset?: number;
}

// Artist types
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