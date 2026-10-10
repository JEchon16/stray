// src/app/page.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// ============================================
// LOGO SEQUENCE (string[][] = multi-line support)
// ============================================
const LOGOS: string[][] = [
  ['NOSTAL'],
  ['MANILA'],
 
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [currentLogo, setCurrentLogo] = useState(0)
  const [logoVisible, setLogoVisible] = useState(true)

  // ============================================
  // MOUNT ANIMATION
  // ============================================
  useEffect(() => {
    setMounted(true)
  }, [])

  // ============================================
  // LOGO SLIDESHOW
  // ============================================
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoVisible(false)

      setTimeout(() => {
        setCurrentLogo((prev) => (prev + 1) % LOGOS.length)
        setLogoVisible(true)
      }, 600)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ============================================ */}
      {/* CONTENT */}
      {/* ============================================ */}
      <div
        className={`relative z-10 flex-1 flex flex-col items-center justify-center transition-all duration-1000 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Logo Slideshow — multi-line support */}
        <div className="flex flex-col items-center justify-center min-h-[120px] sm:min-h-[160px] w-full max-w-3xl px-4">
          <div
            className={`transition-all duration-[600ms] ease-in-out flex flex-col items-center gap-1 sm:gap-2 ${
              logoVisible
                ? 'opacity-100 scale-100 blur-0'
                : 'opacity-0 scale-95 blur-sm'
            }`}
          >
            {LOGOS[currentLogo].map((line, i) => (
              <span
                key={i}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white text-center leading-tight"
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              >
                {line}
              </span>
            ))}
          </div>
        </div>

        {/* SHOP + HELP Links */}
        <div
          className={`flex flex-col items-center gap-8 mt-16 sm:mt-20 transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/shop"
            className="group text-white text-base md:text-lg font-bold uppercase tracking-[0.4em] hover:tracking-[0.6em] transition-all duration-500 relative py-2"
          >
            SHOP
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-px bg-white group-hover:w-full transition-all duration-500" />
          </Link>

          <button
            onClick={() => alert('Help page coming soon!')}
            className="group text-neutral-500 text-base md:text-lg font-bold uppercase tracking-[0.4em] hover:text-white hover:tracking-[0.6em] transition-all duration-500 relative py-2"
          >
            HELP
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-px bg-white group-hover:w-full transition-all duration-500" />
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <div
        className={`relative z-10 w-full text-center pb-8 transition-all duration-1000 delay-700 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-neutral-600 text-[10px] sm:text-xs uppercase tracking-[0.3em] leading-relaxed px-4">
          © 2026 NOSTALMANILA. All rights reserved.
        </p>
      </div>
    </div>
  )
}