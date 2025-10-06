import React, { useEffect } from 'react';
import { AlbumTracks, MultipleTracks, SpotifyAlbum } from '@/types';
import { getAlbumTrackIds } from '@/lib/analysis/parsers/parseAlbumTracks';
import { useSpotifyTracks } from '@/hooks';
import { useSpotifyAuth } from '@/hooks';
import { useSpotifyAlbums } from '@/hooks';


interface AlbumTracksTableProps {
  album: SpotifyAlbum
  handleChangeTrack: (trackId: string) => void; // Function that takes a string and returns nothing
}

const AlbumTracksTable: React.FC<AlbumTracksTableProps> = ({ album, handleChangeTrack }) => {

  const {
    singleTrack,
    multipleTracks,
    loading: trackLoading,
    error: tracksError,
    fetchTrack,
    fetchSeveralTracks,
    clearData: clearTracksData
  } = useSpotifyTracks();

  const {
    albumTracks,
    loading: albumsLoading,
    error: albumsError,
    fetchAlbumTracks,
    clearData: clearAlbumsData,
  } = useSpotifyAlbums();

  const { getAccessToken } = useSpotifyAuth();

  const title = album.name;

  useEffect(() => {
    const getAlbumTracks = async () => {
      const token = await getAccessToken();
      await fetchAlbumTracks(album.id);
    }
    getAlbumTracks();
  }, [album.id])

  useEffect(() => {
    if (!albumTracks) return;

    const getSeveralTracks = async () => {
      const token = await getAccessToken();
      const trackIds = getAlbumTrackIds(albumTracks);
      if (trackIds.length > 0) {
        await fetchSeveralTracks(trackIds);
      }
    };
    getSeveralTracks();
  }, [albumTracks]);



  return (

    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
      <div className="px-6 py-4 border-b border-gray-700 flex flex-row items-center">
        {album.images?.[0] && (
          <img
            src={album.images[0].url}
            alt={album.name}
            className="w-20 h-20 rounded mr-3"
          />
        )}
        <div className='w-full h-full flex flex-col items-center justify-center'>
          <h3 className="text-xl font-bold text-gray-100">
            {title}
          </h3>
          {albumTracks && (<p className="text-sm text-gray-400">
            Showing {albumTracks.items.length} tracks (offset: {albumTracks.offset})
            {multipleTracks && <span> - Enhanced with popularity data</span>}
          </p>)
          }
        </div>


      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Track</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Play</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Track #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Disc #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Popularity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Explicit</th>
            </tr>
          </thead>
          {albumTracks && (<tbody className="bg-gray-800 divide-y divide-gray-700">
            {albumTracks.items.map((track, index) => {
              const fullTrack = multipleTracks?.tracks.find(t => t?.id === track.id);
              return (
                <tr key={track.id || index} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-100">{track.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <button className='bg-green-500 shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75
                              border border-solid border-gray-600 rounded-md px-2 text-gray-900 font-medium' onClick={() => handleChangeTrack(track.id)}>Play</button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {Math.floor(track.duration_ms / 60000)}:{((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {track.track_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {track.disc_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {fullTrack?.popularity !== undefined ? (
                      <span className="font-medium">{fullTrack.popularity}/100</span>
                    ) : (
                      <span className="text-gray-500">Loading...</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${track.explicit
                      ? 'bg-red-900 text-red-200'
                      : 'bg-green-900 text-green-200'
                      }`}>
                      {track.explicit ? 'Explicit' : 'Clean'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>)

          }

        </table>
      </div>
    </div>

  )
}

export default AlbumTracksTable;