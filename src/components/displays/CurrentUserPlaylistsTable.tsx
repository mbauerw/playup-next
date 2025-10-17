import React, { useState, useEffect } from 'react';
import { CurrentUserPlaylists, SpotifyPlaylist, MultipleTracks, PlaylistArtists, PlaylistTopArtists } from '@/types';
import MultipleTracksTable from './MultipleTracksTable';
import PlaylistTopArtistsTable from './PlaylistTopArtistsTable';
import { useGetRecommendations } from '@/hooks/useGetRecommendations';
import { getPlaylistArtists, getPlaylistTopArtists, getPlaylistTracks, rankPlaylistTracks } from '@/lib/parsers/parseSpotifyPlaylist';


interface CurrentUserPlaylistsTableProps {
  currentUserPlaylists: CurrentUserPlaylists;
  handleChangeTrack: (trackId: string) => void;
  handleFetchArtistTopTracks?: (artistId: string, market?: string) => Promise<MultipleTracks | null>;
}

const CurrentUserPlaylistsTable: React.FC<CurrentUserPlaylistsTableProps> = ({ currentUserPlaylists, handleChangeTrack }) => {

  const [playlistTracks, setPlaylistTracks] = useState<MultipleTracks>();
  const [playlistArtists, setPlaylistArtists] = useState<PlaylistArtists>();
  const [playlistTopArtists, setPlaylistTopArtists] = useState<PlaylistTopArtists>();
  const [artistTopTracks, setArtistTopTracks] = useState<MultipleTracks>();

  const [userSelectedPlaylist, setUserSelectedPlaylist] = useState<SpotifyPlaylist>();

  const {
    sourceAlbumTracks,
    fetchSourceTracks,
    getRecommendations,
    error,
    loading
  } = useGetRecommendations();
 
  const handleGetPlaylistTracks = async (playlist: SpotifyPlaylist) => {
    if (getPlaylistTracks) {
      try {
        const options = {market: 'US'}
        const tracks = await getPlaylistTracks(playlist, options );
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

  }

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
  }

  const handleGetRecommendations = async (playlist: SpotifyPlaylist) => {
    await getRecommendations(playlist);
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-xl font-bold text-gray-900">
          Your Playlists ({currentUserPlaylists.total} total)
        </h3>
        <p className="text-sm text-gray-500">
          Showing {currentUserPlaylists.items.length} playlists (offset: {currentUserPlaylists.offset})
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Playlist
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Get Recommendations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tracks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Public
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collaborative
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
        </table>
        <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUserPlaylists.items.map((playlist, index) => (
                <tr key={playlist.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {playlist.images?.[0] && (
                        <img
                          src={playlist.images[0].url}
                          alt={playlist.name}
                          className="w-10 h-10 rounded mr-3"
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{playlist.name}</div>
                        <div className="text-sm text-gray-500">{playlist.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {playlist.owner.display_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className='bg-violet-600 shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 
                      border border-solid border-gray-600 rounded-md px-2 text-gray-900 font-medium transition-all duration-600' onClick={() => handleGetRecommendations(playlist)}> Get Recommendations</button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {playlist.tracks.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <button className='bg-blue-600 hover:bg-blue-800 border-1 border-black px-2 py-1 rounded text-white' onClick={() => handleGetPlaylistTracks(playlist)}> Get Playlist Tracks</button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${playlist.public
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {playlist.public ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${playlist.collaborative
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {playlist.collaborative ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {playlist.description || 'No description'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        {playlistTracks &&
          <MultipleTracksTable tracks={playlistTracks} handleChangeTrack={handleChangeTrack}/>
        }
        {playlistTopArtists &&
          <PlaylistTopArtistsTable topArtists={playlistTopArtists} />
        }
        <div>
        {error && <div className="text-red-600">Error: {error.message}</div>}
        {loading && <div>Loading recommendations...</div>}
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

export default CurrentUserPlaylistsTable;