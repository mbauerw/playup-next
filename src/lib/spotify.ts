import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function refreshSpotifyToken(userId: string) {
  /* 
  retrieve user model
  see if 
  */

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { spotifyRefreshToken: true }
  })

  if (!user?.spotifyRefreshToken) {
    throw new Error('No refresh token available')
  }
  console.log("Got Prisma User");
  console.log("User: " + user.spotifyRefreshToken);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: user.spotifyRefreshToken,

    })
  })

  const tokens = await response.json();
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  await prisma.user.update({
    where: {id: userId},
    data: {
      spotifyAccessToken: tokens.access_token,
      spotifyRefreshToken: tokens.refresh_token || user.spotifyRefreshToken,
      spotifyTokenExpiry: expiresAt
    }
  })

  return {accessToken: tokens.access_token, expiresAt}
}