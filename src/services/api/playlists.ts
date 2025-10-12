import type { 
  SpotifyPlaylist, 
  PlaylistItems, 
  CurrentUserPlaylists,
  CreatePlaylistData,
  RemovePlaylistItemsData
} from '@/types';

export const playlistsAPI = {
  async getPlaylist(playlistId: string): Promise<SpotifyPlaylist> {
    const res = await fetch(`/api/spotify/playlists/${playlistId}`);
    if (!res.ok) throw new Error('Failed to fetch playlist');
    return res.json();
  },

  async getPlaylistItems(
    playlistId: string,
    options?: { 
      market?: string;
      fields?: string;
      limit?: number;
      offset?: number;
      additional_types?: string;
    }
  ): Promise<PlaylistItems> {
    const params = new URLSearchParams();
    if (options?.market) params.append('market', options.market);
    if (options?.fields) params.append('fields', options.fields);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.additional_types) params.append('additional_types', options.additional_types);
    
    const query = params.toString() ? `?${params}` : '';
    const res = await fetch(`/api/spotify/playlists/${playlistId}/tracks${query}`);
    if (!res.ok) throw new Error('Failed to fetch playlist items');
    return res.json();
  },

  async addItemsToPlaylist(
    playlistId: string,
    trackUris: string[]
  ): Promise<{ snapshot_id: string }> {
    const res = await fetch(`/api/spotify/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uris: trackUris }),
    });
    if (!res.ok) throw new Error('Failed to add items to playlist');
    return res.json();
  },

  async removeItemsFromPlaylist(
    playlistId: string,
    data: RemovePlaylistItemsData
  ): Promise<{ snapshot_id: string }> {
    const res = await fetch(`/api/spotify/playlists/${playlistId}/tracks`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to remove items from playlist');
    return res.json();
  },

  async getCurrentUserPlaylists(options?: {
    limit?: number;
    offset?: number;
  }): Promise<CurrentUserPlaylists> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    
    const query = params.toString() ? `?${params}` : '';
    const res = await fetch(`/api/spotify/playlists/current-user${query}`);
    if (!res.ok) throw new Error('Failed to fetch current user playlists');
    return res.json();
  },

  async createPlaylist(
    userId: string,
    data: CreatePlaylistData
  ): Promise<SpotifyPlaylist> {
    const res = await fetch(`/api/spotify/playlists/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data }),
    });
    if (!res.ok) throw new Error('Failed to create playlist');
    return res.json();
  },

  async getUserPlaylists(
    userId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<CurrentUserPlaylists> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    
    const query = params.toString() ? `?${params}` : '';
    const res = await fetch(`/api/spotify/playlists/user/${userId}${query}`);
    if (!res.ok) throw new Error('Failed to fetch user playlists');
    return res.json();
  },
};