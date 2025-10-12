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
  const market = searchParams.get('market');

  const { id } = await params;

  try {
    const topTracks = await spotifyArtists.getArtistTopTracks(
      session.spotifyAccessToken,
      id,
      market || undefined
    );

    return NextResponse.json(topTracks);
  } catch (error) {
    console.error('Failed to fetch artist top tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artist top tracks' },
      { status: 500 }
    );
  }
}