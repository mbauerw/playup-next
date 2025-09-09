import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$connect()
    
    // Test queries
    const userCount = await prisma.user.count()
    const trackCount = await prisma.track.count()
    const artistCount = await prisma.artist.count()
    const albumCount = await prisma.album.count()
    
    const stats = {
      connected: true,
      stats: {
        users: userCount,
        tracks: trackCount,
        artists: artistCount,
        albums: albumCount
      },
      message: 'Database connected successfully!'
    }
    
    console.log('✅ Database connection test successful:', stats)
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    
    return NextResponse.json(
      { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Database connection failed'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}