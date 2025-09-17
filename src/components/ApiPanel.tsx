'use client';

import { useCallback, useState, useEffect, MouseEvent } from 'react';
import { useSpotifyTracks } from '@/hooks/useSpotifyTracks';
import { SpotifyTrack } from '@/types';

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

  const [trackId, setTrackId] = useState('1rxD34LAtkafrMUHqHIV76');
  const [market, setMarket] = useState('US');

  // Saved tracks parameters
  const [savedTracksLimit, setSavedTracksLimit] = useState(5);
  const [savedTracksOffset, setSavedTracksOffset] = useState(0);
  const [savedTracksDialogOpen, setSavedTracksDialogOpen] = useState(false);

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

  const onClearAll = () => {
    clearData();
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

      <button
        onClick={onClearAll}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Clear All Data
      </button>
    </div>
  )
}

export default ApiPanel;