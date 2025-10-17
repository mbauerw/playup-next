import { SpotifyPlaylist, SpotifyArtist, SpotifyAlbum, SpotifyTrack, MultipleTracks, MultipleTrackArtists, MultipleTopArtists, PlaylistItems, PlaylistTrack, PlaylistArtists, PlaylistTopArtists, MultipleAlbums } from "@/types";
import { artistsAPI } from "@/services/api/artists";

export const getMultipleArtistsTopTracks = async (artists: MultipleTopArtists): Promise<MultipleTracks> => {
  const allTrackArrays = await Promise.all(
    artists.artists.map(artist => artistsAPI.getArtistTopTracks(artist.id))
  );
  
  return {
    tracks: allTrackArrays.flatMap(result => result.tracks)
  };
}

export const getMultipleArtistsRandomTopTrack = async (artists: MultipleTopArtists): Promise<MultipleTracks> => {
  const allTrackArrays = await Promise.all(
    artists.artists.map(artist => artistsAPI.getArtistTopTracks(artist.id))
  );
  
  return {
    tracks: allTrackArrays.map(result => {
      const randomIndex = Math.floor(Math.random() * result.tracks.length);
      return result.tracks[randomIndex];
    })
  };
}