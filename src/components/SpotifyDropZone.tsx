import React, {useState, useEffect} from 'react';
import { useSpotifyPlaylists, useSpotifyTracks } from '@/hooks';
import { getPlaylistTracks } from '@/lib/parsers/parseSpotifyPlaylist';
import CurrentUserPlaylistsTable from './displays/CurrentUserPlaylistsTable';
import PlaylistTable from './displays/PlaylistTable';

interface SpotifyDropZoneProps {
  handleChangeTrack: (trackId: string) => void;
}

const SpotifyDropZone: React.FC<SpotifyDropZoneProps> = ({handleChangeTrack}) => {
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

    // playlists hooks
  const {
    playlist,
    playlistItems,
    currentUserPlaylists,
    loading: playlistsLoading,
    error: playlistsError,
    fetchPlaylist,
    fetchPlaylistItems,
    fetchCurrentUserPlaylists,
    clearData: clearPlaylistsData,
  } = useSpotifyPlaylists();

  const [displayPlaylist, setDisplayPlaylist] = useState(false);


  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Get the URL data from the drag event
    const url = e.dataTransfer.getData('text/uri-list') || 
                e.dataTransfer.getData('text/plain');
    
    if (url && url.includes('spotify.com')) {
      // Extract the ID from the URL
      // Example: https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp
      const spotifyId = url.split('/').pop()?.split('?')[0];
      if (!spotifyId) {
        console.log("couldn't get id");
        return;
      }
      await fetchPlaylist(spotifyId);
      console.log('Spotify ID:', spotifyId);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Required to allow drop
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className='h-[600px] w-[70%] bg-black rounded-2xl flex justify-center items-center'
    >
      <div className='w-[50%] h-[20%] bg-black border-2 border-dotted border-white z-50 flex justify-center items-center'>
        {playlist ? ( 
          <div>
            <PlaylistTable playlist={playlist} handleChangeTrack={handleChangeTrack} />


          </div>

        ) : (<div><h1 className='text-white text-4xl'>Drop Playlist Here</h1></div>) }
        

      </div>
    </div>
  );
}

export default SpotifyDropZone;