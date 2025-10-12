import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyUsers } from '@/services/spotify/users';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const time_range = searchParams.get('time_range');
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');

  const { type } = await params;

  if (type !== 'artists' && type !== 'tracks') {
    return NextResponse.json(
      { error: 'type must be artists or tracks' },
      { status: 400 }
    );
  }

  try {
    const topItems = await spotifyUsers.getTopItems(
      session.spotifyAccessToken,
      type,
      {
        time_range: time_range as 'short_term' | 'medium_term' | 'long_term' | undefined,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      }
    );

    return NextResponse.json(topItems);
  } catch (error) {
    console.error('Failed to fetch top items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top items' },
      { status: 500 }
    );
  }
}