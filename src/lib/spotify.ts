import { prisma } from '@/lib/prisma'

export async function refreshSpotifyToken(userId: string) {
  /* 
    retrieve user model
    see if refresh token
    */
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { spotifyRefreshToken: true }
  })

  if (!user?.spotifyRefreshToken) {
    throw new Error('No refresh token available')
  }

  console.log("Got Prisma User");
  console.log("User refresh token exists:", !!user.spotifyRefreshToken);

  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    throw new Error('Missing Spotify client credentials in environment variables');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: user.spotifyRefreshToken,
    })
  })

  console.log("Token refresh response status:", response.status);

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Token refresh failed:", errorData);
    throw new Error(`Failed to refresh Spotify token: ${response.status} ${response.statusText}`);
  }

  const tokens = await response.json();
  console.log("New tokens received:", { 
    hasAccessToken: !!tokens.access_token, 
    hasRefreshToken: !!tokens.refresh_token,
    expiresIn: tokens.expires_in 
  });

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  // Update the user with new tokens
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      spotifyAccessToken: tokens.access_token,
      spotifyRefreshToken: tokens.refresh_token || user.spotifyRefreshToken,
      spotifyTokenExpiry: expiresAt
    }
  })

  console.log("Updated user tokens in database");

  return { 
    accessToken: tokens.access_token, 
    expiresAt 
  }
}