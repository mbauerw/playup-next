// src/app/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Logo from '@/components/Logo';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  useEffect(() => {
    if (status !== 'loading') {
      setShowContent(true);
    } else {
      // Show content after a maximum delay even if still loading
      const timer = setTimeout(() => setShowContent(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Customized
            <span className="block">
              <span className="text-green-400">Spotify</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Playlists</span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-[800px] mx-auto">
            PlayUp automatically builds playlists based on your track history to ensure you only get the freshest tunes. 
            Choose whether you want the classics, the deep cuts, or songs from all new artists in the genres you love. Let PlayUp find the songs you didn't know you wanted to hear.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg"
            >
              Start Creating Playlists
            </Link>
            <Link
              href="/login"
              className="bg-gray-800/80 hover:bg-gray-700/80 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors backdrop-blur-sm border border-gray-700"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900/60 backdrop-blur-md rounded-lg p-6 border border-gray-800">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Playlist Creation</h3>
            <p className="text-gray-300">
              Use advanced algorithms to create playlists based on your listening history, 
              mood, and music preferences.
            </p>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-md rounded-lg p-6 border border-gray-800">
            <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Music Analytics</h3>
            <p className="text-gray-300">
              Get detailed insights into your music taste, discover patterns, 
              and explore new genres you might love.
            </p>
          </div>

          <div className="bg-gray-900/60 backdrop-blur-md rounded-lg p-6 border border-gray-800">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Spotify Integration</h3>
            <p className="text-gray-300">
              Seamlessly connect with your Spotify account to access your music library 
              and sync your created playlists.
            </p>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Connect Spotify</h3>
              <p className="text-gray-300">
                Link your Spotify account securely to access your music library and preferences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Analyze & Create</h3>
              <p className="text-gray-300">
                Our AI analyzes your music taste and helps you create personalized playlists.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Enjoy & Share</h3>
              <p className="text-gray-300">
                Listen to your unique playlists and share them with friends on Spotify.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of music lovers creating unique playlists with PlayUp
          </p>
          <Link
            href="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            Create Your First Playlist
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 PlayUp. All rights reserved.</p>
            <p className="mt-2 text-sm">
              This application uses the Spotify Web API but is not endorsed, certified or otherwise approved by Spotify.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}