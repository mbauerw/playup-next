import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyTracks } from '@/services/spotify/tracks';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids');
  const market = searchParams.get('market');

  if (!ids) {
    return NextResponse.json({ error: 'Track IDs required' }, { status: 400 });
  }

  try {
    const status = await spotifyTracks.checkUsersSavedTracks(
      session.spotifyAccessToken,
      ids.split(','),
      market || undefined
    );

    return NextResponse.json(status);
  } catch (error) {
    console.error('Failed to check saved status:', error);
    return NextResponse.json(
      { error: 'Failed to check saved status' },
      { status: 500 }
    );
  }
}