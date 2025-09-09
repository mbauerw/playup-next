'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useSpotifyAuth, useSpotifyToken } from '@/hooks/useSpotifyAuth';
import { spotifyApi } from '@/services/spotifyApi';
import type { CurrentUser, CurrentUserPlaylists, SpotifyArtist } from '@/types';

export default function Home() {
  const { data: session, status } = useSession();
  
  // Auth state
  const { code, isLoading: authLoading, error: authError, initiateAuth, clearAuth } = useSpotifyAuth();
  const { token, loading: tokenLoading, error: tokenError, fetchToken, clearToken } = useSpotifyToken(code);

  // Data state
  const [profile, setProfile] = useState<CurrentUser | null>(null);
  const [playlists, setPlaylists] = useState<CurrentUserPlaylists | null>(null);
  const [artistData, setArtistData] = useState<SpotifyArtist | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetToken = useCallback(async () => {
    if (!code) {
      console.log('No authorization code available');
      return;
    }
    
    try {
      await fetchToken();
    } catch (error) {
      console.error('Failed to get token:', error);
    }
  }, [code, fetchToken]);

  const handleGetProfile = useCallback(async () => {
    if (!token) {
      console.log('No token available for profile');
      return;
    }

    setLoading(true);
    try {
      const result = await spotifyApi.getCurrentUser(token);
      setProfile(result);
      console.log('Profile retrieved:', result);
    } catch (error) {
      console.error('Failed to get profile:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleGetPlaylists = useCallback(async () => {
    if (!token) {
      console.log('No token available for playlists');
      return;
    }

    setLoading(true);
    try {
      const result = await spotifyApi.getCurrentUserPlaylists(token);
      setPlaylists(result);
      console.log('Playlists retrieved:', result);
    } catch (error) {
      console.error('Failed to get playlists:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleGetArtistData = useCallback(async () => {
    if (!token) {
      console.log('No token available for artist data');
      return;
    }

    setLoading(true);
    try {
      const artistId = "7Ln80lUS6He07XvHI8qqHH";
      const result = await spotifyApi.getArtist(token, artistId);
      setArtistData(result);
      console.log('Artist data retrieved:', result);
    } catch (error) {
      console.error('Failed to get artist data:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleClearAll = useCallback(() => {
    clearAuth();
    clearToken();
    setProfile(null);
    setPlaylists(null);
    setArtistData(null);
  }, [clearAuth, clearToken]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to PlayUp</h1>
          <p className="mb-8">Please sign in to access your Spotify data</p>
          <a 
            href="/login"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">PlayUp - Spotify Integration</h1>
        <div className="flex items-center space-x-4">
          <span>Welcome, {session.user?.name || session.user?.email}</span>
          <button 
            onClick={() => signOut()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Auth Status */}
        <div className="text-center">
          <p className="mb-2">
            Code: {code ? 'Authorization received' : 'No authorization code'}
          </p>
          <p className="mb-4">
            Token: {token ? 'Token received' : 'No token'}
          </p>
          {authError && <p className="text-red-500">Auth Error: {authError}</p>}
          {tokenError && <p className="text-red-500">Token Error: {tokenError}</p>}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          <button 
            onClick={initiateAuth} 
            disabled={authLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {authLoading ? 'Authenticating...' : 'Get Spotify Auth'}
          </button>

          <button 
            onClick={handleGetToken} 
            disabled={tokenLoading || !code}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {tokenLoading ? 'Getting Token...' : 'Get Token'}
          </button>

          <button 
            onClick={handleGetProfile} 
            disabled={loading || !token}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? 'Loading...' : 'Get Profile'}
          </button>

          <button 
            onClick={handleGetPlaylists} 
            disabled={loading || !token}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {loading ? 'Loading...' : 'Get Playlists'}
          </button>

          <button 
            onClick={handleGetArtistData} 
            disabled={loading || !token}
            className="bg-pink-600 hover:bg-pink-700"
          >
            {loading ? 'Loading...' : 'Get Artist Data'}
          </button>

          <button 
            onClick={handleClearAll}
            className="bg-red-600 hover:bg-red-700"
          >
            Clear All
          </button>
        </div>

        {/* Data Display */}
        <div className="space-y-6">
          {profile && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Profile</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          )}

          {playlists && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Playlists</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(playlists, null, 2)}
              </pre>
            </div>
          )}

          {artistData && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Artist Data</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(artistData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}