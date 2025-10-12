import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyArtists } from '@/services/spotify/artists';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids');

  if (!ids) {
    return NextResponse.json({ error: 'Artist IDs required' }, { status: 400 });
  }

  try {
    const artists = await spotifyArtists.getSeveralArtists(
      session.spotifyAccessToken,
      ids
    );

    return NextResponse.json(artists);
  } catch (error) {
    console.error('Failed to fetch artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}