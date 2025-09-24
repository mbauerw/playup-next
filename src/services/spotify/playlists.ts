import { makeAuthenticatedRequest } from './index';
import type { 
  SpotifyPlaylist, 
  PlaylistItems, 
  CurrentUserPlaylists,
  CreatePlaylistData,
  RemovePlaylistItemsData
} from '@/types';

export const spotifyPlaylists = {
  // Get SpotifyPlaylist
  async getPlaylist(accessToken: string, playlistId: string): Promise<SpotifyPlaylist> {
    return makeAuthenticatedRequest<SpotifyPlaylist>(`/playlists/${playlistId}`, accessToken);
  },

  // Get Playlist Items
  async getPlaylistItems(
    accessToken: string, 
    playlistId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<PlaylistItems> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    
    const query = params.toString() ? `?${params}` : '';
    return makeAuthenticatedRequest<PlaylistItems>(
      `/playlists/${playlistId}/tracks${query}`, 
      accessToken
    );
  },

  // Add Items to Playlist
  async addItemsToPlaylist(
    accessToken: string, 
    playlistId: string, 
    trackUris: string[]
  ): Promise<{ snapshot_id: string }> {
    return makeAuthenticatedRequest(`/playlists/${playlistId}/tracks`, accessToken, {
      method: 'POST',
      body: JSON.stringify({ uris: trackUris })
    });
  },

  // Remove Items from Playlist
  async removeItemsFromPlaylist(
    accessToken: string, 
    playlistId: string, 
    data: RemovePlaylistItemsData
  ): Promise<{ snapshot_id: string }> {
    return makeAuthenticatedRequest(`/playlists/${playlistId}/tracks`, accessToken, {
      method: 'DELETE',
      body: JSON.stringify(data)
    });
  },

  // Get Current User's Playlists
  async getCurrentUserPlaylists(
    accessToken: string,
    options?: { limit?: number; offset?: number }
  ): Promise<CurrentUserPlaylists> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    
    const query = params.toString() ? `?${params}` : '';
    return makeAuthenticatedRequest<CurrentUserPlaylists>(
      `/me/playlists${query}`, 
      accessToken
    );
  },

  // Create Playlist
  async createPlaylist(
    accessToken: string, 
    userId: string, 
    data: CreatePlaylistData
  ): Promise<SpotifyPlaylist> {
    return makeAuthenticatedRequest<SpotifyPlaylist>(`/users/${userId}/playlists`, accessToken, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Get User's Playlists
  async getUserPlaylists(
    accessToken: string, 
    userId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<CurrentUserPlaylists> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    
    const query = params.toString() ? `?${params}` : '';
    return makeAuthenticatedRequest<CurrentUserPlaylists>(
      `/users/${userId}/playlists${query}`, 
      accessToken
    );
  }

};