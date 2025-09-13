import { makeAuthenticatedRequest } from ".";
import type { SpotifyArtist } from "@/types";


export const spotifyArtists = {
  // Artist endpoints
  async getArtist(accessToken: string, artistId: string): Promise<SpotifyArtist> {
    return makeAuthenticatedRequest<SpotifyArtist>(`/artists/${artistId}`, accessToken);
  },

  async getSeveralArtists(accessToken: string, artistIds: string): Promise<SpotifyArtist[]> {
    return makeAuthenticatedRequest<SpotifyArtist[]>(`/artists/${artistIds}`, accessToken);
  }

}
