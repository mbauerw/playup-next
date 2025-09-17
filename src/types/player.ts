import { SpotifyCursors, SpotifyExternalUrls } from './common';
import { SpotifyTrack } from './track';

export interface Device {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
  supports_volume: boolean;
}

export interface PlaybackState {
  device: Device;
  repeat_state: string;
  shuffle_state: boolean;
  context: {
    type: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    uri: string;
  } | null;
  timestamp: number;
  progress_ms: number;
  is_playing: boolean;
  item: SpotifyTrack;
  currently_playing_type: string;
  actions: {
    interrupting_playback?: boolean;
    pausing?: boolean;
    resuming?: boolean;
    seeking?: boolean;
    skipping_next?: boolean;
    skipping_prev?: boolean;
    toggling_repeat_context?: boolean;
    toggling_shuffle?: boolean;
    toggling_repeat_track?: boolean;
    transferring_playback?: boolean;
  };
}

export interface PlayHistory {
  track: SpotifyTrack;
  played_at: string; // ISO 8601 datetime string
  context: PlayHistoryContext | null;
}

export interface PlayHistoryContext {
  type: string; // e.g., "playlist", "album", "artist", "show"
  href: string;
  external_urls: SpotifyExternalUrls;
  uri: string;
}

export interface RecentlyPlayedTracks {
  href: string;
  limit: number;
  next: string | null;
  cursors: SpotifyCursors;
  total: number;
  items: PlayHistory[];
}