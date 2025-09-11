import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    const testUsers = [
      {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      },
      {
        email: 'john@example.com', 
        name: 'John Doe',
        password: 'password123'
      },
      {
        email: 'jane@example.com',
        name: 'Jane Smith', 
        password: 'password123'
      },
      {
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'admin123'
      }
    ]

    const createdUsers = []

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`)
        createdUsers.push({ ...existingUser, password: '[HIDDEN]' })
        continue
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 12)

      // Create the user
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword
        }
      })

      console.log(`✅ Created user: ${user.email}`)
      createdUsers.push({ ...user, password: '[HIDDEN]' })
    }

    return NextResponse.json({
      success: true,
      message: `Created/found ${createdUsers.length} test users`,
      users: createdUsers
    })

  } catch (error) {
    console.error('❌ Error creating test users:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Optional: GET method to just list existing users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        spotifyId: true
      }
    })

    return NextResponse.json({
      success: true,
      count: users.length,
      users
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

