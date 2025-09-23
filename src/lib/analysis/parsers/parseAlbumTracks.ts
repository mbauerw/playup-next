import { AlbumTracks, MultipleTracks } from "@/types"


export const getAlbumIds = (albumTracks: AlbumTracks) => {
  return albumTracks.items
      .filter(track => track.id) // Filter out any tracks without IDs
      .map(track => track.id);

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

const parseAlbumTracks = (albumTracks : AlbumTracks) => {

  return {getAlbumIds: () => getAlbumIds(albumTracks)};

} 

export default parseAlbumTracks;