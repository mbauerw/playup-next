import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyUsers } from '@/services/spotify/users';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const after = searchParams.get('after');
  const limit = searchParams.get('limit');

  try {
    const followedArtists = await spotifyUsers.getFollowedArtists(
      session.spotifyAccessToken,
      {
        type: type || undefined,
        after: after || undefined,
        limit: limit ? Number(limit) : undefined,
      }
    );

    return NextResponse.json(followedArtists);
  } catch (error) {
    console.error('Failed to fetch followed artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch followed artists' },
      { status: 500 }
    );
  }
}