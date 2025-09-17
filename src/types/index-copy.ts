// // Auth types
// export interface SpotifyTokenResponse {
//   access_token: string;
//   token_type: string;
//   expires_in: number;
// }

// export interface UsePkceAuthReturn {
//   code: string;
//   isLoading: boolean;
//   error: string | null;
//   initiateAuth: () => Promise<void>;
//   clearAuth: () => void;
// }

// // Spotify API types
// export interface SpotifyImage {
//   height: number | null;
//   url: string;
//   width: number | null;
// }

// export interface SpotifyExternalUrls {
//   spotify: string;
// }

// export interface SpotifyExplicitContent {
//   filter_enabled: boolean;
//   filter_locked: boolean;
// }

// export interface Followers {
//   href: string | null;
//   total: number;
// }

// export interface SpotifyUser {
//   display_name: string;
//   external_urls: {
//     spotify: string;
//   };
//   href: string;
//   id: string;
//   type: 'user';
//   uri: string;
// }

// export interface CurrentUser {
//   country: string;
//   display_name: string;
//   email: string;
//   explicit_content: SpotifyExplicitContent;
//   external_urls: SpotifyExternalUrls;
//   followers: Followers;
//   href: string;
//   id: string;
//   images: SpotifyImage[];
//   product: string;
//   type: string;
//   uri: string;
// }

// // Playlist types
// export interface SpotifyPlaylistOwner {
//   external_urls: SpotifyExternalUrls;
//   href: string;
//   id: string;
//   type: "user";
//   uri: string;
//   display_name: string;
// }

// export interface SpotifyPlaylistTracks {
//   href: string;
//   total: number;
// }

// export interface SpotifyPlaylist {
//   collaborative: boolean;
//   description: string | null;
//   external_urls: {
//     spotify: string;
//   };
//   href: string;
//   id: string;
//   images: SpotifyImage[];
//   name: string;
//   owner: SpotifyUser;
//   primary_color: string | null;
//   public: boolean;
//   snapshot_id: string;
//   tracks: {
//     href: string;
//     total: number;
//   };
//   type: 'playlist';
//   uri: string;
// }

// export interface CurrentUserPlaylists {
//   href: string;
//   limit: number;
//   next: string | null;
//   offset: number;
//   previous: string | null;
//   total: number;
//   items: SpotifyPlaylist[];
// }

// export interface GetPlaylistsParams {
//   limit?: number;
//   offset?: number;
// }

// // Artist types
// export interface SpotifyArtist {
//   external_urls: SpotifyExternalUrls;
//   followers: Followers;
//   genres: string[];
//   href: string;
//   id: string;
//   images: SpotifyImage[];
//   name: string;
//   popularity: number;
//   type: string;
//   uri: string;
// }

// // NEW: Album types
// export interface SpotifyRestrictions {
//   reason: string;
// }

// export interface SpotifyAlbum {
//   album_type: string;
//   total_tracks: number;
//   available_markets: string[];
//   external_urls: SpotifyExternalUrls;
//   href: string;
//   id: string;
//   images: SpotifyImage[];
//   name: string;
//   release_date: string;
//   release_date_precision: string;
//   restrictions?: SpotifyRestrictions;
//   type: 'album';
//   uri: string;
//   artists: SpotifyArtist[];
// }

// // NEW: Track types
// export interface SpotifyExternalIds {
//   isrc?: string;
//   ean?: string;
//   upc?: string;
// }

// export interface SpotifyLinkedFrom {
//   // This can be expanded based on actual usage
//   // The API response shows an empty object
// }

// export interface SpotifyTrack {
//   album: SpotifyAlbum;
//   artists: SpotifyArtist[];
//   available_markets: string[];
//   disc_number: number;
//   duration_ms: number;
//   explicit: boolean;
//   external_ids: SpotifyExternalIds;
//   external_urls: SpotifyExternalUrls;
//   href: string;
//   id: string;
//   is_playable: boolean;
//   linked_from?: SpotifyLinkedFrom;
//   restrictions?: SpotifyRestrictions;
//   name: string;
//   popularity: number;
//   preview_url: string | null;
//   track_number: number;
//   type: 'track';
//   uri: string;
//   is_local: boolean;
// }

// // NEW: Multiple tracks response (for getSeveralTracks)
// export interface MultipleTracks {
//   tracks: (SpotifyTrack | null)[];
// }

// // NEW: Saved tracks response (for getSavedTracks)
// export interface SavedTrack {
//   added_at: string;
//   track: SpotifyTrack;
// }

// export interface SavedTracks {
//   href: string;
//   limit: number;
//   next: string | null;
//   offset: number;
//   previous: string | null;
//   total: number;
//   items: SavedTrack[];
// }

// export interface PlaylistTrack {
//   added_at: string;
//   added_by: SpotifyUser;
//   is_local: boolean;
//   track: SpotifyTrack;
// }

// export interface PlaylistTracks {
//   added_at: string;
//   added_by: SpotifyUser;
//   is_local: boolean;
//   track: SpotifyTrack[];
// }

// export interface PlaylistItems {
//   href: string;
//   limit: number;
//   next: string | null;
//   offset: number;
//   previous: string | null;
//   total: number;
//   items: PlaylistTrack[];
// }

// export interface CreatePlaylistData {
//   name: string;
//   description: string;
//   public: boolean;
// }

// export interface UserTopItems {
//   href: string;
//   limit: number;
//   next: string | null;
//   offset: number;
//   previous: string | null;
//   total: number;
//   items: SpotifyArtist[] | SpotifyTrack[];
// }

// export interface SpotifyCursors {
//   after: string;
//   before?: string;
// }

// export interface FollowedArtistsData {
//   href: string;
//   limit: number;
//   next: string | null;
//   cursors: SpotifyCursors;
//   total: number;
//   items: SpotifyArtist[];
// }

// export interface FollowedArtists {
//   artists: FollowedArtistsData;
// }