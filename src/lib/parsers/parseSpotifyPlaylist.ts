import { SpotifyPlaylist, SpotifyArtist, SpotifyAlbum, SpotifyTrack, MultipleTracks, PlaylistItems, PlaylistTrack, PlaylistArtists, PlaylistTopArtists, MultipleAlbums } from "@/types";
import { playlistsAPI } from "@/services/api/playlists";
import { rankSongPopularity } from "./parseAlbumTracks";


export const getPlaylistTracks = async (
  playlist: SpotifyPlaylist | string,
  options?: { 
    market?: string,
    fields?: string,
    limit?: number,
    offset?: number,
    additional_types?: string }
): Promise<MultipleTracks> => {
  const playlistId = typeof playlist === 'string' ? playlist : playlist.id;
  const items = await playlistsAPI.getPlaylistItems(playlistId, options);

  // console.log("Items from getPlaylistTracks:" + JSON.stringify(items));

  const tracks = items.items
    .map(playlistTrack => playlistTrack.track)
    .filter(track => track !== null && track !== undefined); // Filter out nulls

  return { tracks };
}

export const getPlaylistArtists = (tracks: MultipleTracks): PlaylistArtists => {
  const artists = tracks.tracks
    .filter(track => track !== null)
    .map(spotifyTrack => spotifyTrack!.artists)
    .sort((a, b) => a[0].name.localeCompare(b[0].name));

  const counts = new Map<string, number>();

  artists.forEach(artistArray => {
    const primary = artistArray[0];
    counts.set(
      primary.id,
      (counts.get(primary.id) || 0) + 1
    );
  })

  return { artists, counts };
}

export const getPlaylistTopArtists = (
  playlistArtists: PlaylistArtists, 
  limit: number
): PlaylistTopArtists => {

  const sortedEntries = Array.from(playlistArtists.counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  const topCounts = new Map(sortedEntries);
  
  const topArtists = sortedEntries
    .map(([artistId]) => {
      const artistArray = playlistArtists.artists.find(
        arr => arr[0]?.id === artistId
      );
      return artistArray?.[0]; 
    })
    .filter((artist): artist is SpotifyArtist => artist !== undefined);

  return {
    artists: topArtists,
    counts: topCounts
  };
};

export const getPlaylistAlbums = async (
  playlist: SpotifyPlaylist | string,
  options?: { 
    market?: string,
    fields?: string,
    limit?: number,
    offset?: number,
    additional_types?: string }
): Promise<MultipleAlbums> => {
  
  const tracks = await getPlaylistTracks(playlist, options);
  const albums = tracks.tracks
    .filter(track => track !== null)
    .map(track => track.album)

  return {albums};
}


export const rankPlaylistTracks = async (playlist: SpotifyPlaylist, options?: { limit?: number, offset?: number }): Promise<MultipleTracks> => {
  const tracks = await getPlaylistTracks(playlist, options);
  console.log("Here are the tracks: ", JSON.stringify(tracks));
  const rankedTracks = rankSongPopularity(tracks);
  return rankedTracks;

}
