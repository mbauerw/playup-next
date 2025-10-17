// services/spotify/player.ts
import { makeAuthenticatedRequest } from './index';
import type { PlaybackState, RecentlyPlayedTracks } from '@/types';

export const spotifyPlayer = {
  async getCurrentPlayback(
    accessToken: string, 
    market?: string
  ): Promise<PlaybackState | null> {
    const params = market ? `?market=${market}` : '';
    try {
      return await makeAuthenticatedRequest<PlaybackState>(
        `/me/player${params}`, 
        accessToken
      );
    } catch (error: any) {
      // Spotify returns 204 when no active device
      if (error.status === 204) {
        return null;
      }
      throw error;
    }
  },

  async pausePlayback(
    accessToken: string, 
    deviceId?: string
  ): Promise<void> {
    const params = deviceId ? `?device_id=${deviceId}` : '';
    await makeAuthenticatedRequest(
      `/me/player/pause${params}`, 
      accessToken, 
      { method: 'PUT' }
    );
  },

  async resumePlayback(
    accessToken: string,
    options?: {
      deviceId?: string;
      contextUri?: string;
      uris?: string[];
      offset?: { position?: number; uri?: string };
      positionMs?: number;
    }
  ): Promise<void> {
    const params = options?.deviceId ? `?device_id=${options.deviceId}` : '';
    const body: any = {};
    
    if (options?.contextUri) body.context_uri = options.contextUri;
    if (options?.uris) body.uris = options.uris;
    if (options?.offset) body.offset = options.offset;
    if (options?.positionMs) body.position_ms = options.positionMs;

    await makeAuthenticatedRequest(
      `/me/player/play${params}`,
      accessToken,
      {
        method: 'PUT',
        body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
      }
    );
  },

  async skipToNext(
    accessToken: string, 
    deviceId?: string
  ): Promise<void> {
    const params = deviceId ? `?device_id=${deviceId}` : '';
    await makeAuthenticatedRequest(
      `/me/player/next${params}`, 
      accessToken, 
      { method: 'POST' }
    );
  },

  async skipToPrevious(
    accessToken: string, 
    deviceId?: string
  ): Promise<void> {
    const params = deviceId ? `?device_id=${deviceId}` : '';
    await makeAuthenticatedRequest(
      `/me/player/previous${params}`, 
      accessToken, 
      { method: 'POST' }
    );
  },

  async setVolume(
    accessToken: string,
    volumePercent: number,
    deviceId?: string
  ): Promise<void> {
    const params = new URLSearchParams({ 
      volume_percent: volumePercent.toString() 
    });
    if (deviceId) params.append('device_id', deviceId);
    
    await makeAuthenticatedRequest(
      `/me/player/volume?${params}`, 
      accessToken, 
      { method: 'PUT' }
    );
  },

  async toggleShuffle(
    accessToken: string,
    state: boolean,
    deviceId?: string
  ): Promise<void> {
    const params = new URLSearchParams({ state: state.toString() });
    if (deviceId) params.append('device_id', deviceId);
    
    await makeAuthenticatedRequest(
      `/me/player/shuffle?${params}`, 
      accessToken, 
      { method: 'PUT' }
    );
  },

  async setRepeatMode(
    accessToken: string,
    state: 'track' | 'context' | 'off',
    deviceId?: string
  ): Promise<void> {
    const params = new URLSearchParams({ state });
    if (deviceId) params.append('device_id', deviceId);
    
    await makeAuthenticatedRequest(
      `/me/player/repeat?${params}`, 
      accessToken, 
      { method: 'PUT' }
    );
  },

  async getRecentlyPlayed(
    accessToken: string,
    options?: { limit?: number; after?: number; before?: number }
  ): Promise<RecentlyPlayedTracks> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.after) params.append('after', options.after.toString());
    if (options?.before) params.append('before', options.before.toString());

    const query = params.toString() ? `?${params}` : '';
    return makeAuthenticatedRequest<RecentlyPlayedTracks>(
      `/me/player/recently-played${query}`, 
      accessToken
    );
  },
};