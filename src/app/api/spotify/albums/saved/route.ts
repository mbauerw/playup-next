// app/api/spotify/albums/saved/route.ts
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
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');
  const market = searchParams.get('market');

  try {
    const albums = await spotifyAlbums.getSavedAlbums(
      session.spotifyAccessToken,
      {
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        market: market || undefined,
      }
    );

    return NextResponse.json(albums);
  } catch (error) {
    console.error('Failed to fetch saved albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved albums' },
      { status: 500 }
    );
  }
}