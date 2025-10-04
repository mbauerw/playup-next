'use client'

import { SessionProvider } from 'next-auth/react'
import { SpotifyProvider } from '@/contexts/SpotifyContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SpotifyProvider>
        {children}
      </SpotifyProvider>
    </SessionProvider>
  )
}