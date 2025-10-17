import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyPlayer } from '@/services/spotify-api/player';

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const deviceId = searchParams.get('device_id');

  if (state === null) {
    return NextResponse.json(
      { error: 'state required' },
      { status: 400 }
    );
  }

  try {
    await spotifyPlayer.toggleShuffle(
      session.spotifyAccessToken,
      state === 'true',
      deviceId || undefined
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to toggle shuffle:', error);
    return NextResponse.json(
      { error: 'Failed to toggle shuffle' },
      { status: 500 }
    );
  }
}