import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SpotifyTrack, MultipleTracks, SpotifyArtist } from '@/types';
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  
    const { tracks } : MultipleTracks  = await request.json();

    const uniqueArtists = new Map();

    for (const track of tracks) {
      if (!track?.artists?.[0]) continue;

      console.log("The Source artist is:" + JSON.stringify(track.artists[0]));
      const artist = track.artists[0];
      if (!uniqueArtists.has(artist.id)) {
        uniqueArtists.set(artist.id, {
          spotifyId: artist.id,
          name: artist.name,
          popularity: artist.popularity,
          genres: artist.genres,
          imageUrl: artist.images?.[0]?.url, 
          followerCount: artist.followers?.total,
          spotifyUrl: artist.href
        });
      }
    }

    const result = await prisma.artist.createMany({
      data: Array.from(uniqueArtists.values()),
      skipDuplicates: true,
    });

    console.log("Artists were added successfully");

    return NextResponse.json({ 
      success: true, 
      count: result.count 
    });

  } catch (error) {
    console.error('Error saving artists:', error);
    return NextResponse.json(
      { error: 'Failed to save artists' },
      { status: 500 }
    );
  }

}