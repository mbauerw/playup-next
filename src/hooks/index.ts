// Export all Spotify-related hooks
export { useSpotifyAuth, useSpotifyToken } from './useSpotifyAuth';
export { useSpotifyUsers } from './useSpotifyUsers';
export { useSpotifyArtists } from './useSpotifyArtists';
export { useSpotifyTracks } from './useSpotifyTracks';
export { useSpotifyPlaylists } from './useSpotifyPlaylists';
export { useSpotifySearch } from './useSpotifySearch';
export { useSpotifyPlayer } from './useSpotifyPlayer';
export { useSpotifyAlbums } from './useSpotifyAlbums';

// Re-export legacy hooks for backward compatibility
export { 
  useSpotifyProfile, 
  useSpotifyPlaylists as useSpotifyPlaylistsLegacy, 
  useSpotifyArtist 
} from './useSpotifyData';