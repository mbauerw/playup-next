// app/api/spotify/albums/[id]/tracks/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyAlbums } from '@/services/spotify/albums';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const market = searchParams.get('market');
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');

  try {
    const tracks = await spotifyAlbums.getAlbumTracks(
      session.spotifyAccessToken,
      params.id,
      {
        market: market || undefined,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      }
    );

    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Failed to fetch album tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch album tracks' },
      { status: 500 }
    );
  }
}