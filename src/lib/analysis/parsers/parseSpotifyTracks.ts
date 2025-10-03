import { MultipleTracks, MultipleTrackArtists } from "@/types";

export const getMultpleTrackArtists = (tracks: MultipleTracks): MultipleTrackArtists => {

  const artists =  tracks.tracks.map(spotifyTrack => spotifyTrack.artists)
  return { artists };

}

export const rankSongPopularity = (multipleTracks: MultipleTracks): MultipleTracks => {
  return {
    ...multipleTracks,
    tracks: [...multipleTracks.tracks].sort((a, b) => {
      const aPopularity = a?.popularity ?? 0;
      const bPopularity = b?.popularity ?? 0;
      return bPopularity - aPopularity;
    })
  };
}