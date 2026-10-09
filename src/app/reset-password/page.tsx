// src/app/reset-password/page.tsx
'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'

function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [hasSession, setHasSession] = useState(false)

  // Check if user has valid session (from email link)
  useEffect(() => {
    const supabase = createClient()

    // Listen for auth state change (Supabase processes the token from URL hash)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setHasSession(true)
        setChecking(false)
      }
    })

    // Also check current session after a delay
    setTimeout(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        setHasSession(true)
      }
      setChecking(false)
    }, 1000)

    return () => subscription.unsubscribe()
  }, [])

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
    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Success
    setSuccess(true)
    setLoading(false)

    // Sign out and redirect after 3 seconds
    setTimeout(async () => {
      await supabase.auth.signOut()
      router.push('/login')
    }, 3000)
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-neutral-500 uppercase tracking-[0.2em]">
            Verifying link...
          </p>
        </div>
      </div>
    )
  }

  // No valid session
  if (!hasSession && !success) {
    return (
      <div className="min-h-screen bg-white text-black">
        <nav className="border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative">
            <Link
              href="/login"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] hover:text-neutral-500 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Login
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

        <div className="max-w-md mx-auto px-6 py-16 lg:py-24 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
            <AlertCircle
              size={36}
              className="text-red-600"
              strokeWidth={1.5}
            />
          </div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-3">
            Invalid Link
          </p>
          <h1 className="text-3xl font-black tracking-tight mb-3">
            Link Expired
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed mb-8">
            Yung reset link mo — invalid o expired na. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all"
          >
            Request New Link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* NAVBAR */}
      <nav className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative">
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] hover:text-neutral-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
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
        {success ? (
          /* SUCCESS STATE */
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
              <Check size={36} className="text-green-600" strokeWidth={1.5} />
            </div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-3">
              Success
            </p>
            <h1 className="text-3xl font-black tracking-tight mb-3">
              Password Updated
            </h1>
            <p className="text-sm text-neutral-500 leading-relaxed mb-8">
              Na-update na yung password mo. Redirecting to login...
            </p>
            <Link
              href="/login"
              className="inline-block px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          /* FORM STATE */
          <>
            <div className="text-center mb-10">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-3">
                New Password
              </p>
              <h1 className="text-3xl font-black tracking-tight mb-3">
                Set New Password
              </h1>
              <p className="text-sm text-neutral-500">
                I-enter mo yung bagong password mo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
                  New Password <span className="text-red-500">*</span>
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
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-pulse">
            <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}