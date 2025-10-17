import { makeAuthenticatedRequest } from './index';
import type { SavedTracks, SpotifyTrack, MultipleTracks } from '@/types';

export const spotifyTracks = {
  
  // get track
  async getTrack(
    accessToken: string, 
    trackId: string, 
    market?: string
  ): Promise<SpotifyTrack> {
    const params = market ? `?market=${market}` : '';
    return makeAuthenticatedRequest<SpotifyTrack>(
      `/tracks/${trackId}${params}`, 
      accessToken
    );
  },


  // get user's saved tracks
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

  // get several tracks
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

  // check user's saved tracks
  async checkUsersSavedTracks(
    accessToken: string, 
    trackIds: string[],
    market?: string
  ): Promise<Boolean[]> {
    const params = new URLSearchParams();
    params.append('ids', trackIds.join(','));
    if (market) params.append('market', market);
    
    return makeAuthenticatedRequest<Boolean[]>(
      `/tracks/contains?${params}`, 
      accessToken
    );
  },

};