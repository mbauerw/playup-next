import { SpotifyPlaylist, SpotifyArtist, SpotifyAlbum, SpotifyTrack, MultipleTracks, PlaylistItems, PlaylistTrack, PlaylistArtists } from "@/types";
import { spotifyPlaylists } from "@/services/spotify";
import { rankSongPopularity } from "./parseAlbumTracks";


// Get id from play. fetchPlaylistItems
export const getPlaylistTracks = async (
  playlist: SpotifyPlaylist | string, 
  token: string, 
  options?: {limit?: number, offset?: number}
): Promise<MultipleTracks> => {
  const playlistId = typeof playlist === 'string' ? playlist : playlist.id;
  const items = await spotifyPlaylists.getPlaylistItems(token, playlistId, options);

  const tracks = items.items
    .map(playlistTrack => playlistTrack.track)
    .filter(track => track !== null && track !== undefined); // Filter out nulls
  
  return { tracks };
}

export const getPlaylistArtists = (tracks: MultipleTracks): PlaylistArtists => {
  const artists = tracks.tracks
    .filter(track => track !== null) // Add null check
    .map(spotifyTrack => spotifyTrack!.artists);
  
  return { artists };
}


export const rankPlaylistTracks = async (playlist : SpotifyPlaylist, token: string, options?: {limit?: number, offset?: number}): Promise<MultipleTracks> => {
  const tracks = await getPlaylistTracks(playlist, token, options);
  const rankedTracks = rankSongPopularity(tracks);
  return rankedTracks;

}
