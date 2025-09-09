import { prisma } from './prisma'

export async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Test queries
    const userCount = await prisma.user.count()
    const trackCount = await prisma.track.count()
    const artistCount = await prisma.artist.count()
    
    console.log(`📊 Database stats:`)
    console.log(`   Users: ${userCount}`)
    console.log(`   Tracks: ${trackCount}`)
    console.log(`   Artists: ${artistCount}`)
    
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}