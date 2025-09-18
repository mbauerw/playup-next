'use client';

import { useCallback, useState, useEffect, MouseEvent } from 'react';
import { useSpotifyTracks } from '@/hooks/useSpotifyTracks';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import { useSpotifyPlaylists } from '@/hooks/useSpotifyPlaylists';
import { SpotifyTrack, RecentlyPlayedTracks, CurrentUserPlaylists } from '@/types';

import {
  Button,
  Menu,
  MenuItem,
  IconButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  AccountCircle,
  Settings,
  Logout,
  Edit,
  Delete,
  Share
} from '@mui/icons-material';

interface ApiPanelProps {
  // auth state
  token: string | null;
  loading: boolean;
}

// Type definitions
type MenuAction = 'Profile' | 'My account' | 'Settings' | 'Edit' | 'Share' | 'Delete' | 'Logout';

interface MenuState {
  anchorEl: HTMLElement | null;
  open: boolean;
}

const ApiPanel = ({
  token,
  loading
}: ApiPanelProps) => {
  const bringItHome = "https://open.spotify.com/track/1rxD34LAtkafrMUHqHIV76?si=57ae247bcacb49d4"

  const {
    singleTrack,
    savedTracks,
    loading: trackLoading,
    error,
    fetchTrack,
    fetchSavedTracks,
    clearData,
  } = useSpotifyTracks();

  // Add player hook for recently played tracks
  const {
    recentTracks,
    loading: playerLoading,
    error: playerError,
    fetchRecentlyPlayed,
    clearData: clearPlayerData,
  } = useSpotifyPlayer();

  // Add playlists hook for current user playlists
  const {
    currentUserPlaylists,
    loading: playlistsLoading,
    error: playlistsError,
    fetchCurrentUserPlaylists,
    clearData: clearPlaylistsData,
  } = useSpotifyPlaylists();

  const [trackId, setTrackId] = useState('1rxD34LAtkafrMUHqHIV76');
  const [market, setMarket] = useState('US');

  // Saved tracks parameters
  const [savedTracksLimit, setSavedTracksLimit] = useState(5);
  const [savedTracksOffset, setSavedTracksOffset] = useState(0);
  const [savedTracksDialogOpen, setSavedTracksDialogOpen] = useState(false);

  // Recently played tracks parameters
  const [recentTracksLimit, setRecentTracksLimit] = useState(10);
  const [recentTracksAfter, setRecentTracksAfter] = useState<string>('');
  const [recentTracksBefore, setRecentTracksBefore] = useState<string>('');
  const [recentTracksDialogOpen, setRecentTracksDialogOpen] = useState(false);

  // Current user playlists parameters
  const [playlistsLimit, setPlaylistsLimit] = useState(20);
  const [playlistsOffset, setPlaylistsOffset] = useState(0);
  const [playlistsDialogOpen, setPlaylistsDialogOpen] = useState(false);

  // menu anchors
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open: boolean = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action: MenuAction): void => {
    console.log(`Selected: ${action}`);
    handleClose();
  };

  // track api
  const handleFetchSingleTrack = () => {
    if (!token) {
      alert('Please enter an access token');
      return;
    }
    fetchTrack(token, trackId, market || undefined);
  };

  const handleOpenSavedTracksDialog = () => {
    handleClose(); // Close the menu first
    setSavedTracksDialogOpen(true);
  };

  const handleCloseSavedTracksDialog = () => {
    setSavedTracksDialogOpen(false);
  };

  const handleGetSavedTracks = () => {
    if (!token) {
      alert('Please enter an access token');
      return;
    }
    fetchSavedTracks(token, { 
      limit: savedTracksLimit, 
      offset: savedTracksOffset 
    });
    setSavedTracksDialogOpen(false);
  };

  // Recently played tracks handlers
  const handleOpenRecentTracksDialog = () => {
    handleClose(); // Close the menu first
    setRecentTracksDialogOpen(true);
  };

  const handleCloseRecentTracksDialog = () => {
    setRecentTracksDialogOpen(false);
  };

  const handleGetRecentTracks = () => {
    if (!token) {
      alert('Please enter an access token');
      return;
    }

    const options: {limit?: number, after?: number, before?: number} = {
      limit: recentTracksLimit
    };

    // Convert timestamp strings to numbers if provided
    if (recentTracksAfter.trim()) {
      const afterTimestamp = parseInt(recentTracksAfter.trim());
      if (!isNaN(afterTimestamp)) {
        options.after = afterTimestamp;
      }
    }

    if (recentTracksBefore.trim()) {
      const beforeTimestamp = parseInt(recentTracksBefore.trim());
      if (!isNaN(beforeTimestamp)) {
        options.before = beforeTimestamp;
      }
    }

    fetchRecentlyPlayed(token, options);
    setRecentTracksDialogOpen(false);
  };

  // Current user playlists handlers
  const handleOpenPlaylistsDialog = () => {
    handleClose(); // Close the menu first
    setPlaylistsDialogOpen(true);
  };

  const handleClosePlaylistsDialog = () => {
    setPlaylistsDialogOpen(false);
  };

  const handleGetCurrentUserPlaylists = () => {
    if (!token) {
      alert('Please enter an access token');
      return;
    }
    fetchCurrentUserPlaylists(token, { 
      limit: playlistsLimit, 
      offset: playlistsOffset 
    });
    setPlaylistsDialogOpen(false);
  };

  const onClearAll = () => {
    clearData();
    clearPlayerData();
    clearPlaylistsData();
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleFetchSingleTrack}
        disabled={trackLoading}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        Get Bring It On Home
      </button>

      {singleTrack && (
        <div className='bg-gray-50 rounded-lg p-4 mt-4'>
          <h3 className='text-lg font-semibold mb-3'>Track Information</h3>
          <div className='space-y-2'>
            <div>
              <span className='font-medium'>Track:</span> {singleTrack.name}
            </div>
            <div>
              <span className='font-medium'>Artists:</span> {singleTrack.artists.map(artist => artist.name).join(', ')}
            </div>
            <div>
              <span className='font-medium'>Album:</span> {singleTrack.album.name}
            </div>
            <div>
              <span className='font-medium'>Release Date:</span> {singleTrack.album.release_date}
            </div>
            <div>
              <span className='font-medium'>Popularity:</span> {singleTrack.popularity}/100
            </div>
            <div>
              <span className='font-medium'>Duration:</span> {Math.floor(singleTrack.duration_ms / 60000)}:{((singleTrack.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
            </div>
          </div>
        </div>
      )}

      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"
      >
        Open Menu
      </Button>
      
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleOpenSavedTracksDialog}>
          Get Saved Tracks
        </MenuItem>
        <MenuItem onClick={handleOpenRecentTracksDialog}>
          Get Recently Played
        </MenuItem>
        <MenuItem onClick={handleOpenPlaylistsDialog}>
          Get Current User Playlists
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('My account')}>
          My account
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('Logout')}>
          Logout
        </MenuItem>
      </Menu>

      {/* Saved Tracks Parameters Dialog */}
      <Dialog open={savedTracksDialogOpen} onClose={handleCloseSavedTracksDialog}>
        <DialogTitle>Fetch Saved Tracks</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Limit"
              type="number"
              value={savedTracksLimit}
              onChange={(e) => setSavedTracksLimit(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              helperText="Number of tracks to fetch (1-50)"
              inputProps={{ min: 1, max: 50 }}
              fullWidth
            />
            <TextField
              label="Offset"
              type="number"
              value={savedTracksOffset}
              onChange={(e) => setSavedTracksOffset(Math.max(0, parseInt(e.target.value) || 0))}
              helperText="Starting position (0 = first track)"
              inputProps={{ min: 0 }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSavedTracksDialog}>Cancel</Button>
          <Button onClick={handleGetSavedTracks} variant="contained" disabled={!token}>
            Fetch Tracks
          </Button>
        </DialogActions>
      </Dialog>

      {/* Recently Played Tracks Parameters Dialog */}
      <Dialog open={recentTracksDialogOpen} onClose={handleCloseRecentTracksDialog}>
        <DialogTitle>Fetch Recently Played Tracks</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Limit"
              type="number"
              value={recentTracksLimit}
              onChange={(e) => setRecentTracksLimit(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              helperText="Number of tracks to fetch (1-50)"
              inputProps={{ min: 1, max: 50 }}
              fullWidth
            />
            <TextField
              label="After (Unix timestamp)"
              type="text"
              value={recentTracksAfter}
              onChange={(e) => setRecentTracksAfter(e.target.value)}
              helperText="Return tracks after this timestamp (optional)"
              fullWidth
            />
            <TextField
              label="Before (Unix timestamp)"
              type="text"
              value={recentTracksBefore}
              onChange={(e) => setRecentTracksBefore(e.target.value)}
              helperText="Return tracks before this timestamp (optional)"
              fullWidth
            />
            <Typography variant="caption" color="text.secondary">
              Tip: Unix timestamps can be generated at unixtimestamp.com
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRecentTracksDialog}>Cancel</Button>
          <Button onClick={handleGetRecentTracks} variant="contained" disabled={!token}>
            Fetch Recently Played
          </Button>
        </DialogActions>
      </Dialog>

      {/* Current User Playlists Parameters Dialog */}
      <Dialog open={playlistsDialogOpen} onClose={handleClosePlaylistsDialog}>
        <DialogTitle>Fetch Current User Playlists</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Limit"
              type="number"
              value={playlistsLimit}
              onChange={(e) => setPlaylistsLimit(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              helperText="Number of playlists to fetch (1-50)"
              inputProps={{ min: 1, max: 50 }}
              fullWidth
            />
            <TextField
              label="Offset"
              type="number"
              value={playlistsOffset}
              onChange={(e) => setPlaylistsOffset(Math.max(0, parseInt(e.target.value) || 0))}
              helperText="Starting position (0 = first playlist)"
              inputProps={{ min: 0 }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePlaylistsDialog}>Cancel</Button>
          <Button onClick={handleGetCurrentUserPlaylists} variant="contained" disabled={!token}>
            Fetch Playlists
          </Button>
        </DialogActions>
      </Dialog>
      
      {savedTracks && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-xl font-bold text-gray-900">
              Your Saved Tracks ({savedTracks.total} total)
            </h3>
            <p className="text-sm text-gray-500">
              Showing {savedTracks.items.length} tracks (offset: {savedTracks.offset})
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Track</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Album</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {savedTracks.items.map((savedTrack, index) => (
                  <tr key={savedTrack.track.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {savedTrack.track.album.images?.[2] && (
                          <img
                            src={savedTrack.track.album.images[2].url}
                            alt={savedTrack.track.album.name}
                            className="w-10 h-10 rounded mr-3"
                          />
                        )}
                        <div className="font-medium text-gray-900">{savedTrack.track.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {savedTrack.track.artists.map(artist => artist.name).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {savedTrack.track.album.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.floor(savedTrack.track.duration_ms / 60000)}:{((savedTrack.track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(savedTrack.added_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recently Played Tracks Display */}
      {recentTracks && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-xl font-bold text-gray-900">
              Recently Played Tracks ({recentTracks.total} total)
            </h3>
            <p className="text-sm text-gray-500">
              Showing {recentTracks.items.length} tracks
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Track</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Album</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Played At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Context</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTracks.items.map((playHistory, index) => (
                  <tr key={`${playHistory.track.id}-${playHistory.played_at}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {playHistory.track.album.images?.[2] && (
                          <img
                            src={playHistory.track.album.images[2].url}
                            alt={playHistory.track.album.name}
                            className="w-10 h-10 rounded mr-3"
                          />
                        )}
                        <div className="font-medium text-gray-900">{playHistory.track.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {playHistory.track.artists.map(artist => artist.name).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {playHistory.track.album.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.floor(playHistory.track.duration_ms / 60000)}:{((playHistory.track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(playHistory.played_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {playHistory.context ? playHistory.context.type : 'No context'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Current User Playlists Display */}
      {currentUserPlaylists && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-xl font-bold text-gray-900">
              Your Playlists ({currentUserPlaylists.total} total)
            </h3>
            <p className="text-sm text-gray-500">
              Showing {currentUserPlaylists.items.length} playlists (offset: {currentUserPlaylists.offset})
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Playlist</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Public</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collaborative</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUserPlaylists.items.map((playlist, index) => (
                  <tr key={playlist.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {playlist.images?.[0] && (
                          <img
                            src={playlist.images[0].url}
                            alt={playlist.name}
                            className="w-10 h-10 rounded mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{playlist.name}</div>
                          <div className="text-sm text-gray-500">{playlist.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {playlist.owner.display_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {playlist.tracks.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        playlist.public 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {playlist.public ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        playlist.collaborative 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {playlist.collaborative ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {playlist.description || 'No description'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button
        onClick={onClearAll}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Clear All Data
      </button>

      {/* Display any errors */}
      {(error || playerError || playlistsError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          <p className="font-medium">Error:</p>
          <p>{error || playerError || playlistsError}</p>
        </div>
      )}
    </div>
  )
}

export default ApiPanel;