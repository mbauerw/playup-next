import React from 'react';
import { MultipleTracks } from '@/types';

interface SortedAlbumTracksTableProps {
  sortedAlbumTracks: MultipleTracks
  handleChangeTrack: (trackId: string) => void; // Function that takes a string and returns nothing
}

const SortedAlbumTracksTable: React.FC<SortedAlbumTracksTableProps> = ({ sortedAlbumTracks, handleChangeTrack }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mt-6 border border-gray-700">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-xl font-bold text-gray-100">
          Tracks Sorted by Popularity ({sortedAlbumTracks.tracks.filter(t => t !== null).length} tracks)
        </h3>
        <p className="text-sm text-gray-400">
          Ranked from most to least popular
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Track</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Play</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Popularity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Explicit</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {sortedAlbumTracks.tracks
              .filter(track => track !== null)
              .map((track, index) => (
                <tr key={track!.id || index} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-100">#{index + 1}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-100">{track!.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className='bg-green-500 shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 border border-solid border-gray-600 rounded-md px-2 text-gray-900 font-medium'
                      onClick={() => handleChangeTrack(track!.id)}
                    >
                      Play
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {track!.artists.map(artist => artist.name).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {Math.floor(track!.duration_ms / 60000)}:{((track!.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className="font-medium">{track!.popularity}/100</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${track!.explicit
                      ? 'bg-red-900 text-red-200'
                      : 'bg-green-900 text-green-200'
                      }`}>
                      {track!.explicit ? 'Explicit' : 'Clean'}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>

  )
}

export default SortedAlbumTracksTable;