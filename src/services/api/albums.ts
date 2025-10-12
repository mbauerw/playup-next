// services/api/albums.ts
import type { 
  SpotifyAlbum, 
  MultipleAlbums,
  AlbumTracks,
  SavedAlbums 
} from '@/types';

export const albumsAPI = {
  async getAlbum(albumId: string, market?: string): Promise<SpotifyAlbum> {
    const params = market ? `?market=${market}` : '';
    const res = await fetch(`/api/spotify/albums/${albumId}${params}`);
    if (!res.ok) throw new Error('Failed to fetch album');
    return res.json();
  },

  async getAlbums(albumIds: string[], market?: string): Promise<MultipleAlbums> {
    const params = new URLSearchParams();
    params.append('ids', albumIds.join(','));
    if (market) params.append('market', market);
    
    const res = await fetch(`/api/spotify/albums/several?${params}`);
    if (!res.ok) throw new Error('Failed to fetch albums');
    return res.json();
  },

  async getAlbumTracks(
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
    const res = await fetch(`/api/spotify/albums/${albumId}/tracks${query}`);
    if (!res.ok) throw new Error('Failed to fetch album tracks');
    return res.json();
  },

  async getSavedAlbums(options?: { 
    limit?: number;
    offset?: number;
    market?: string;
  }): Promise<SavedAlbums> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.market) params.append('market', options.market);
    
    const query = params.toString() ? `?${params}` : '';
    const res = await fetch(`/api/spotify/albums/saved${query}`);
    if (!res.ok) throw new Error('Failed to fetch saved albums');
    return res.json();
  },
};