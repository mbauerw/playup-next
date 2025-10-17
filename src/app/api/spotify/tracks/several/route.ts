import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyTracks } from '@/services/spotify-api/tracks';

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
    const tracks = await spotifyTracks.getSeveralTracks(
      session.spotifyAccessToken,
      ids.split(','),
      market || undefined
    );

    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Failed to fetch tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}