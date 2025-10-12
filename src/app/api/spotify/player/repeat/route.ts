import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyPlayer } from '@/services/spotify/player';

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const deviceId = searchParams.get('device_id');

  if (!state || !['track', 'context', 'off'].includes(state)) {
    return NextResponse.json(
      { error: 'state must be track, context, or off' },
      { status: 400 }
    );
  }

  try {
    await spotifyPlayer.setRepeatMode(
      session.spotifyAccessToken,
      state as 'track' | 'context' | 'off',
      deviceId || undefined
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to set repeat mode:', error);
    return NextResponse.json(
      { error: 'Failed to set repeat mode' },
      { status: 500 }
    );
  }
}