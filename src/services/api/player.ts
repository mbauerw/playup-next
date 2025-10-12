// services/api/player.ts
import type { PlaybackState, RecentlyPlayedTracks } from '@/types';

export const playerAPI = {
  async getCurrentPlayback(market?: string): Promise<PlaybackState | null> {
    const params = market ? `?market=${market}` : '';
    const res = await fetch(`/api/spotify/player/current${params}`);
    if (!res.ok) throw new Error('Failed to get current playback');
    return res.json();
  },

  async pausePlayback(deviceId?: string): Promise<void> {
    const params = deviceId ? `?device_id=${deviceId}` : '';
    const res = await fetch(`/api/spotify/player/pause${params}`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to pause playback');
  },

  async resumePlayback(options?: {
    deviceId?: string;
    contextUri?: string;
    uris?: string[];
    offset?: { position?: number; uri?: string };
    positionMs?: number;
  }): Promise<void> {
    const params = options?.deviceId ? `?device_id=${options.deviceId}` : '';
    const res = await fetch(`/api/spotify/player/play${params}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contextUri: options?.contextUri,
        uris: options?.uris,
        offset: options?.offset,
        positionMs: options?.positionMs,
      }),
    });
    if (!res.ok) throw new Error('Failed to resume playback');
  },

  async skipToNext(deviceId?: string): Promise<void> {
    const params = deviceId ? `?device_id=${deviceId}` : '';
    const res = await fetch(`/api/spotify/player/next${params}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to skip to next');
  },

  async skipToPrevious(deviceId?: string): Promise<void> {
    const params = deviceId ? `?device_id=${deviceId}` : '';
    const res = await fetch(`/api/spotify/player/previous${params}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to skip to previous');
  },

  async setVolume(volumePercent: number, deviceId?: string): Promise<void> {
    const params = new URLSearchParams({ 
      volume_percent: volumePercent.toString() 
    });
    if (deviceId) params.append('device_id', deviceId);
    
    const res = await fetch(`/api/spotify/player/volume?${params}`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to set volume');
  },

  async toggleShuffle(state: boolean, deviceId?: string): Promise<void> {
    const params = new URLSearchParams({ state: state.toString() });
    if (deviceId) params.append('device_id', deviceId);
    
    const res = await fetch(`/api/spotify/player/shuffle?${params}`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to toggle shuffle');
  },

  async setRepeatMode(
    state: 'track' | 'context' | 'off',
    deviceId?: string
  ): Promise<void> {
    const params = new URLSearchParams({ state });
    if (deviceId) params.append('device_id', deviceId);
    
    const res = await fetch(`/api/spotify/player/repeat?${params}`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to set repeat mode');
  },

  async getRecentlyPlayed(options?: {
    limit?: number;
    after?: number;
    before?: number;
  }): Promise<RecentlyPlayedTracks> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.after) params.append('after', options.after.toString());
    if (options?.before) params.append('before', options.before.toString());
    
    const query = params.toString() ? `?${params}` : '';
    const res = await fetch(`/api/spotify/player/recently-played${query}`);
    if (!res.ok) throw new Error('Failed to get recently played');
    return res.json();
  },
};