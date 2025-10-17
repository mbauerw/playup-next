// services/spotify/search.ts
import { makeAuthenticatedRequest } from './index';
import type { SearchResults } from '@/types';

export const spotifySearch = {
  async search(
    accessToken: string,
    query: string,
    type: string,
    options?: {
      market?: string;
      limit?: number;
      offset?: number;
      include_external?: 'audio';
    }
  ): Promise<SearchResults> {
    const params = new URLSearchParams();
    params.append('q', query);
    params.append('type', type);
    
    if (options?.market) params.append('market', options.market);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.include_external) params.append('include_external', options.include_external);

    return makeAuthenticatedRequest<SearchResults>(
      `/search?${params}`,
      accessToken
    );
  },
};