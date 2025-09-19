import { makeAuthenticatedRequest } from './index';
import type { 
  SpotifyAlbum, 
  MultipleAlbums,
  AlbumTracks,
  SavedAlbums 
} from '@/types';

export const spotifyAlbums = {
  // Get Album
  async getAlbum(
    accessToken: string, 
    albumId: string, 
    market?: string
  ): Promise<SpotifyAlbum> {
    const params = market ? `?market=${market}` : '';
    return makeAuthenticatedRequest<SpotifyAlbum>(
      `/albums/${albumId}${params}`, 
      accessToken
    );
  },

  // Get Albums (Multiple Albums)
  async getAlbums(
    accessToken: string, 
    albumIds: string[],
    market?: string
  ): Promise<MultipleAlbums> {
    const params = new URLSearchParams();
    params.append('ids', albumIds.join(','));
    if (market) params.append('market', market);
    
    return makeAuthenticatedRequest<MultipleAlbums>(
      `/albums?${params}`, 
      accessToken
    );
  },

  // Get Album Tracks
  async getAlbumTracks(
    accessToken: string, 
    albumId: string,
    options?: { 
      market?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<AlbumTracks> {
    const params = new URLSearchParams();
    if (options?.market) params.append('market', options.market);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    
    const query = params.toString() ? `?${params}` : '';
    return makeAuthenticatedRequest<AlbumTracks>(
      `/albums/${albumId}/tracks${query}`, 
      accessToken
    );
  },

  // Get User's Saved Albums
  async getSavedAlbums(
    accessToken: string,
    options?: { 
      limit?: number;
      offset?: number;
      market?: string;
    }
  ): Promise<SavedAlbums> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.market) params.append('market', options.market);
    
    const query = params.toString() ? `?${params}` : '';
    return makeAuthenticatedRequest<SavedAlbums>(
      `/me/albums${query}`, 
      accessToken
    );
  }
};