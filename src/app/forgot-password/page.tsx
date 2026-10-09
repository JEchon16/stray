// src/app/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
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
        {sent ? (
          /* SUCCESS STATE */
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
              <Check size={36} className="text-green-600" strokeWidth={1.5} />
            </div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-3">
              Email Sent
            </p>
            <h1 className="text-3xl font-black tracking-tight mb-3">
              Check your inbox
            </h1>
            <p className="text-sm text-neutral-500 leading-relaxed mb-8">
              Nag-send kami ng password reset link sa{' '}
              <strong className="text-black">{email}</strong>.
              <br />
              Click mo yung link para mag-set ng bagong password.
            </p>
            <p className="text-xs text-neutral-400 mb-8">
              Hindi mo nakita yung email? Check mo yung Spam folder.
            </p>
            <Link
              href="/login"
              className="inline-block px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          /* FORM STATE */
          <>
            <div className="text-center mb-10">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-3">
                Forgot Password
              </p>
              <h1 className="text-3xl font-black tracking-tight mb-3">
                Reset Password
              </h1>
              <p className="text-sm text-neutral-500">
                I-enter mo yung email mo para makapag-reset ng password.
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
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-center text-xs text-neutral-500 mt-8">
              Forget Password?{' '}
              <Link
                href="/login"
                className="font-bold text-black underline underline-offset-4 hover:opacity-60"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}