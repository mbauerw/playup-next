// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSpotifyAuth, useSpotifyToken } from '@/hooks/useSpotifyAuth';
import { spotifyApi } from '@/services/spotifyApi';
import type { CurrentUser, CurrentUserPlaylists, SpotifyArtist } from '@/types';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Auth state
  const { code, isLoading: authLoading, error: authError, initiateAuth, clearAuth } = useSpotifyAuth();
  const { token, loading: tokenLoading, error: tokenError, fetchToken, clearToken } = useSpotifyToken(code);

  // Data state
  const [profile, setProfile] = useState<CurrentUser | null>(null);
  const [playlists, setPlaylists] = useState<CurrentUserPlaylists | null>(null);
  const [artistData, setArtistData] = useState<SpotifyArtist | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">PlayUp Dashboard</h1>
              <span className="text-sm text-gray-500">
                Welcome, {session.user?.name || session.user?.email}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Spotify Connection Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${code ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-700">
                Authorization: {code ? 'Connected' : 'Not connected'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${token ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-gray-700">
                Access Token: {token ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          {authError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Auth Error: {authError}
            </div>
          )}
          {tokenError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Token Error: {tokenError}
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Spotify Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={initiateAuth} 
              disabled={authLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {authLoading ? 'Connecting...' : 'Connect Spotify'}
            </button>

            <button 
              onClick={handleGetToken} 
              disabled={tokenLoading || !code}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {tokenLoading ? 'Getting Token...' : 'Get Access Token'}
            </button>

            <button 
              onClick={handleGetProfile} 
              disabled={loading || !token}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Get Profile'}
            </button>

            <button 
              onClick={handleGetPlaylists} 
              disabled={loading || !token}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Get Playlists'}
            </button>

            <button 
              onClick={handleGetArtistData} 
              disabled={loading || !token}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Get Sample Artist'}
            </button>

            <button 
              onClick={handleClearAll}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Clear All Data
            </button>
          </div>
        </div>

        {/* Data Display */}
        <div className="space-y-6">
          {profile && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Spotify Profile
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm overflow-auto text-gray-700">
                  {JSON.stringify(profile, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {playlists && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Your Playlists ({playlists.total} total)
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm overflow-auto text-gray-700">
                  {JSON.stringify(playlists, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {artistData && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 12c0-1.519-.423-2.939-1.157-4.157a1 1 0 010-1.486z" clipRule="evenodd" />
                </svg>
                Artist Data: {artistData.name}
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm overflow-auto text-gray-700">
                  {JSON.stringify(artistData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {token && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-4 text-white">
                <h4 className="font-semibold">Create Playlist</h4>
                <p className="text-sm opacity-90">Build a new custom playlist</p>
                <button className="mt-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm">
                  Coming Soon
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg p-4 text-white">
                <h4 className="font-semibold">Discover Music</h4>
                <p className="text-sm opacity-90">Find new songs you'll love</p>
                <button className="mt-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm">
                  Coming Soon
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-4 text-white">
                <h4 className="font-semibold">Analyze Taste</h4>
                <p className="text-sm opacity-90">See your music patterns</p>
                <button className="mt-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}