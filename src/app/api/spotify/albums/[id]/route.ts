import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyAlbums } from '@/services/spotify-api/albums';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // ← Promise type
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const market = searchParams.get('market');

  const { id } = await params;  // ← Await params first

  try {
    const album = await spotifyAlbums.getAlbum(
      session.spotifyAccessToken,
      id,  // ← Now use the awaited id
      market || undefined
    );

    return NextResponse.json(album);
  } catch (error) {
    console.error('Failed to fetch album:', error);
    return NextResponse.json(
      { error: 'Failed to fetch album' },
      { status: 500 }
    );
  }
}