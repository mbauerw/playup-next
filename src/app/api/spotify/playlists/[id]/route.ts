// app/api/spotify/playlists/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyPlaylists } from '@/services/spotify-api/playlists';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const playlist = await spotifyPlaylists.getPlaylist(
      session.spotifyAccessToken,
      id
    );

    return NextResponse.json(playlist);
  } catch (error) {
    console.error('Failed to fetch playlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlist' },
      { status: 500 }
    );
  }
}