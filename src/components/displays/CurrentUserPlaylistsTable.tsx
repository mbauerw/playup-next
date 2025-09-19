import React from 'react';
import { CurrentUserPlaylists } from '@/types';

interface CurrentUserPlaylistsTableProps {
  currentUserPlaylists: CurrentUserPlaylists;
}

const CurrentUserPlaylistsTable: React.FC<CurrentUserPlaylistsTableProps> = ({ currentUserPlaylists }) => {
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
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Playlist
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
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
                  {playlist.tracks.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    playlist.public 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {playlist.public ? 'Public' : 'Private'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    playlist.collaborative 
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
  );
};

export default CurrentUserPlaylistsTable;