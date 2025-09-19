import React from 'react';
import { SavedTracks } from '@/types';

interface SavedTracksTableProps {
  savedTracks: SavedTracks;
}

const SavedTracksTable: React.FC<SavedTracksTableProps> = ({ savedTracks }) => {
  const formatDuration = (durationMs: number): string => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-xl font-bold text-gray-900">
          Your Saved Tracks ({savedTracks.total} total)
        </h3>
        <p className="text-sm text-gray-500">
          Showing {savedTracks.items.length} tracks (offset: {savedTracks.offset})
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Track
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artist
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Album
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {savedTracks.items.map((savedTrack, index) => (
              <tr key={savedTrack.track.id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {savedTrack.track.album.images?.[2] && (
                      <img
                        src={savedTrack.track.album.images[2].url}
                        alt={savedTrack.track.album.name}
                        className="w-10 h-10 rounded mr-3"
                      />
                    )}
                    <div className="font-medium text-gray-900">
                      {savedTrack.track.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {savedTrack.track.artists.map(artist => artist.name).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {savedTrack.track.album.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDuration(savedTrack.track.duration_ms)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(savedTrack.added_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SavedTracksTable;
