import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyPlaylists } from '@/services/spotify/playlists';

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
  const fields = searchParams.get('fields');
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');
  const additional_types = searchParams.get('additional_types');

  const { id } = await params;

  try {
    const items = await spotifyPlaylists.getPlaylistItems(
      session.spotifyAccessToken,
      id,
      {
        market: market || undefined,
        fields: fields || undefined,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        additional_types: additional_types || undefined,
      }
    );

    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch playlist items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlist items' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  if (!body.uris || !Array.isArray(body.uris)) {
    return NextResponse.json(
      { error: 'uris array required' },
      { status: 400 }
    );
  }

  try {
    const result = await spotifyPlaylists.addItemsToPlaylist(
      session.spotifyAccessToken,
      id,
      body.uris
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to add items to playlist:', error);
    return NextResponse.json(
      { error: 'Failed to add items to playlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const result = await spotifyPlaylists.removeItemsFromPlaylist(
      session.spotifyAccessToken,
      id,
      body
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to remove items from playlist:', error);
    return NextResponse.json(
      { error: 'Failed to remove items from playlist' },
      { status: 500 }
    );
  }
}