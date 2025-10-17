import { useState, useEffect, useCallback } from 'react';
import { spotifyArtists } from '@/services/spotify-api/artists';
import type { SpotifyArtist, ArtistAlbums, MultipleTracks, SpotifyPlaylist, MultipleAlbums, AlbumTracks, SpotifyTrack, MultipleTopArtists } from '@/types';
import { useSpotifyContext } from '@/contexts/SpotifyContext';
import { useSpotifyTracks } from './useSpotifyTracks';
import { useSpotifyAlbums } from './useSpotifyAlbums';
import { getPlaylistTracks, getPlaylistArtists, getPlaylistTopArtists, rankPlaylistTracks } from '@/lib/parsers/parseSpotifyPlaylist';
import { getMultipleTrackAlbums, rankSongPopularity } from '@/lib/parsers/parseSpotifyTracks';
import { getAlbumTrackIds } from '@/lib/parsers/parseAlbumTracks';
import { saveArtistsFromTracks } from '@/lib/db/artists';
import { getMultipleArtistsTopTracks, getMultipleArtistsRandomTopTrack } from '@/lib/parsers/parseArtists';



export const useGetRecommendations = () => {
  
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
      const playTracks = await getPlaylistTracks(playlist);
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
  }, [getPlaylistTracks]);

  const loadInputTracks = useCallback((tracks: MultipleTracks): MultipleTracks => {
    setSourceTracks(tracks);
    console.log("sourced tracks");
    return tracks;
  }, []);

  const fetchSourceTracks = useCallback(async (
    tracks: MultipleTracks
  ): Promise<MultipleTracks | undefined> => {
    if (!tracks) {
      console.log("No source tracks available");
      return;
    }


     /* The problem is that one playlist could have 1000 tracks all from different albums. Need to sort
     top artists first. If artist instances over 3, source from albums. if not, source from top tracks */
    const artists = getPlaylistArtists(tracks);

    /* Here's where you add artist values to artist preferences */ 

 
    const minSet = 2;

    let topTracks: MultipleTracks = {tracks: [] };
    let botArtists: MultipleTopArtists = {artists: [] };

    for (const track of tracks.tracks){
      const artistId = track.artists[0].id;

      if (!artists || !artists.counts) continue;

      const artistCount = artists.counts.get(artistId);

      if (artistCount == undefined) continue;

      if(artistCount > minSet){
        console.log("THERE ONCE |WAS ONE BUT NOW THERE IS THREEEE" + JSON.stringify(track));
        topTracks.tracks.push(track);

      }
      else {
        console.log("I'm sorry. You simply haven't reached the popularity threshhold. Another cycle then...")
        botArtists.artists.push(track.artists[0]);
      }
    }
    /* Now, if the tracks.track.artist.id is in topArtists, source from albums. If not, source from top tracks" */

    // Next get random top tracks from botTracks
    const albums = getMultipleTrackAlbums(topTracks);
    const botArtistTopTracks: MultipleTracks = await getMultipleArtistsRandomTopTrack(botArtists);
    
    let numberOfTracksToSelect = 2;
    const combinedTopTracks: MultipleTracks = { tracks: [] };
    

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

        // random track selection
        let weights = [3, 3, 3, 3, 2, 2, 2, 2, 1, 1];

        if (sortedTracks.tracks.length > weights.length) {
          weights = [...weights, ...Array(sortedTracks.tracks.length - weights.length).fill(1)];
        } else {
          weights = weights.slice(0, sortedTracks.tracks.length);
        }

        let availableTracks = [...sortedTracks.tracks];
        let availableWeights = [...weights];

        

        if (numberOfTracksToSelect > availableTracks.length){
          numberOfTracksToSelect = availableTracks.length;
        }

        
        for (let i = 0; i < numberOfTracksToSelect && availableTracks.length > 0; i++) {
          const selectedTrack = weightedRandom(availableTracks, availableWeights) as SpotifyTrack;

          console.log(`selected track ${i + 1}: ${selectedTrack.name}\n  artist: ${selectedTrack.artists[0].name}\n  pop: ${selectedTrack.popularity}`);

          combinedTopTracks.tracks.push(selectedTrack);

          const selectedIndex = availableTracks.indexOf(selectedTrack);
          availableTracks.splice(selectedIndex, 1);
          availableWeights.splice(selectedIndex, 1);
        }

      } catch (err) {
        console.error(err as Error);
        setError(err as Error);
      }
    }
    const combinedTracks: MultipleTracks = { tracks: shuffleArray([...combinedTopTracks.tracks, ...botArtistTopTracks.tracks])};

    setError(null);
    setLoading(false);
    setSourceAlbumTracks(combinedTracks);
    return combinedTracks;
  }, [fetchAlbumTracks, fetchSeveralTracks]);

  const weightedRandom = (items: any, weights: number[]) => {
    let totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
      if (random < weights[i]) {
        return items[i];
      }
      random -= weights[i];
    }
  }
  const shuffleArray = (array: any) => {
    const shuffled = [...array]; // Create a copy to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
    }
    return shuffled;
  }
  
  const getRecommendations = useCallback(async (playlist?: SpotifyPlaylist, inputTracks?: MultipleTracks ) => {
    
    let tracks: MultipleTracks | null = null; 

    if (playlist){
      tracks = await loadPlaylistTracks(playlist);
    }
    else if (inputTracks) {
      tracks = loadInputTracks(inputTracks);
    }
      
    if (!tracks) return;

    const recommendations = await fetchSourceTracks(tracks);

    if (!recommendations) return;

    console.log("\nThe Source artist from 'RECOMMENDATIONS' is:" + JSON.stringify(recommendations.tracks[0].artists[0]));


    // add recommendations to database without delaying execution of "return recommendations;"
    saveArtistsFromTracks(recommendations).catch(error => {
      console.error('Failed to save artists:', error);
    });
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