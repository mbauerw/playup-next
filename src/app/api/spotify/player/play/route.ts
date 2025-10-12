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
  const deviceId = searchParams.get('device_id');

  const body = await request.json();

  try {
    await spotifyPlayer.resumePlayback(
      session.spotifyAccessToken,
      {
        deviceId: deviceId || undefined,
        contextUri: body.contextUri,
        uris: body.uris,
        offset: body.offset,
        positionMs: body.positionMs,
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to resume playback:', error);
    return NextResponse.json(
      { error: 'Failed to resume playback' },
      { status: 500 }
    );
  }
}