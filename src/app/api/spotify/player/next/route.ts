import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { spotifyPlayer } from '@/services/spotify/player';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.spotifyAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get('device_id');

  try {
    await spotifyPlayer.skipToNext(
      session.spotifyAccessToken,
      deviceId || undefined
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to skip to next:', error);
    return NextResponse.json(
      { error: 'Failed to skip to next' },
      { status: 500 }
    );
  }
}