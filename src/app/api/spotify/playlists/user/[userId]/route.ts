import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyPlaylists } from '@/services/spotify/playlists';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');

  const { userId } = await params;

  try {
    const playlists = await spotifyPlaylists.getUserPlaylists(
      session.spotifyAccessToken,
      userId,
      {
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      }
    );

    return NextResponse.json(playlists);
  } catch (error) {
    console.error('Failed to fetch user playlists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user playlists' },
      { status: 500 }
    );
  }
}