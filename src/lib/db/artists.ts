import { MultipleTracks, SpotifyArtist } from '@/types';
import { artistsAPI } from '@/services/api/artists';

async function fetchFullArtistDetails(artistIds: string[]): Promise<SpotifyArtist[]> {
  // Spotify API allows up to 50 artists per request
  const BATCH_SIZE = 50;
  const batches: string[][] = [];
  
  for (let i = 0; i < artistIds.length; i += BATCH_SIZE) {
    batches.push(artistIds.slice(i, i + BATCH_SIZE));
  }

  const allArtists: SpotifyArtist[] = [];

  for (const batch of batches) {
    try {
      const data = await artistsAPI.getSeveralArtists(batch);
      allArtists.push(...data);
    } catch (error) {
      console.error(`Failed to fetch batch of ${batch.length} artists:`, error);
    }
  }

  return allArtists;
}

export async function saveArtistsFromTracks(tracks: MultipleTracks) {
  try {
    const uniqueArtistIds = new Set<string>();
    
    for (const track of tracks.tracks) {
      track.artists?.forEach(artist => {
        uniqueArtistIds.add(artist.id);
      });
    }

    const fullArtists = await fetchFullArtistDetails(Array.from(uniqueArtistIds));

    if (fullArtists.length === 0) {
      throw new Error('No artists found to save');
    }

    const response = await fetch('/api/artists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ artists: fullArtists }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save artists');
    }

    return response.json();
  } catch (error) {
    console.error('Error saving artists from tracks:', error);
    throw error;
  }
}

export async function addArtists(artists: SpotifyArtist[]) {
  const response = await fetch('/api/artists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ artists }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add artists');
  }

  return response.json();
}

export async function getArtists(params: {
  id?: string;
  spotifyId?: string;
  name?: string;
  genre?: string;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(`/api/artists?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch artists');
  }

  return response.json();
}

export async function deleteArtists(spotifyIds: string[]) {
  const response = await fetch('/api/artists', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ spotifyIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete artists');
  }

  return response.json();
}