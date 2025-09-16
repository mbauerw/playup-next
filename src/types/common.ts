export interface SpotifyImage {
  height: number | null;
  url: string;
  width: number | null;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyExternalIds {
  isrc?: string;
  ean?: string;
  upc?: string;
}

export interface SpotifyRestrictions {
  reason: string;
}

export interface SpotifyLinkedFrom {
  // This can be expanded based on actual usage
  // The API response shows an empty object
}

export interface Followers {
  href: string | null;
  total: number;
}

export interface SpotifyCursors {
  after: string;
  before?: string;
}