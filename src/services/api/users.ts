// services/api/users.ts
import type { CurrentUser, UserTopItems, FollowedArtists } from '@/types';

export const usersAPI = {
  async getCurrentUser(): Promise<CurrentUser> {
    const res = await fetch('/api/spotify/users/me');
    if (!res.ok) throw new Error('Failed to fetch current user');
    return res.json();
  },

  async getTopItems(
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
    const res = await fetch(`/api/spotify/users/top/${type}${query}`);
    if (!res.ok) throw new Error('Failed to fetch top items');
    return res.json();
  },

  async getFollowedArtists(options?: {
    type?: string;
    after?: string;
    limit?: number;
  }): Promise<FollowedArtists> {
    const params = new URLSearchParams();
    params.append('type', options?.type || 'artist');
    if (options?.after) params.append('after', options.after);
    if (options?.limit) params.append('limit', options.limit.toString());
    
    const res = await fetch(`/api/spotify/users/following?${params}`);
    if (!res.ok) throw new Error('Failed to fetch followed artists');
    return res.json();
  },
};