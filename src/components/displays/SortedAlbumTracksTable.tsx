import React, { useState } from 'react';
import { MultipleTracks } from '@/types';

interface SortedAlbumTracksTableProps {
  sortedAlbumTracks: MultipleTracks
  handleChangeTrack: (trackId: string) => void;
}

const SortedAlbumTracksTable: React.FC<SortedAlbumTracksTableProps> = ({ sortedAlbumTracks, handleChangeTrack }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const tracksPerPage = 10;
  
  const validTracks = sortedAlbumTracks.tracks.filter(t => t !== null);
  const totalPages = Math.ceil(validTracks.length / tracksPerPage);
  
  const startIndex = currentPage * tracksPerPage;
  const endIndex = startIndex + tracksPerPage;
  const currentTracks = validTracks.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mt-6 border border-gray-700">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-xl font-bold text-gray-100">
          Tracks Sorted by Popularity ({validTracks.length} tracks)
        </h3>
        <p className="text-sm text-gray-400">
          Ranked from most to least popular - Showing {startIndex + 1}-{Math.min(endIndex, validTracks.length)} of {validTracks.length}
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
            {currentTracks.map((track, index) => {
              const actualRank = startIndex + index + 1;
              return (
                <tr key={track!.id || index} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-gray-100">#{actualRank}</div>
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
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-300">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SortedAlbumTracksTable;