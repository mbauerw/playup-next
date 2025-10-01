import { PlaylistTopArtists } from "@/types";

interface PlaylistTopArtistsTableProps {
  topArtists: PlaylistTopArtists;
}

const PlaylistTopArtistsTable = ({ topArtists }: PlaylistTopArtistsTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {topArtists && topArtists.artists.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
          <div className="px-6 py-4 border-b">
            <h3 className="text-xl font-bold text-gray-900">
              Top Artists ({topArtists.artists.length} total)
            </h3>
            <p className="text-sm text-gray-500">
              Most featured artists in this playlist
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artist Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Track Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topArtists.artists.map((artist, index) => {
                  const count = topArtists.counts.get(artist.id) || 0;
                  return (
                    <tr key={artist.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {artist.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                          {count} {count === 1 ? 'track' : 'tracks'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistTopArtistsTable;