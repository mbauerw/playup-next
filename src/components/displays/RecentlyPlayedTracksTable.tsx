import React from 'react';
import { RecentlyPlayedTracks } from '@/types';

interface RecentlyPlayedTracksTableProps {
  recentTracks: RecentlyPlayedTracks;
}

const RecentlyPlayedTracksTable: React.FC<RecentlyPlayedTracksTableProps> = ({ recentTracks }) => {
  const formatDuration = (durationMs: number): string => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-xl font-bold text-gray-900">
          Recently Played Tracks ({recentTracks.total} total)
        </h3>
        <p className="text-sm text-gray-500">
          Showing {recentTracks.items.length} tracks
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
                Played At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Context
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentTracks.items.map((playHistory, index) => (
              <tr key={`${playHistory.track.id}-${playHistory.played_at}-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {playHistory.track.album.images?.[2] && (
                      <img
                        src={playHistory.track.album.images[2].url}
                        alt={playHistory.track.album.name}
                        className="w-10 h-10 rounded mr-3"
                      />
                    )}
                    <div className="font-medium text-gray-900">
                      {playHistory.track.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {playHistory.track.artists.map(artist => artist.name).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {playHistory.track.album.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDuration(playHistory.track.duration_ms)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(playHistory.played_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {playHistory.context ? playHistory.context.type : 'No context'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentlyPlayedTracksTable;