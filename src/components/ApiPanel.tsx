'use client';

import { useCallback, useState, useEffect, MouseEvent } from 'react';
import { useSpotifyTracks } from '@/hooks/useSpotifyTracks';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import { useSpotifyPlaylists } from '@/hooks/useSpotifyPlaylists';
import { SpotifyTrack, RecentlyPlayedTracks, CurrentUserPlaylists, MultipleTracks } from '@/types';
import SavedTracksTable from './displays/SavedTracksTable';
import RecentlyPlayedTracksTable from './displays/RecentlyPlayedTracksTable';
import CurrentUserPlaylistsTable from './displays/CurrentUserPlaylistsTable';
import { useSpotifyAlbums } from '@/hooks/useSpotifyAlbums';
import { Spotify } from 'react-spotify-embed';
import parseAlbumTracks, { getAlbumIds, rankSongPopularity } from '@/lib/analysis/parsers/parseAlbumTracks';

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

  // tracks hooks
  const {
    savedTracks,
    singleTrack,
    multipleTracks,
    savedTrackStatus,
    loading: trackLoading,
    error: tracksError,
    fetchTrack,
    fetchSavedTracks,
    fetchSeveralTracks,
    checkSavedStatus,
    clearData: clearTracksData
  } = useSpotifyTracks();

  // player hooks
  const {
    recentTracks,
    loading: playerLoading,
    error: playerError,
    fetchRecentlyPlayed,
    clearData: clearPlayerData,
  } = useSpotifyPlayer();

  // playlists hooks
  const {
    currentUserPlaylists,
    loading: playlistsLoading,
    error: playlistsError,
    fetchCurrentUserPlaylists,
    clearData: clearPlaylistsData,
  } = useSpotifyPlaylists();

  // album hooks
  const {
    albumTracks,
    loading: albumsLoading,
    error: albumsError,
    fetchAlbumTracks,
    clearData: clearAlbumsData,
  } = useSpotifyAlbums();


  const [trackId, setTrackId] = useState('1rxD34LAtkafrMUHqHIV76');
  const [market, setMarket] = useState('US');

  // Saved tracks parameters
  const [savedTracksLimit, setSavedTracksLimit] = useState(5);
  const [savedTracksOffset, setSavedTracksOffset] = useState(0);
  const [savedTracksDialogOpen, setSavedTracksDialogOpen] = useState(false);

  // recently played tracks params
  const [recentTracksLimit, setRecentTracksLimit] = useState(10);
  const [recentTracksAfter, setRecentTracksAfter] = useState<string>('');
  const [recentTracksBefore, setRecentTracksBefore] = useState<string>('');
  const [recentTracksDialogOpen, setRecentTracksDialogOpen] = useState(false);

  // current user playlists params
  const [playlistsLimit, setPlaylistsLimit] = useState(20);
  const [playlistsOffset, setPlaylistsOffset] = useState(0);
  const [playlistsDialogOpen, setPlaylistsDialogOpen] = useState(false);

  // album params
  const ledZeppelinII = "58MQ0PLijVHePUonQlK76Y";
  const [albumId, setAlbumId] = useState('58MQ0PLijVHePUonQlK76Y'); // Example album ID
  const [albumTracksLimit, setAlbumTracksLimit] = useState(20);
  const [albumTracksOffset, setAlbumTracksOffset] = useState(0);
  const [albumTracksMarket, setAlbumTracksMarket] = useState('US');
  const [albumTracksDialogOpen, setAlbumTracksDialogOpen] = useState(false);
  const [sortedAlbumTracks, setSortedAlbumTracks] = useState<MultipleTracks>();

  // spotify widget player params
  const [playerLink, setPlayerLink] = useState("5ihDGnhQgMA0F0tk9fNLlA?")

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

    const options: { limit?: number, after?: number, before?: number } = {
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

  // album handlers
  const handleOpenAlbumTracksDialog = () => {
    handleClose(); // Close the menu first
    setAlbumTracksDialogOpen(true);
  };

  const handleCloseAlbumTracksDialog = () => {
    setAlbumTracksDialogOpen(false);
  };

  const handleGetAlbumTracks = async () => {
    if (!token) {
      alert('Please enter an access token');
      return;
    }

    try {
      // First fetch the album tracks
      await fetchAlbumTracks(token, albumId, {
        limit: albumTracksLimit,
        offset: albumTracksOffset,
        market: albumTracksMarket || undefined
      });

      // The albumTracks will be available after the fetch completes
      // We'll handle the second API call in a useEffect
    } catch (error) {
      console.error('Failed to fetch album tracks:', error);
    }

    setAlbumTracksDialogOpen(false);
  };

  const handleChangeTrack = (track: string) => {
    setPlayerLink(track);
  }

  const onClearAll = () => {
    clearPlayerData();
    clearPlaylistsData();
    clearAlbumsData();
    clearTracksData(); // Add this line
  }

  useEffect(() => {
    if (albumTracks && albumTracks.items.length > 0 && token) {

      const trackIds = getAlbumIds(albumTracks);

      if (trackIds.length > 0) {
        fetchSeveralTracks(token, trackIds, albumTracksMarket || undefined);
      }
    }
  }, [albumTracks, token, fetchSeveralTracks, albumTracksMarket]);

  useEffect(() => {
    if (multipleTracks) {
      const sortedTracks = rankSongPopularity(multipleTracks);
      setSortedAlbumTracks(sortedTracks);

    }
  }, [multipleTracks, fetchSeveralTracks])

  return (
    <div className='flex flex-col gap-10'>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleFetchSingleTrack}
          disabled={trackLoading}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Get Bring It On Home
        </button>

        {singleTrack && (
          <div className='bg-gray-800 rounded-lg p-4 mt-4 border border-gray-700'>
            <h3 className='text-lg font-semibold mb-3 text-gray-100'>Track Information</h3>
            <div className='space-y-2'>
              <div className='text-gray-300'>
                <span className='font-medium text-gray-100'>Track:</span> {singleTrack.name}
              </div>
              <div>
                <button className='bg-green-500 shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75
                border border-solid border-gray-600 rounded-md px-2 text-gray-900 font-medium' onClick={() => handleChangeTrack(singleTrack.id)}>Play</button>
              </div>
              <div className='text-gray-300'>
                <span className='font-medium text-gray-100'>Artists:</span> {singleTrack.artists.map(artist => artist.name).join(', ')}
              </div>
              <div className='text-gray-300'>
                <span className='font-medium text-gray-100'>Album:</span> {singleTrack.album.name}
              </div>
              <div className='text-gray-300'>
                <span className='font-medium text-gray-100'>Release Date:</span> {singleTrack.album.release_date}
              </div>
              <div className='text-gray-300'>
                <span className='font-medium text-gray-100'>Popularity:</span> {singleTrack.popularity}/100
              </div>
              <div className='text-gray-300'>
                <span className='font-medium text-gray-100'>Duration:</span> {Math.floor(singleTrack.duration_ms / 60000)}:{((singleTrack.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
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
          <MenuItem onClick={handleOpenAlbumTracksDialog}>
            Get Album Tracks
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

        {/* Album Tracks Parameters Dialog */}
        <Dialog open={albumTracksDialogOpen} onClose={handleCloseAlbumTracksDialog}>
          <DialogTitle>Fetch Album Tracks</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Album ID"
                type="text"
                value={albumId}
                onChange={(e) => setAlbumId(e.target.value)}
                helperText="Spotify album ID"
                fullWidth
              />
              <TextField
                label="Limit"
                type="number"
                value={albumTracksLimit}
                onChange={(e) => setAlbumTracksLimit(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                helperText="Number of tracks to fetch (1-50)"
                inputProps={{ min: 1, max: 50 }}
                fullWidth
              />
              <TextField
                label="Offset"
                type="number"
                value={albumTracksOffset}
                onChange={(e) => setAlbumTracksOffset(Math.max(0, parseInt(e.target.value) || 0))}
                helperText="Starting position (0 = first track)"
                inputProps={{ min: 0 }}
                fullWidth
              />
              <TextField
                label="Market"
                type="text"
                value={albumTracksMarket}
                onChange={(e) => setAlbumTracksMarket(e.target.value)}
                helperText="Market code (e.g., US, GB) - optional"
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAlbumTracksDialog}>Cancel</Button>
            <Button onClick={handleGetAlbumTracks} variant="contained" disabled={!token}>
              Fetch Album Tracks
            </Button>
          </DialogActions>
        </Dialog>

        {savedTracks && (
          <SavedTracksTable savedTracks={savedTracks} />
        )}

        {/* Recently Played Tracks Display */}
        {recentTracks && (
          <RecentlyPlayedTracksTable recentTracks={recentTracks} />
        )}

        {/* Current User Playlists Display */}
        {currentUserPlaylists && (
          <CurrentUserPlaylistsTable currentUserPlaylists={currentUserPlaylists} />
        )}

        {/* Album Tracks Display - Enhanced with full track data */}
        {albumTracks && (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-xl font-bold text-gray-100">
                Album Tracks ({albumTracks.total} total)
              </h3>
              <p className="text-sm text-gray-400">
                Showing {albumTracks.items.length} tracks (offset: {albumTracks.offset})
                {multipleTracks && <span> - Enhanced with popularity data</span>}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Track</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Play</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Track #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Disc #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Popularity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Explicit</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {albumTracks.items.map((track, index) => {
                    const fullTrack = multipleTracks?.tracks.find(t => t?.id === track.id);
                    return (
                      <tr key={track.id || index} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-100">{track.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <button className='bg-green-500 shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75
                              border border-solid border-gray-600 rounded-md px-2 text-gray-900 font-medium' onClick={() => handleChangeTrack(track.id)}>Play</button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {track.artists.map(artist => artist.name).join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {Math.floor(track.duration_ms / 60000)}:{((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {track.track_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {track.disc_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {fullTrack?.popularity !== undefined ? (
                            <span className="font-medium">{fullTrack.popularity}/100</span>
                          ) : (
                            <span className="text-gray-500">Loading...</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${track.explicit
                            ? 'bg-red-900 text-red-200'
                            : 'bg-green-900 text-green-200'
                            }`}>
                            {track.explicit ? 'Explicit' : 'Clean'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Sorted Album Tracks Display */}
        {sortedAlbumTracks && (
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden mt-6 border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-xl font-bold text-gray-100">
                Tracks Sorted by Popularity ({sortedAlbumTracks.tracks.filter(t => t !== null).length} tracks)
              </h3>
              <p className="text-sm text-gray-400">
                Ranked from most to least popular
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Track</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Play</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Artist</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Popularity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Explicit</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {sortedAlbumTracks.tracks
                    .filter(track => track !== null)
                    .map((track, index) => (
                      <tr key={track!.id || index} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-gray-100">#{index + 1}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-100">{track!.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className='bg-green-500 shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 border border-solid border-gray-600 rounded-md px-2 text-gray-900 font-medium'
                            onClick={() => handleChangeTrack(track!.id)}
                          >
                            Play
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {track!.artists.map(artist => artist.name).join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {Math.floor(track!.duration_ms / 60000)}:{((track!.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <span className="font-medium">{track!.popularity}/100</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${track!.explicit
                            ? 'bg-red-900 text-red-200'
                            : 'bg-green-900 text-green-200'
                            }`}>
                            {track!.explicit ? 'Explicit' : 'Clean'}
                          </span>
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
        {(tracksError || playerError || playlistsError || albumsError) && (
          <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mt-4">
            <p className="font-medium">Error:</p>
            <p>{tracksError || playerError || playlistsError || albumsError}</p>
          </div>
        )}
      </div>
      <Spotify link={`https://open.spotify.com/track/${playerLink}`} />
    </div>
  )
}

export default ApiPanel;