// src/app/api/spotify/token/route.ts
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { refreshSpotifyToken } from '@/lib/spotify';
import { authOptions } from '@/lib/auth'; // Import your auth config

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("Token route - session exists:", !!session);
    console.log("Token route - user ID:", session?.user?.id);
    
    if (!session?.user?.id) {
      console.log("Token route - No session or user ID");
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        spotifyAccessToken: true,
        spotifyRefreshToken: true,
        spotifyTokenExpiry: true
      }
    });

    console.log("Token route - user found:", !!user);
    console.log("Token route - has refresh token:", !!user?.spotifyRefreshToken);
    console.log("Token route - current token expiry:", user?.spotifyTokenExpiry);

    if (!user?.spotifyRefreshToken) {
      console.log("Token route - No refresh token found");
      return NextResponse.json(
        { error: 'No Spotify account linked - missing refresh token' }, 
        { status: 400 }
      );
    }

    // Check if current token is still valid (with 5-minute buffer)
    const now = new Date();
    const bufferTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
    
    if (user.spotifyAccessToken && 
        user.spotifyTokenExpiry && 
        user.spotifyTokenExpiry > bufferTime) {
      console.log("Token route - returning existing valid token");
      return NextResponse.json({
        access_token: user.spotifyAccessToken,
        expires_at: user.spotifyTokenExpiry
      });
    }

    // Refresh the token
    console.log("Token route - refreshing token");
    const { accessToken, expiresAt } = await refreshSpotifyToken(session.user.id);
    
    console.log("Token route - token refreshed successfully");

    return NextResponse.json({
      access_token: accessToken,
      expires_at: expiresAt
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    
    // Provide more specific error information
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Failed to refresh token',
          details: error.message,
          // Don't expose sensitive info in production
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Unknown error occurred while refreshing token' },
      { status: 500 }
    );
  }
}