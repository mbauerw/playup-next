// app/api/spotify/search/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifySearch } from '@/services/spotify/search';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type');
  const market = searchParams.get('market');
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');
  const include_external = searchParams.get('include_external');

  if (!query || !type) {
    return NextResponse.json(
      { error: 'query (q) and type parameters required' },
      { status: 400 }
    );
  }

  try {
    const results = await spotifySearch.search(
      session.spotifyAccessToken,
      query,
      type,
      {
        market: market || undefined,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        include_external: include_external === 'audio' ? 'audio' : undefined,
      }
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to perform search:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}