import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SpotifyArtist } from '@/types';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  
    const { artists }: { artists: SpotifyArtist[] } = await request.json();

    if (!artists || !Array.isArray(artists) || artists.length === 0) {
      return NextResponse.json(
        { error: 'Invalid artists data' },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      artists.map(artist =>
        prisma.artist.upsert({
          where: { spotifyId: artist.id },
          update: {
            name: artist.name,
            popularity: artist.popularity,
            genres: artist.genres || [],
            imageUrl: artist.images?.[0]?.url,
            followerCount: artist.followers?.total,
            spotifyUrl: artist.href,
          },
          create: {
            spotifyId: artist.id,
            name: artist.name,
            popularity: artist.popularity,
            genres: artist.genres || [],
            imageUrl: artist.images?.[0]?.url,
            followerCount: artist.followers?.total,
            spotifyUrl: artist.href,
          },
        })
      )
    );

    return NextResponse.json({ 
      success: true, 
      count: results.length,
      artists: results
    });

  } catch (error) {
    console.error('Error saving artists:', error);
    return NextResponse.json(
      { error: 'Failed to save artists' },
      { status: 500 }
    );
  }
}

// GET - Get artists based on criteria
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    const id = searchParams.get('id');
    const spotifyId = searchParams.get('spotifyId');
    const name = searchParams.get('name');
    const genre = searchParams.get('genre');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};

    if (id) {
      where.id = id;
    }
    
    if (spotifyId) {
      where.spotifyId = spotifyId;
    }
    
    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }
    
    if (genre) {
      where.genres = {
        has: genre, 
      };
    }

    const artists = await prisma.artist.findMany({
      where,
      take: limit,
      orderBy: {
        popularity: 'desc',
      },
    });

    return NextResponse.json({ 
      success: true, 
      count: artists.length,
      artists 
    });

  } catch (error) {
    console.error('Error fetching artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artists' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  
    const { spotifyIds }: { spotifyIds: string[] } = await request.json();

    if (!spotifyIds || !Array.isArray(spotifyIds) || spotifyIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid spotifyIds data' },
        { status: 400 }
      );
    }

    const result = await prisma.artist.deleteMany({
      where: {
        spotifyId: {
          in: spotifyIds,
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      count: result.count 
    });

  } catch (error) {
    console.error('Error deleting artists:', error);
    return NextResponse.json(
      { error: 'Failed to delete artists' },
      { status: 500 }
    );
  }
}