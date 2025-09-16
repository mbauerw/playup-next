import { SpotifyExternalUrls, SpotifyImage, SpotifyRestrictions } from './common';
import { SpotifyArtist } from './artist';

export interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: SpotifyRestrictions;
  type: 'album';
  uri: string;
  artists: SpotifyArtist[];
}