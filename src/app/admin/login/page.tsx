// src/app/admin/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
const supabase = createClient()

export default function AdminLoginPage() {
  const router = useRouter()
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

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Soft glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-16">
          <h1
            className="text-4xl font-black text-white mb-3"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            NostalManila
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-neutral-800" />
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.4em]">
              Admin Panel
            </p>
            <span className="w-8 h-px bg-neutral-800" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-5 py-4 bg-neutral-950 border border-neutral-900 text-white text-sm focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700"
              placeholder="admin@nostalmanila.com"
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
              className="w-full px-5 py-4 bg-neutral-950 border border-neutral-900 text-white text-sm focus:outline-none focus:border-white transition-colors placeholder:text-neutral-700"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="px-5 py-4 bg-red-950/30 border border-red-900/50 text-red-400 text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-5 font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-[10px] text-neutral-600 uppercase tracking-[0.3em]">
            © 2026 NostalManila
          </p>
        </div>
      </div>
    </div>
  )
}