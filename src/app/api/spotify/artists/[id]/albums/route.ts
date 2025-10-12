import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyArtists } from '@/services/spotify/artists';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const include_groups = searchParams.get('include_groups');
  const market = searchParams.get('market');
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');

  const { id } = await params;

  try {
    const albums = await spotifyArtists.getArtistAlbums(
      session.spotifyAccessToken,
      id,
      {
        include_groups: include_groups || undefined,
        market: market || undefined,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      }
    );

    return NextResponse.json(albums);
  } catch (error) {
    console.error('Failed to fetch artist albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist albums' },
      { status: 500 }
    );
  }
}