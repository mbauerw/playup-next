import type { 
  CurrentUser, 
  CurrentUserPlaylists, 
  GetPlaylistsParams,
  SpotifyTokenResponse,
  SpotifyArtist
} from '@/types';

export class SpotifyApiError extends Error {
  public status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'SpotifyApiError';
    this.status = status;
  }
}

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

export const makeAuthenticatedRequest = async <T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${SPOTIFY_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new SpotifyApiError(
      `Spotify API Error: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  return response.json();
};

export const spotifyApi = {
  // Authentication
  async getToken(code: string, verifier: string): Promise<SpotifyTokenResponse> {
    const params = new URLSearchParams();
    params.append("client_id", process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.NEXT_PUBLIC_REDIRECT_URI!);
    params.append("code_verifier", verifier);

    const response = await fetch(`https://accounts.spotify.com/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    if (!response.ok) {
      throw new SpotifyApiError(`Token request failed: ${response.status}`);
    }

    return response.json();
  },

  // Search endpoints
  async search(accessToken: string, query: string, type: string) {
    const queryString = new URLSearchParams({ q: query, type });
    return makeAuthenticatedRequest(`/search?${queryString}`, accessToken);
  },

  // Player endpoints
  async getCurrentPlayback(accessToken: string) {
    return makeAuthenticatedRequest('/me/player', accessToken);
  },

  async pausePlayback(accessToken: string) {
    return makeAuthenticatedRequest('/me/player/pause', accessToken, {
      method: 'PUT'
    });
  }
};

// Re-export all services
export * from './playlists';
export * from './users';
export * from './tracks';
export * from './artists';
