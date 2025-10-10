import { useState, useEffect, useCallback } from 'react';
import { spotifyArtists } from '@/services/spotify/artists';
import { type SpotifyArtist, type ArtistAlbums, type MultipleTracks, type SpotifyPlaylist, MultipleAlbums, AlbumTracks } from '@/types';
import { useSpotifyContext } from '@/contexts/SpotifyContext';
import { useSpotifyTracks } from './useSpotifyTracks';
import { useSpotifyAlbums } from './useSpotifyAlbums';
import { getPlaylistTracks, getPlaylistArtists, getPlaylistTopArtists, rankPlaylistTracks } from '@/lib/parsers/parseSpotifyPlaylist';
import { getMultipleTrackAlbums, rankSongPopularity } from '@/lib/parsers/parseSpotifyTracks';
import { getAlbumTrackIds } from '@/lib/parsers/parseAlbumTracks';


export const useGetRecommendations = (params:
  | { playlist: SpotifyPlaylist; inputTracks?: never }
  | { playlist?: never; inputTracks: MultipleTracks }
) => {
  const { getAccessToken } = useSpotifyContext();

  // tracks hooks
  const {
    savedTracks,
    singleTrack,
    multipleTracks,
    savedTrackStatus,
    loading: trackLoading,
    error: tracksError,
    fetchTrack,
    fetchSavedTracks,
    fetchSeveralTracks,
    checkSavedStatus,
    clearData: clearTracksData
  } = useSpotifyTracks();

  // album hooks
  const {
    album,
    albumTracks,
    loading: albumsLoading,
    error: albumsError,
    fetchAlbum,
    fetchAlbumTracks,
    clearData: clearAlbumsData,
  } = useSpotifyAlbums();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [sourceTracks, setSourceTracks] = useState<MultipleTracks>();
  const [sourceAlbumTracks, setSourceAlbumTracks] = useState<MultipleTracks>();
  const [recommendedTracks, setRecommendedTracks] = useState<MultipleTracks>();
  const [sourceAlbums, setSourceAlbums] = useState<MultipleAlbums>();

  useEffect(() => {
    const setTracks = async () => {

      if (!params.playlist && !params.inputTracks) {
        console.log("No props for recommendations");
        return;
      }

      if (params.playlist) {
        try {
          setLoading(true);
          const token = await getAccessToken();
          const playTracks = await getPlaylistTracks(params.playlist, token);
          setSourceTracks(playTracks);
          console.log("sourced playlist");
          setError(null);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      }
      else if (params.inputTracks) {
        setSourceTracks(params.inputTracks);
        console.log("sourced tracks");
      }

    }

    setTracks();
  }, [params.playlist, params.inputTracks, getAccessToken]);


  /* 
  for each album in sourceAlbums:
    get album.id
    fetchAlbumTracks for AlbumTracks array
    getAlbumTrackIds(AlbumTracks)
    use TrackIds to fetchSeveralTracks
    append tracks to array of MultipleTracks
  */

  const fetchSourceTracks = useCallback(async (): Promise<MultipleTracks | undefined> => {
    if (!sourceTracks) return;

    const albums = getMultipleTrackAlbums(sourceTracks);
    const combinedTracks: MultipleTracks = { tracks: [] };

    setLoading(true);

    for (const album of albums.albums) {
      if (!album) continue;

      try {
        const albumTracks = await fetchAlbumTracks(album.id);
        if (!albumTracks) continue;

        const albumTrackIds = getAlbumTrackIds(albumTracks);

        const fetchedTracks = await fetchSeveralTracks(albumTrackIds);
        if (!fetchedTracks) continue;
        const sortedTracks = rankSongPopularity(fetchedTracks);

        console.log("THE SORTED TRACKS ARE AS FOLLOWS: " + JSON.stringify(sortedTracks.tracks));
        combinedTracks.tracks.push(...sortedTracks.tracks);

      } catch (err) {
        console.error(err as Error);
      }
    }
    setLoading(false);
    setSourceAlbumTracks(combinedTracks);
    return combinedTracks;
  }, [sourceTracks, fetchAlbumTracks, fetchSeveralTracks]);

  return {
    sourceAlbumTracks,
    fetchSourceTracks,
    error,
    loading
  }
}


/*

1. Take playlist or MultipleTracks
2. Get album from each track
3. Sort album tracks by popularity
4. return a potential list of songs to source from, not just one recommendation. 
This will allow users to cycle through choices. 

Alternative:
1. Take playlist or Multiple tracks
2. Rank artists by instances on album
3. If artist shows up 3 times or less, source from top tracks. Exclude repeats. 
4. Maybe even compare tracks to saved tracks? */