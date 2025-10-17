import { MultipleTracks, SpotifyArtist } from '@/types';

export async function saveArtistsFromTracks(tracks: MultipleTracks) {
  const response = await fetch('/api/db/artists/from-tracks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tracks),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to save artists');
  }

  return response.json();
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