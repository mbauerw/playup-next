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
  const volumePercent = searchParams.get('volume_percent');
  const deviceId = searchParams.get('device_id');

  if (!volumePercent) {
    return NextResponse.json(
      { error: 'volume_percent required' },
      { status: 400 }
    );
  }

  try {
    await spotifyPlayer.setVolume(
      session.spotifyAccessToken,
      Number(volumePercent),
      deviceId || undefined
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to set volume:', error);
    return NextResponse.json(
      { error: 'Failed to set volume' },
      { status: 500 }
    );
  }
}