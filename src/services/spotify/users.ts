
import { makeAuthenticatedRequest } from './index';
import type { 
  CurrentUser, 
  UserTopItems, 
  FollowedArtists } from '@/types';

export const spotifyUsers = {
  // Get Current User's Profile
  async getCurrentUser(accessToken: string): Promise<CurrentUser> {
    return makeAuthenticatedRequest<CurrentUser>('/me', accessToken);
  },

  // Get User's Top Items
  async getTopItems(
    accessToken: string,
    type: 'artists' | 'tracks',
    options?: { 
      time_range?: 'short_term' | 'medium_term' | 'long_term';
      limit?: number;
      offset?: number;
    }
  ): Promise<UserTopItems> {
    const params = new URLSearchParams();
    if (options?.time_range) params.append('time_range', options.time_range);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    
    const query = params.toString() ? `?${params}` : '';
    return makeAuthenticatedRequest<UserTopItems>(
      `/me/top/${type}${query}`, 
      accessToken
    );
  },

  // Get Followed Artists
  async getFollowedArtists(
    accessToken: string,
    options?: { type?: string; after?: string; limit?: number }
  ): Promise<FollowedArtists> {
    const params = new URLSearchParams();
    params.append('type', options?.type || 'artist');
    if (options?.after) params.append('after', options.after);
    if (options?.limit) params.append('limit', options.limit.toString());
    
    return makeAuthenticatedRequest<FollowedArtists>(
      `/me/following?${params}`, 
      accessToken
    );
  }
};
