'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background subtle texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div 
          className={`mb-12 transition-all duration-1000 ${
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
         
        </div>

        {/* Brand Name */}
        <h1 
          className={`text-3xl md:text-4xl font-black tracking-tight text-white mb-16 transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Stray4m
        </h1>

        {/* Navigation Options */}
        <div 
          className={`flex flex-col items-center gap-6 transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/home"
            className="group text-white text-lg md:text-xl font-bold uppercase tracking-[0.3em] hover:tracking-[0.5em] transition-all duration-300 relative"
          >
            HOME
            <span className="absolute -bottom-2 left-0 right-0 h-px bg-white/0 group-hover:bg-white/60 transition-all" />
          </Link>

          <Link
            href="/shop"
            className="group text-white text-lg md:text-xl font-bold uppercase tracking-[0.3em] hover:tracking-[0.5em] transition-all duration-300 relative"
          >
            SHOP
            <span className="absolute -bottom-2 left-0 right-0 h-px bg-white/0 group-hover:bg-white/60 transition-all" />
          </Link>

          <button
            onClick={() => alert('Help page coming soon!')}
            className="group text-neutral-500 text-lg md:text-xl font-bold uppercase tracking-[0.3em] hover:text-white hover:tracking-[0.5em] transition-all duration-300 relative"
          >
            HELP
            <span className="absolute -bottom-2 left-0 right-0 h-px bg-white/0 group-hover:bg-white/60 transition-all" />
          </button>
        </div>
      </div>

      {/* Footer - small text */}
      <div 
        className={`absolute bottom-8 text-neutral-600 text-xs uppercase tracking-widest transition-all duration-1000 delay-700 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        © 2026 STRAYFM
      </div>
    </div>
  )
}