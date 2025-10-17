import { useState, useCallback } from 'react';
import { spotifyArtists } from '@/services/spotify-api/artists';
import type { SpotifyArtist, ArtistAlbums, MultipleTracks } from '@/types';
import { useSpotifyContext } from '@/contexts/SpotifyContext';

/*
funcs
1. feed a playlist, get a playlist
2. Create blank playlist
3. Populate playlist with new tracks
4. Separate hook for getting recommendations

*/