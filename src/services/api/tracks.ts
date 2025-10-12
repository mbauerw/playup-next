import type { SavedTracks, SpotifyTrack, MultipleTracks } from '@/types';

export const tracksAPI = {
  async getTrack(trackId: string, market?: string): Promise<SpotifyTrack> {
    const params = market ? `?market=${market}` : '';
    const res = await fetch(`/api/spotify/tracks/${trackId}${params}`);
    if (!res.ok) throw new Error('Failed to fetch track');
    return res.json();
  },

  async getSavedTracks(options?: {
    limit?: number;
    offset?: number;
    market?: string;
  }): Promise<SavedTracks> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.market) params.append('market', options.market);
    
    const query = params.toString() ? `?${params}` : '';
    const res = await fetch(`/api/spotify/tracks/saved${query}`);
    if (!res.ok) throw new Error('Failed to fetch saved tracks');
    return res.json();
  },

  async getSeveralTracks(
    trackIds: string[],
    market?: string
  ): Promise<MultipleTracks> {
    const params = new URLSearchParams();
    params.append('ids', trackIds.join(','));
    if (market) params.append('market', market);
    
    const res = await fetch(`/api/spotify/tracks/several?${params}`);
    if (!res.ok) throw new Error('Failed to fetch tracks');
    return res.json();
  },

  async checkSavedStatus(
    trackIds: string[],
    market?: string
  ): Promise<boolean[]> {
    const params = new URLSearchParams();
    params.append('ids', trackIds.join(','));
    if (market) params.append('market', market);
    
    const res = await fetch(`/api/spotify/tracks/check-saved?${params}`);
    if (!res.ok) throw new Error('Failed to check saved status');
    return res.json();
  },
};