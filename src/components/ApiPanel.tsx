'use client';

import { useCallback, useState, useEffect, MouseEvent } from 'react';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import { useSpotifyTracks } from '@/hooks/useSpotifyTracks';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import { useSpotifyPlaylists } from '@/hooks/useSpotifyPlaylists';
import { useSpotifyAlbums } from '@/hooks/useSpotifyAlbums';
import { useSpotifyArtists } from '@/hooks';
import { SpotifyTrack, RecentlyPlayedTracks, CurrentUserPlaylists, MultipleTracks } from '@/types';
import SavedTracksTable from './displays/SavedTracksTable';
import RecentlyPlayedTracksTable from './displays/RecentlyPlayedTracksTable';
import CurrentUserPlaylistsTable from './displays/CurrentUserPlaylistsTable';
import AlbumTracksTable from './displays/AlbumTracksTable';
import MultipleTracksTable from './displays/MultipleTracksTable';
import { Spotify } from 'react-spotify-embed';
import parseAlbumTracks, { getAlbumTrackIds, rankSongPopularity } from '@/lib/parsers/parseAlbumTracks';
import { getPlaylistArtists, getPlaylistTopArtists, getPlaylistTracks, rankPlaylistTracks } from '@/lib/parsers/parseSpotifyPlaylist';
import SpotifyPlayer from './SpotifyPlayer';

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
  // auth state - token is passed from parent now
  token: string | null;
  loading: boolean;
}

// Type definitions
type MenuAction = 'Profile' | 'My account' | 'Settings' | 'Edit' | 'Share' | 'Delete' | 'Logout';

interface MenuState {
  anchorEl: HTMLElement | null;
  open: boolean;
}


