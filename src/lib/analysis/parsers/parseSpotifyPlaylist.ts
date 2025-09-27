import { SpotifyPlaylist, SpotifyArtist, SpotifyAlbum, SpotifyTrack, MultipleTracks, PlaylistItems, PlaylistTrack, PlaylistArtists } from "@/types";
import { spotifyPlaylists } from "@/services/spotify";


// Get id from play. fetchPlaylistItems
export const getPlaylistTracks= async (
  playlist : SpotifyPlaylist | string, token: string, options?: {limit?: number, offset?: number}
): Promise<MultipleTracks> => {
  const playlistId = typeof playlist === 'string' ? playlist : playlist.id;
  const items = await spotifyPlaylists.getPlaylistItems(token, playlistId, options);

  const tracks = items.items.map(playlistTrack => playlistTrack.track);
  
  return { tracks }

}

export const getPlaylistArtists = (tracks: MultipleTracks): PlaylistArtists => {

  const artists =  tracks.tracks.map(spotifyTrack => spotifyTrack.artists)
  return { artists };

}

const parseSpotifyPlaylist = (playlist : SpotifyPlaylist) => {


}


