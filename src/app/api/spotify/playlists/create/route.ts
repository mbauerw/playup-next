// app/api/spotify/playlists/create/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyPlaylists } from '@/services/spotify-api/playlists';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  if (!body.userId || !body.name) {
    return NextResponse.json(
      { error: 'userId and name required' },
      { status: 400 }
    );
  }

  const { userId, ...playlistData } = body;

  try {
    const playlist = await spotifyPlaylists.createPlaylist(
      session.spotifyAccessToken,
      userId,
      playlistData
    );

    return NextResponse.json(playlist);
  } catch (error) {
    console.error('Failed to create playlist:', error);
    return NextResponse.json(
      { error: 'Failed to create playlist' },
      { status: 500 }
    );
  }
}