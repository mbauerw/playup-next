// src/lib/auth.ts
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import SpotifyProvider from 'next-auth/providers/spotify'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'user-read-private user-read-email playlist-read-private playlist-modify-private user-library-read user-follow-read user-read-recently-played'
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        if (credentials?.email === "user@example.com" && credentials?.password === "password") {
          return {
            id: "1",
            email: "user@example.com",
            name: "Test User"
          }
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            throw new Error('No account found with this email address')
          }

          if (!user.password) {
            throw new Error('This account was created with Google. Please sign in with Google.')
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            throw new Error('Incorrect password')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image || null
          }
        } catch (error) {
          throw error
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'spotify') {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                spotifyId: account.providerAccountId,
                spotifyAccessToken: account.access_token,
                spotifyRefreshToken: account.refresh_token,
                spotifyTokenExpiry: account.expires_at ? new Date(account.expires_at * 1000) : null,
              }
            })
            user.id = newUser.id
          } else {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                spotifyId: account.providerAccountId,
                spotifyAccessToken: account.access_token,
                spotifyRefreshToken: account.refresh_token,
                spotifyTokenExpiry: account.expires_at ? new Date(account.expires_at * 1000) : null,
                name: user.name,
                image: user.image,
              }
            })
            user.id = existingUser.id
          }
        } else if (account?.provider === 'google') {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
              }
            })
            console.log('✅ Created new Google user:', newUser.email)
            user.id = newUser.id
          } else {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name,
                image: user.image,
              }
            })
            user.id = existingUser.id
          }
        }

        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    },
    async jwt({ token, user, account }) {
      // If user object exists (sign in), add id to token
      if (user) {
        token.id = user.id
      }

      // Store Spotify tokens in JWT when user signs in with Spotify
      if (account?.provider === 'spotify') {
        token.spotifyAccessToken = account.access_token
        token.spotifyRefreshToken = account.refresh_token
        token.spotifyTokenExpires = account.expires_at
      }

      return token
    },
    async session({ session, token }) {
      // Add user id to session - use token.id instead of token.sub for consistency
      if (session.user && token.id) {
        session.user.id = token.id
      }
      
      // Add Spotify token info to session
      session.spotifyAccessToken = token.spotifyAccessToken as string | undefined
      session.spotifyTokenExpires = token.spotifyTokenExpires as number | undefined
      
      return session
    }
  }
}