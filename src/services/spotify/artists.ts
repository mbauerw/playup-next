import { makeAuthenticatedRequest } from ".";
import type { 
  SpotifyArtist, 
  ArtistAlbums, 
  SpotifyTrack,
  MultipleTracks 
} from "@/types";

export const spotifyArtists = {
  // Artist endpoints
  async getArtist(accessToken: string, artistId: string): Promise<SpotifyArtist> {
    return makeAuthenticatedRequest<SpotifyArtist>(`/artists/${artistId}`, accessToken);
  },

  async getSeveralArtists(accessToken: string, artistIds: string): Promise<SpotifyArtist[]> {
    return makeAuthenticatedRequest<SpotifyArtist[]>(`/artists/${artistIds}`, accessToken);
  },

  // Get Artist's Albums
  async getArtistAlbums(
    accessToken: string, 
    artistId: string,
    options?: {
      include_groups?: string; // 'album,single,appears_on,compilation'
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
    return makeAuthenticatedRequest<ArtistAlbums>(
      `/artists/${artistId}/albums${query}`, 
      accessToken
    );
  },

  // Get Artist's Top Tracks
  async getArtistTopTracks(
    accessToken: string, 
    artistId: string, 
    market?: string
  ): Promise<MultipleTracks> {
    const params = market ? `?market=${market}` : '';
    return makeAuthenticatedRequest<MultipleTracks>(
      `/artists/${artistId}/top-tracks${params}`, 
      accessToken
    );
  }
};
