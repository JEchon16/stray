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
      {/* Background subtle dot pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Brand Name */}
        <h1 
          className={`text-4xl md:text-5xl font-black tracking-tight text-white mb-20 transition-all duration-1000 ${
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Stray4m
        </h1>

        {/* Navigation Options */}
        <div 
          className={`flex flex-col items-center gap-8 transition-all duration-1000 delay-300 ${
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

      {/* Footer */}
      <div 
        className={`absolute bottom-8 text-neutral-600 text-xs uppercase tracking-[0.3em] transition-all duration-1000 delay-700 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        © 2026 STRAYFM
      </div>
    </div>
  )
}