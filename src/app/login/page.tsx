// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/shop'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* NAVBAR */}
      <nav className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] hover:text-neutral-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <img
              src="/images/nostal-manila-logo.jpg"
              alt="Nostal Manila"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="w-20" />
        </div>
      </nav>

      {/* MAIN */}
      <div className="max-w-md mx-auto px-6 py-16 lg:py-24">
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-3">
            Welcome Back
          </p>
          <h1 className="text-3xl font-black tracking-tight mb-3">
            Sign In
          </h1>
          <p className="text-sm text-neutral-500">
            Log in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors placeholder:text-neutral-400"
              placeholder="juan@email.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors placeholder:text-neutral-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="px-5 py-4 bg-red-50 border border-red-200 text-red-600 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 font-bold text-xs uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 mt-8">
          Wala pang account?{' '}
          <Link
            href={`/signup?redirect=${redirectTo}`}
            className="font-bold text-black underline underline-offset-4 hover:opacity-60"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}