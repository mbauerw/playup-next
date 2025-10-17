import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyPlayer } from '@/services/spotify-api/player';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get('device_id');

  try {
    await spotifyPlayer.skipToPrevious(
      session.spotifyAccessToken,
      deviceId || undefined
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to skip to previous:', error);
    return NextResponse.json(
      { error: 'Failed to skip to previous' },
      { status: 500 }
    );
  }
}