// COMPONENT START
const ApiPanel = ({
  token,
  loading
}: ApiPanelProps) => {
  const bringItHome = "https://open.spotify.com/track/1rxD34LAtkafrMUHqHIV76?si=57ae247bcacb49d4"

  // Get access to the auth system for token refresh if needed
  const { getAccessToken } = useSpotifyAuth();

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
    album,
    albumTracks,
    loading: albumsLoading,
    error: albumsError,
    fetchAlbum,
    fetchAlbumTracks,
    clearData: clearAlbumsData,
  } = useSpotifyAlbums();

  // artist hooks
  const { artist,
    artists,
    artistAlbums,
    artistTopTracks,
    loading: artistLoading,
    error: artistError,
    fetchArtist,
    fetchSeveralArtists,
    fetchArtistAlbums,
    fetchArtistTopTracks,
    clearData: clearArtistData,
  } = useSpotifyArtists();

  const [trackId, setTrackId] = useState('1rxD34LAtkafrMUHqHIV76');
  const [market, setMarket] = useState('US');

  // saved tracks parameters
  const [savedTracksLimit, setSavedTracksLimit] = useState(5);
  const [savedTracksOffset, setSavedTracksOffset] = useState(0);
  const [savedTracksDialogOpen, setSavedTracksDialogOpen] = useState(false);

  // recently played tracks params
  const [recentTracksLimit, setRecentTracksLimit] = useState(10);
  const [recentTracksAfter, setRecentTracksAfter] = useState<string>('');
  const [recentTracksBefore, setRecentTracksBefore] = useState<string>('');
  const [recentTracksDialogOpen, setRecentTracksDialogOpen] = useState(false);

  // current user playlists params
  const [playlistsLimit, setPlaylistsLimit] = useState(50);
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

  // NEW: Single track params
  const [singleTrackId, setSingleTrackId] = useState('1rxD34LAtkafrMUHqHIV76');
  const [singleTrackMarket, setSingleTrackMarket] = useState('US');
  const [singleTrackDialogOpen, setSingleTrackDialogOpen] = useState(false);

  // NEW: Several tracks params
  const [severalTrackIds, setSeveralTrackIds] = useState('1rxD34LAtkafrMUHqHIV76,3n3Ppam7vgaVa1iaRUc9Lp');
  const [severalTracksMarket, setSeveralTracksMarket] = useState('US');
  const [severalTracksDialogOpen, setSeveralTracksDialogOpen] = useState(false);

  // NEW: Artist albums params
  const [artistAlbumsId, setArtistAlbumsId] = useState('0LcJLqbBmaGUft1e9Mm8HV'); // ABBA
  const [artistAlbumsIncludeGroups, setArtistAlbumsIncludeGroups] = useState('album,single');
  const [artistAlbumsMarket, setArtistAlbumsMarket] = useState('US');
  const [artistAlbumsLimit, setArtistAlbumsLimit] = useState(20);
  const [artistAlbumsOffset, setArtistAlbumsOffset] = useState(0);
  const [artistAlbumsDialogOpen, setArtistAlbumsDialogOpen] = useState(false);

  // spotify widget player params
  const [playerLink, setPlayerLink] = useState("5ihDGnhQgMA0F0tk9fNLlA")

  // menu anchors
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open: boolean = Boolean(anchorEl);

  // Artist top tracks params
  const [artistTopTracksId, setArtistTopTracksId] = useState('4V8LLVI7PbaPR0K2TGSxFF'); // ABBA
  const [artistTopTracksMarket, setArtistTopTracksMarket] = useState('US');
  const [artistTopTracksDialogOpen, setArtistTopTracksDialogOpen] = useState(false);

  // artists
  const tyler = "4V8LLVI7PbaPR0K2TGSxFF"

  // Helper function to get fresh token if needed
  const getFreshToken = useCallback(async (): Promise<string> => {
    if (!token) {
      const freshToken = await getAccessToken();
      return freshToken;
    }
    return token;
  }, [token, getAccessToken]);

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
  const handleFetchSingleTrack = async () => {
    try {
      fetchTrack(trackId, market || undefined);
    } catch (error) {
      console.error('Failed to get token for track fetch:', error);
    }
  };

  // NEW: Single track dialog handlers
  const handleOpenSingleTrackDialog = () => {
    handleClose();
    setSingleTrackDialogOpen(true);
  };

  const handleCloseSingleTrackDialog = () => {
    setSingleTrackDialogOpen(false);
  };

  const handleGetSingleTrack = async () => {
    try {
      
      await fetchTrack(singleTrackId, singleTrackMarket || undefined);
      setSingleTrackDialogOpen(false);
    } catch (error) {
      console.error('Failed to fetch single track:', error);
    }
  };

  // NEW: Several tracks dialog handlers
  const handleOpenSeveralTracksDialog = () => {
    handleClose();
    setSeveralTracksDialogOpen(true);
  };

  const handleCloseSeveralTracksDialog = () => {
    setSeveralTracksDialogOpen(false);
  };

  const handleGetSeveralTracks = async () => {
    try {
      const trackIdsArray = severalTrackIds.split(',').map(id => id.trim()).filter(id => id.length > 0);
      await fetchSeveralTracks(trackIdsArray, severalTracksMarket || undefined);
      setSeveralTracksDialogOpen(false);
    } catch (error) {
      console.error('Failed to fetch several tracks:', error);
    }
  };

  // Artist albums dialog handlers
  const handleOpenArtistAlbumsDialog = () => {
    handleClose();
    setArtistAlbumsDialogOpen(true);
  };

  const handleCloseArtistAlbumsDialog = () => {
    setArtistAlbumsDialogOpen(false);
  };

  const handleGetArtistAlbums = async () => {
    try {
      await fetchArtistAlbums(artistAlbumsId, {
        include_groups: artistAlbumsIncludeGroups || undefined,
        market: artistAlbumsMarket || undefined,
        limit: artistAlbumsLimit,
        offset: artistAlbumsOffset
      });
      setArtistAlbumsDialogOpen(false);
    } catch (error) {
      console.error('Failed to fetch artist albums:', error);
    }
  };

  const handleOpenSavedTracksDialog = () => {
    handleClose(); // Close the menu first
    setSavedTracksDialogOpen(true);
  };

  const handleCloseSavedTracksDialog = () => {
    setSavedTracksDialogOpen(false);
  };

  const handleGetSavedTracks = async () => {
    try {
      fetchSavedTracks( {
        limit: savedTracksLimit,
        offset: savedTracksOffset
      });
      setSavedTracksDialogOpen(false);
    } catch (error) {
      console.error('Failed to get token for saved tracks:', error);
    }
  };

  // Recently played tracks handlers
  const handleOpenRecentTracksDialog = () => {
    handleClose(); // Close the menu first
    setRecentTracksDialogOpen(true);
  };

  const handleCloseRecentTracksDialog = () => {
    setRecentTracksDialogOpen(false);
  };

  const handleGetRecentTracks = async () => {
    try {

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

      fetchRecentlyPlayed(options);
      setRecentTracksDialogOpen(false);
    } catch (error) {
      console.error('Failed to get token for recent tracks:', error);
    }
  };

  // Current user playlists handlers
  const handleOpenPlaylistsDialog = () => {
    handleClose(); // Close the menu first
    setPlaylistsDialogOpen(true);
  };

  const handleClosePlaylistsDialog = () => {
    setPlaylistsDialogOpen(false);
  };

  const handleGetCurrentUserPlaylists = async () => {
    try {
      
      fetchCurrentUserPlaylists({
        limit: playlistsLimit,
        offset: playlistsOffset
      });
      setPlaylistsDialogOpen(false);
    } catch (error) {
      console.error('Failed to get token for playlists:', error);
    }
  };

  const handleFetchArtistTopTracks = async (artistId: string, market?: string): Promise<MultipleTracks | null> => {
    try {
      
      await fetchArtistTopTracks(artistId, market);
      return artistTopTracks;
    }
    catch (error) {
      console.error('Could not get the top trackies: ', error);
      return null;
    }
  }

  // album handlers
  const handleOpenAlbumTracksDialog = () => {
    handleClose(); // Close the menu first
    setAlbumTracksDialogOpen(true);
  };

  const handleCloseAlbumTracksDialog = () => {
    setAlbumTracksDialogOpen(false);
  };

  const handleGetAlbum = async (customAlbumId?: string, market?: string ) => {
    try {
      

      const idToUse = customAlbumId || albumId

      await fetchAlbum(idToUse, market);

    } catch (error) {
      console.error('Failed to fetch album tracks:', error);
    }

    setAlbumTracksDialogOpen(false);
  };

  const handleChangeTrack = (track: string) => {
    const cleanTrack = track.split('?')[0].trim();
    setPlayerLink(cleanTrack);
  }

  // Artist top tracks dialog handlers
  const handleOpenArtistTopTracksDialog = () => {
    handleClose();
    setArtistTopTracksDialogOpen(true);
  };

  const handleCloseArtistTopTracksDialog = () => {
    setArtistTopTracksDialogOpen(false);
  };

  const handleGetArtistTopTracks = async () => {
    try {
      
      console.log("Aritst Top Track ID: " + artistTopTracksId);
      console.log("Hurmph")
      await fetchArtistTopTracks(
        artistTopTracksId,
        artistTopTracksMarket || undefined
      );
      setArtistTopTracksDialogOpen(false);
    } catch (error) {
      console.error('Failed to fetch artist top tracks:', error);
    }
  };

  const onClearAll = () => {
    clearPlayerData();
    clearPlaylistsData();
    clearAlbumsData();
    clearTracksData();
    clearArtistData();
  }

  useEffect(() => {
    const fetchSeveralTracksWithToken = async () => {
      if (albumTracks && albumTracks.items.length > 0) {
        try {
          
          const trackIds = getAlbumTrackIds(albumTracks);

          if (trackIds.length > 0) {
            fetchSeveralTracks(trackIds, albumTracksMarket || undefined);
          }
        } catch (error) {
          console.error('Failed to fetch several tracks:', error);
        }
      }
    };

    fetchSeveralTracksWithToken();
  }, [albumTracks, getFreshToken, fetchSeveralTracks, albumTracksMarket]);

  useEffect(() => {
    if (multipleTracks) {
      const sortedTracks = rankSongPopularity(multipleTracks);
      setSortedAlbumTracks(sortedTracks);
    }
  }, [multipleTracks, fetchCurrentUserPlaylists])

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
          <MenuItem onClick={handleOpenSingleTrackDialog}>
            Fetch Single Track
          </MenuItem>
          <MenuItem onClick={handleOpenSeveralTracksDialog}>
            Fetch Several Tracks
          </MenuItem>
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
          <MenuItem onClick={handleOpenArtistAlbumsDialog}>
            Fetch Artist Albums
          </MenuItem>
          <MenuItem onClick={handleOpenArtistTopTracksDialog}>
            Fetch Artist Top Tracks
          </MenuItem>
        </Menu>

        {/* NEW: Single Track Dialog */}
        <Dialog open={singleTrackDialogOpen} onClose={handleCloseSingleTrackDialog}>
          <DialogTitle>Fetch Single Track</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Track ID"
                type="text"
                value={singleTrackId}
                onChange={(e) => setSingleTrackId(e.target.value)}
                helperText="Spotify track ID"
                fullWidth
              />
              <TextField
                label="Market"
                type="text"
                value={singleTrackMarket}
                onChange={(e) => setSingleTrackMarket(e.target.value)}
                helperText="Market code (e.g., US, GB) - optional"
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSingleTrackDialog}>Cancel</Button>
            <Button onClick={handleGetSingleTrack} variant="contained" disabled={!token}>
              Fetch Track
            </Button>
          </DialogActions>
        </Dialog>

        {/* NEW: Several Tracks Dialog */}
        <Dialog open={severalTracksDialogOpen} onClose={handleCloseSeveralTracksDialog}>
          <DialogTitle>Fetch Several Tracks</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Track IDs"
                type="text"
                value={severalTrackIds}
                onChange={(e) => setSeveralTrackIds(e.target.value)}
                helperText="Comma-separated Spotify track IDs (e.g., id1,id2,id3)"
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                label="Market"
                type="text"
                value={severalTracksMarket}
                onChange={(e) => setSeveralTracksMarket(e.target.value)}
                helperText="Market code (e.g., US, GB) - optional"
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSeveralTracksDialog}>Cancel</Button>
            <Button onClick={handleGetSeveralTracks} variant="contained" disabled={!token}>
              Fetch Tracks
            </Button>
          </DialogActions>
        </Dialog>

        {/* NEW: Artist Albums Dialog */}
        <Dialog open={artistAlbumsDialogOpen} onClose={handleCloseArtistAlbumsDialog}>
          <DialogTitle>Fetch Artist Albums</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Artist ID"
                type="text"
                value={artistAlbumsId}
                onChange={(e) => setArtistAlbumsId(e.target.value)}
                helperText="Spotify artist ID"
                fullWidth
              />
              <TextField
                label="Include Groups"
                type="text"
                value={artistAlbumsIncludeGroups}
                onChange={(e) => setArtistAlbumsIncludeGroups(e.target.value)}
                helperText="Comma-separated: album, single, appears_on, compilation"
                fullWidth
              />
              <TextField
                label="Market"
                type="text"
                value={artistAlbumsMarket}
                onChange={(e) => setArtistAlbumsMarket(e.target.value)}
                helperText="Market code (e.g., US, GB) - optional"
                fullWidth
              />
              <TextField
                label="Limit"
                type="number"
                value={artistAlbumsLimit}
                onChange={(e) => setArtistAlbumsLimit(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                helperText="Number of albums to fetch (1-50)"
                inputProps={{ min: 1, max: 50 }}
                fullWidth
              />
              <TextField
                label="Offset"
                type="number"
                value={artistAlbumsOffset}
                onChange={(e) => setArtistAlbumsOffset(Math.max(0, parseInt(e.target.value) || 0))}
                helperText="Starting position (0 = first album)"
                inputProps={{ min: 0 }}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseArtistAlbumsDialog}>Cancel</Button>
            <Button onClick={handleGetArtistAlbums} variant="contained" disabled={!token}>
              Fetch Albums
            </Button>
          </DialogActions>
        </Dialog>

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
            <Button onClick={() =>handleGetAlbum} variant="contained" disabled={!token}>
              Fetch Album Tracks
            </Button>
          </DialogActions>
        </Dialog>

        {/* Artist Top Tracks Dialog */}
        <Dialog open={artistTopTracksDialogOpen} onClose={handleCloseArtistTopTracksDialog}>
          <DialogTitle>Fetch Artist Top Tracks</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Artist ID"
                type="text"
                value={artistTopTracksId}
                onChange={(e) => setArtistTopTracksId(e.target.value)}
                helperText="Spotify artist ID"
                fullWidth
              />
              <TextField
                label="Market"
                type="text"
                value={artistTopTracksMarket}
                onChange={(e) => setArtistTopTracksMarket(e.target.value)}
                helperText="Market code (e.g., US, GB)"
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseArtistTopTracksDialog}>Cancel</Button>
            <Button onClick={handleGetArtistTopTracks} variant="contained" disabled={!token}>
              Fetch Top Tracks
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
          <CurrentUserPlaylistsTable
            currentUserPlaylists={currentUserPlaylists}
            handleChangeTrack={handleChangeTrack}
            handleFetchArtistTopTracks={handleFetchArtistTopTracks} />
        )}

        {/* Album Tracks Display - Enhanced with full track data */}
        {album && (
          <AlbumTracksTable album={album} handleChangeTrack={handleChangeTrack} />
        )}

        {/* Sorted Album Tracks Display */}
        {sortedAlbumTracks && (
          <MultipleTracksTable tracks={sortedAlbumTracks} title="Sorted Album Tracks" handleChangeTrack={handleChangeTrack} />
        )}

        {artistTopTracks && (
          <MultipleTracksTable tracks={artistTopTracks} title="Artist Top Tracks" handleChangeTrack={handleChangeTrack} />
        )}


        <button
          onClick={onClearAll}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear All Data
        </button>

        {/* Display any errors */}
        {(tracksError || playerError || playlistsError || albumsError || artistError) && (
          <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mt-4">
            <p className="font-medium">Error:</p>
            <p>{tracksError || playerError || playlistsError || albumsError || artistError}</p>
          </div>
        )}
      </div>
      {/* <Spotify link={`https://open.spotify.com/track/${playerLink}`} /> */}
      <SpotifyPlayer trackId={playerLink} width="50%" height={260} />
    </div>
  )
}

export default ApiPanel;