// app/api/spotify/albums/several/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyAlbums } from '@/services/spotify-api/albums';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids');
  const market = searchParams.get('market');

  if (!ids) {
    return NextResponse.json({ error: 'Album IDs required' }, { status: 400 });
  }

  try {
    const albums = await spotifyAlbums.getAlbums(
      session.spotifyAccessToken,
      ids.split(','),
      market || undefined
    );

    return NextResponse.json(albums);
  } catch (error) {
    console.error('Failed to fetch albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
      { status: 500 }
    );
  }
}