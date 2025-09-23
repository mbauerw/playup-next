'use client';

import { useCallback } from 'react';

interface ControlPanelProps {
  // auth state
  code: string;
  token: string | null;
  authLoading: boolean;
  tokenLoading: boolean;
  loading: boolean;
  authError: string | null;
  tokenError: string | null;
  
  // actions
  initiateAuth: () => Promise<void>;
  fetchToken: () => Promise<string>;
  clearAuth: () => void;
  clearToken: () => void;
  
  // data actions
  onGetProfile: () => Promise<void>;
  onGetPlaylists: () => Promise<void>;
  onGetArtistData: () => Promise<void>;
  onClearAll: () => void;
}

export default function ControlPanel({
  code,
  token,
  authLoading,
  tokenLoading,
  loading,
  authError,
  tokenError,
  initiateAuth,
  fetchToken,
  clearAuth,
  clearToken,
  onGetProfile,
  onGetPlaylists,
  onGetArtistData,
  onClearAll
}: ControlPanelProps) {

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

  return (
    <div className="bg-gray-400 rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Spotify Actions</h2>
      
      {/* Connection Status */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Connection Status</h3>
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

      {/* Action Buttons */}
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
          onClick={onGetProfile} 
          disabled={loading || !token}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Profile'}
        </button>

        <button 
          onClick={onGetPlaylists} 
          disabled={loading || !token}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Playlists'}
        </button>

        <button 
          onClick={onGetArtistData} 
          disabled={loading || !token}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Sample Artist'}
        </button>

        <button 
          onClick={onClearAll}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear All Data
        </button>
      </div>
    </div>
  );
}