import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyPlayer } from '@/services/spotify/player';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const after = searchParams.get('after');
  const before = searchParams.get('before');

  try {
    const tracks = await spotifyPlayer.getRecentlyPlayed(
      session.spotifyAccessToken,
      {
        limit: limit ? Number(limit) : undefined,
        after: after ? Number(after) : undefined,
        before: before ? Number(before) : undefined,
      }
    );

    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Failed to get recently played:', error);
    return NextResponse.json(
      { error: 'Failed to get recently played' },
      { status: 500 }
    );
  }
}