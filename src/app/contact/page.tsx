// src/app/contact/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Mail, Check } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setSending(false)
        return
      }

      setSent(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSending(false)
    } catch (err) {
      setError('Failed to send message. Please try again.')
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] hover:text-neutral-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

            {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <img
              src="/images/nostal-manila-logo.jpg"
              alt="Nostal Manila"
              className="h-8 w-auto object-contain"
            />
          </Link>

          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] hover:text-neutral-500 transition-colors"
          >
            Visit Shop
            <ArrowRight size={14} />
          </Link>
          <div className="w-6 sm:hidden" />
        </div>
      </nav>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* LEFT: INFO */}
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-6">
              Get in Touch
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-8">
              Let's talk.
            </h1>
            <p className="text-neutral-500 text-base leading-relaxed mb-12 max-w-md">
           DINOROBONG TUBO
            </p>

            {/* Contact Details */}
            <div className="space-y-8">
              {/* Email */}
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-3">
                  Email
                </p>
                <a
                  href="mailto:Nosta@manila.com"
                  className="inline-flex items-center gap-3 text-base sm:text-lg font-bold text-black hover:text-neutral-500 transition-colors"
                >
                  <Mail size={18} />
                  Nosta@manila.com
                </a>
              </div>

              {/* Social */}
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-3">
                  Follow Us
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    className="p-3 border border-neutral-200 hover:bg-black hover:text-white transition-all"
                    aria-label="Instagram"
                  >
                
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div>
            {sent ? (
              <div className="border border-neutral-200 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                  <Check size={32} className="text-green-600" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-black mb-3">Message Sent!</h2>
                <p className="text-sm text-neutral-500 mb-8">
                  Salamat! We'll get back to you within 24-48 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-xs font-bold uppercase tracking-[0.15em] text-black border-b border-black pb-1 hover:opacity-60 transition-opacity"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-3">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors placeholder:text-neutral-400"
                    placeholder="Juan Dela Cruz"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-3">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors placeholder:text-neutral-400"
                    placeholder="juan@email.com"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-3">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors placeholder:text-neutral-400"
                    placeholder="Order inquiry, collab, etc."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-3">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors placeholder:text-neutral-400 resize-none"
                    placeholder="Type your message here..."
                  />
                </div>

                {error && (
                  <div className="px-5 py-4 bg-red-50 border border-red-200 text-red-600 text-xs">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-black text-white py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-16 px-6 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs text-neutral-400 uppercase tracking-[0.2em]">
            © 2026 NOSTALMANILA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}