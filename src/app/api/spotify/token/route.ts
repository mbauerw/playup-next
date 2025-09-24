import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { refreshSpotifyToken } from '@/lib/spotify';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        spotifyAccessToken: true,
        spotifyRefreshToken: true,
        spotifyTokenExpiry: true
      }
    });

    if (!user?.spotifyRefreshToken) {
      return NextResponse.json(
        { error: 'No Spotify account linked' }, 
        { status: 400 }
      );
    }

    // Check if current token is still valid
    if (user.spotifyAccessToken && user.spotifyTokenExpiry && user.spotifyTokenExpiry > new Date()) {
      return NextResponse.json({
        access_token: user.spotifyAccessToken,
        expires_at: user.spotifyTokenExpiry
      });
    }

    // Refresh the token
    const {accessToken, expiresAt} = await refreshSpotifyToken(session.user.id);

    return NextResponse.json({
      access_token: accessToken,
      expires_at: expiresAt
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}