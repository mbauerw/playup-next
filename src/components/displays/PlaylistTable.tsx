import React, { useState } from 'react';
import { SpotifyPlaylist, MultipleTracks, PlaylistArtists, PlaylistTopArtists } from '@/types';
import MultipleTracksTable from './MultipleTracksTable';
import PlaylistTopArtistsTable from './PlaylistTopArtistsTable';
import { useGetRecommendations } from '@/hooks/useGetRecommendations';
import { getPlaylistArtists, getPlaylistTopArtists, getPlaylistTracks, rankPlaylistTracks } from '@/lib/parsers/parseSpotifyPlaylist';


interface PlaylistTableProps {
  playlist: SpotifyPlaylist;
  handleChangeTrack: (trackId: string) => void;
  handleFetchArtistTopTracks?: (artistId: string, market?: string) => Promise<MultipleTracks | null>;
}

const PlaylistTable: React.FC<PlaylistTableProps> = ({ 
  playlist, 
  handleChangeTrack,
}) => {

  const [playlistTracks, setPlaylistTracks] = useState<MultipleTracks>();
  const [playlistArtists, setPlaylistArtists] = useState<PlaylistArtists>();
  const [playlistTopArtists, setPlaylistTopArtists] = useState<PlaylistTopArtists>();

  const {
    sourceAlbumTracks,
    fetchSourceTracks,
    getRecommendations,
    error,
    loading
  } = useGetRecommendations();
 
  const handleGetPlaylistTracks = async () => {
    if (getPlaylistTracks) {
      try {
        const options = { market: 'US' };
        const tracks = await getPlaylistTracks(playlist, options);
        setPlaylistTracks(tracks);
        console.log(tracks);
        handleGetPlaylistArtists(tracks);
      } catch (error) {
        console.error('Error fetching playlist tracks:', error);
      }
    }
  };

  const handleGetPlaylistArtists = (playlistTracks: MultipleTracks) => {
    if (getPlaylistArtists) {
      try {
        const artists = getPlaylistArtists(playlistTracks);
        setPlaylistArtists(artists);
        console.log("Artists: ", artists);
        handleGetPlaylistTopArtists(artists);
      } catch (error) {
        console.error('Error getting playlist artists: ', error);
      }
    }
  };

  const handleGetPlaylistTopArtists = (playlistArtists: PlaylistArtists, limit: number = 5) => {
    if (getPlaylistTopArtists) {
      try {
        const artists = getPlaylistTopArtists(playlistArtists, limit);
        setPlaylistTopArtists(artists);
        console.log("Top Artists: ", artists);
      } catch (error) {
        console.error('Error getting playlist top artists: ', error);
      }
    }
  };

  const handleGetRecommendations = async () => {
    await getRecommendations(playlist);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <div className="flex items-center">
          {playlist.images?.[0] && (
            <img
              src={playlist.images[0].url}
              alt={playlist.name}
              className="w-16 h-16 rounded mr-4"
            />
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {playlist.name}
            </h3>
            <p className="text-sm text-gray-500">
              {playlist.tracks.total} tracks • {playlist.public ? 'Public' : 'Private'} • Owner: {playlist.owner.display_name}
            </p>
            {playlist.description && (
              <p className="text-sm text-gray-600 mt-1">
                {playlist.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex gap-3">
          <button 
            className="bg-violet-600 shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 border border-solid border-gray-600 rounded-md px-4 py-2 text-white font-medium transition-all duration-200" 
            onClick={handleGetRecommendations}
          >
            Get Recommendations
          </button>
          <button 
            className="bg-blue-600 hover:bg-blue-800 border border-gray-600 px-4 py-2 rounded text-white font-medium transition-all duration-200" 
            onClick={handleGetPlaylistTracks}
          >
            Get Playlist Tracks
          </button>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Playlist ID:</span>
            <span className="ml-2 text-gray-600">{playlist.id}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Collaborative:</span>
            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              playlist.collaborative
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {playlist.collaborative ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      <div>
        {playlistTracks && (
          <MultipleTracksTable tracks={playlistTracks} handleChangeTrack={handleChangeTrack} />
        )}
        {playlistTopArtists && (
          <PlaylistTopArtistsTable topArtists={playlistTopArtists} />
        )}
        <div>
          {error && <div className="text-red-600 px-6 py-4">Error: {error.message}</div>}
          {loading && <div className="px-6 py-4">Loading recommendations...</div>}
          {sourceAlbumTracks && (
            <MultipleTracksTable 
              tracks={sourceAlbumTracks} 
              handleChangeTrack={handleChangeTrack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistTable;