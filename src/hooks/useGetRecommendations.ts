import { useState, useEffect, useCallback } from 'react';
import { spotifyArtists } from '@/services/spotify/artists';
import type { SpotifyArtist, ArtistAlbums, MultipleTracks, SpotifyPlaylist, MultipleAlbums, AlbumTracks, SpotifyTrack } from '@/types';
import { useSpotifyContext } from '@/contexts/SpotifyContext';
import { useSpotifyTracks } from './useSpotifyTracks';
import { useSpotifyAlbums } from './useSpotifyAlbums';
import { getPlaylistTracks, getPlaylistArtists, getPlaylistTopArtists, rankPlaylistTracks } from '@/lib/parsers/parseSpotifyPlaylist';
import { getMultipleTrackAlbums, rankSongPopularity } from '@/lib/parsers/parseSpotifyTracks';
import { getAlbumTrackIds } from '@/lib/parsers/parseAlbumTracks';



export const useGetRecommendations = () => {
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

  const loadPlaylistTracks = useCallback(async (playlist: SpotifyPlaylist) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getAccessToken();
      const playTracks = await getPlaylistTracks(playlist, token);
      setSourceTracks(playTracks);
      console.log("sourced playlist");
      return playTracks;
    } catch (err) {
      console.log(err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  const loadInputTracks = useCallback((tracks: MultipleTracks) => {
    setSourceTracks(tracks);
    console.log("sourced tracks");
  }, []);

  const fetchSourceTracks = useCallback(async (
    tracks: MultipleTracks
  ): Promise<MultipleTracks | undefined> => {
    if (!tracks) {
      console.log("No source tracks available");
      return;
    }

    const albums = getMultipleTrackAlbums(tracks); 
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
        console.log("\n Sorted Tracks #1:" + JSON.stringify("name: " + sortedTracks.tracks[0].name + " pop: " + sortedTracks.tracks[0].popularity));
        console.log("\n Sorted Tracks #2:" + JSON.stringify("name: " + sortedTracks.tracks[1].name + " pop: " + sortedTracks.tracks[1].popularity));
        console.log("\n Sorted Tracks #3:" + JSON.stringify("name: " + sortedTracks.tracks[2].name + " pop: " + sortedTracks.tracks[2].popularity));

        // Adjust weights to size of tracks
        let weights = [3, 3, 3, 3, 2, 2, 2, 2, 1, 1]

        if (sortedTracks.tracks.length > weights.length){
          weights = [...weights, ...Array(sortedTracks.tracks.length - weights.length).fill(1)];
        } else {
          weights = weights.slice(0, sortedTracks.tracks.length);
        }

        const selectedTrack = weightedRandom(sortedTracks.tracks, weights) as SpotifyTrack;

        console.log("The selected Track is : \n" + JSON.stringify(selectedTrack.name + "\n artist: " + selectedTrack.artists[0] + "\n pop:" + selectedTrack.popularity));

        combinedTracks.tracks.push(selectedTrack);

      } catch (err) {
        console.error(err as Error);
        setError(err as Error);
      }
    }
    setError(null);
    setLoading(false);
    setSourceAlbumTracks(combinedTracks);
    return combinedTracks;
  }, [fetchAlbumTracks, fetchSeveralTracks]); 

  const weightedRandom = (items: any, weights: number[])=>{
    let totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
        if (random < weights[i]) {
            return items[i];
        }
        random -= weights[i];
    }

  }
  const getRecommendations = useCallback(async (playlist: SpotifyPlaylist) => {
    const tracks = await loadPlaylistTracks(playlist);
    if (!tracks) return;

    const recommendations = await fetchSourceTracks(tracks);
    return recommendations;
  }, [loadPlaylistTracks, fetchSourceTracks]);

  return {
    sourceTracks,
    sourceAlbumTracks,
    loading,
    error,
    loadPlaylistTracks,
    loadInputTracks,
    fetchSourceTracks,
    getRecommendations,
  };
};


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