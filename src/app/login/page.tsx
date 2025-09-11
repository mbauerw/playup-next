'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const urlError = searchParams.get('error')
    if (urlError) {
      // Decode NextAuth error messages
      const errorMessages: { [key: string]: string } = {
        'CredentialsSignin': 'Invalid email or password',
        'Email and password are required': 'Please fill in all fields',
        'No account found with this email address': 'No account found with this email',
        'Incorrect password': 'Incorrect password',
        'This account was created with Google. Please sign in with Google.': 'Please use Google sign-in for this account'
      }

      setError(errorMessages[urlError] || 'Sign in failed. Please try again.')
    }
  }, [searchParams])

  useEffect(() => {
    if (session) {
      router.push('/')
    }
  }, [session, router])

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.ok) {
      router.push('/')
    } else if (result?.error) {
      // Handle the error from NextAuth
      const errorMessages: { [key: string]: string } = {
        'CredentialsSignin': 'Invalid email or password',
        'Email and password are required': 'Please fill in all fields',
        'No account found with this email address': 'No account found with this email',
        'Incorrect password': 'Incorrect password',
        'This account was created with Google. Please sign in with Google.': 'Please use Google sign-in for this account'
      }

      setError(errorMessages[result.error] || 'Sign in failed. Please try again.')
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Registration successful! You can now sign in.')
        setIsRegistering(false)
        // Optionally auto-sign them in
        await signIn('credentials', { email, password, redirect: false })
        router.push('/')
      } else {
        alert(data.error)
      }
    } catch (error) {
      alert('Registration failed')
    }
    setLoading(false)
  }


  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (session) {
    return <div>Redirecting...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            {isRegistering ? 'Create Account' : 'Sign in to PlayUp'}
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Social Login */}
        <div className="space-y-4">
          <button
            onClick={() => signIn('google')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isRegistering ? 'Sign up' : 'Sign in'} with Google
          </button>
        </div>

        <div className="text-center text-gray-500">or</div>

        {/* Credentials Form */}
        <form onSubmit={isRegistering ? handleRegister : handleCredentialsSignIn} className="space-y-4">
          {isRegistering && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-black"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-black"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-black"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Loading...' : isRegistering ? 'Create Account' : 'Sign in'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 hover:text-blue-800"
          >
            {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        {!isRegistering && (
          <div className="text-center text-sm text-gray-600">
            Test credentials: test@example.com / password123
          </div>
        )}
      </div>
    </div>
  )
}
