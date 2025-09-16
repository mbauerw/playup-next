// types/auth.ts
export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface UsePkceAuthReturn {
  code: string;
  isLoading: boolean;
  error: string | null;
  initiateAuth: () => Promise<void>;
  clearAuth: () => void;
}