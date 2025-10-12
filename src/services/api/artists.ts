// services/api/artists.ts
import type { 
  SpotifyArtist, 
  ArtistAlbums, 
  MultipleTracks 
} from '@/types';

export const artistsAPI = {
  async getArtist(artistId: string): Promise<SpotifyArtist> {
    const res = await fetch(`/api/spotify/artists/${artistId}`);
    if (!res.ok) throw new Error('Failed to fetch artist');
    return res.json();
  },

  async getSeveralArtists(artistIds: string[]): Promise<SpotifyArtist[]> {
    const params = new URLSearchParams();
    params.append('ids', artistIds.join(','));
    
    const res = await fetch(`/api/spotify/artists/several?${params}`);
    if (!res.ok) throw new Error('Failed to fetch artists');
    return res.json();
  },

  async getArtistAlbums(
    artistId: string,
    options?: {
      include_groups?: string;
      market?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<ArtistAlbums> {
    const params = new URLSearchParams();
    if (options?.include_groups) params.append('include_groups', options.include_groups);
    if (options?.market) params.append('market', options.market);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    
    const query = params.toString() ? `?${params}` : '';
    const res = await fetch(`/api/spotify/artists/${artistId}/albums${query}`);
    if (!res.ok) throw new Error('Failed to fetch artist albums');
    return res.json();
  },

  async getArtistTopTracks(
    artistId: string,
    market?: string
  ): Promise<MultipleTracks> {
    const params = market ? `?market=${market}` : '';
    const res = await fetch(`/api/spotify/artists/${artistId}/top-tracks${params}`);
    if (!res.ok) throw new Error('Failed to fetch artist top tracks');
    return res.json();
  },
};