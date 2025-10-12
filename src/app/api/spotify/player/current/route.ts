import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyPlayer } from '@/services/spotify/player';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const market = searchParams.get('market');

  try {
    const playback = await spotifyPlayer.getCurrentPlayback(
      session.spotifyAccessToken,
      market || undefined
    );

    return NextResponse.json(playback);
  } catch (error) {
    console.error('Failed to get current playback:', error);
    return NextResponse.json(
      { error: 'Failed to get current playback' },
      { status: 500 }
    );
  }
}