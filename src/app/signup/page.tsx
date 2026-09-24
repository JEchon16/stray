// src/app/signup/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/shop'

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Hindi match ang passwords. Please check ulit.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const supabase = createClient()

    // Sign up
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    // If email confirmation is disabled, user is auto-logged in
    if (data.user && data.session) {
      router.push(redirectTo)
      router.refresh()
      return
    }

    // If email confirmation is enabled, redirect to login
    if (data.user && !data.session) {
      setError('Please check your email to verify your account.')
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
            Join The Movement
          </p>
          <h1 className="text-3xl font-black tracking-tight mb-3">
            Create Account
          </h1>
          <p className="text-sm text-neutral-500">
            Sign up para makapag-order ka na
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors placeholder:text-neutral-400"
              placeholder="Juan Dela Cruz"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
              Email Address <span className="text-red-500">*</span>
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
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
              className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors placeholder:text-neutral-400"
              placeholder="••••••••"
            />
            <p className="text-[10px] text-neutral-400 mt-2">
              Minimum 6 characters
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-[10px] text-neutral-500 text-center leading-relaxed">
            Sa pag-sign up, sumasang-ayon ka sa aming{' '}
            <a href="#" className="underline">
              Terms
            </a>{' '}
            at{' '}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </form>

        <p className="text-center text-xs text-neutral-500 mt-8">
          May account ka na?{' '}
          <Link
            href={`/login?redirect=${redirectTo}`}
            className="font-bold text-black underline underline-offset-4 hover:opacity-60"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}