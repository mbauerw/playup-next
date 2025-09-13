import { makeAuthenticatedRequest } from './index';
import type { SavedTracks, Track, MultipleTracks } from '@/types';

export const spotifyTracks = {
  // Get User's Saved Tracks
  async getSavedTracks(
    accessToken: string,
    options?: { limit?: number; offset?: number; market?: string }
  ): Promise<SavedTracks> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.market) params.append('market', options.market);
    
    const query = params.toString() ? `?${params}` : '';
    return makeAuthenticatedRequest<SavedTracks>(
      `/me/tracks${query}`, 
      accessToken
    );
  },

  // Get Several Tracks
  async getSeveralTracks(
    accessToken: string, 
    trackIds: string[],
    market?: string
  ): Promise<MultipleTracks> {
    const params = new URLSearchParams();
    params.append('ids', trackIds.join(','));
    if (market) params.append('market', market);
    
    return makeAuthenticatedRequest<MultipleTracks>(
      `/tracks?${params}`, 
      accessToken
    );
  },

  // Get Track
  async getTrack(
    accessToken: string, 
    trackId: string, 
    market?: string
  ): Promise<Track> {
    const params = market ? `?market=${market}` : '';
    return makeAuthenticatedRequest<Track>(
      `/tracks/${trackId}${params}`, 
      accessToken
    );
  }
};