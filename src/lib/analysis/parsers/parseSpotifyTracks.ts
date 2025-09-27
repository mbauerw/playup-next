import { MultipleTracks, MultipleTrackArtists } from "@/types";

export const getPlaylistArtists = (tracks: MultipleTracks): MultipleTrackArtists => {

  const artists =  tracks.tracks.map(spotifyTrack => spotifyTrack.artists)
  return { artists };

}