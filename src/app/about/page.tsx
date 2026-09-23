// src/app/about/page.tsx
'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function AboutPage() {
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

      {/* HERO */}
      <section className="py-24 px-6 border-b border-neutral-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-6">
            About Us
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-tight mb-8">
            We were never meant
            <br />
            <span
              style={{
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              to fit in.
            </span>
          </h1>
          <p className="text-neutral-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            That's the whole point.
          </p>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-6">
            The Story
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-8">
            Born from the streets of Manila.
          </h2>
          <div className="space-y-6 text-neutral-600 text-base sm:text-lg leading-relaxed">
            <p>
              <strong className="text-black">Nostal Manila</strong> was born from
              the streets, built for dreamers. Para sa mga taong hindi sumusunod
              sa uso — sila ang gumagawa ng sariling landas.
            </p>
            <p>
              Every piece is a statement. Hindi lang ito damit. Ito ay mindset.
              Mula sa mga kalsada ng Maynila, hanggang sa mga pangarap na hindi
              natutulog.
            </p>
            <p>
              <strong className="text-black">From Broke to Bling.</strong> Yan
              ang aming motto. Hindi lang ito tungkol sa pera — ito ay tungkol
              sa pag-akyat, sa pag-pursue ng pangarap, sa hindi pag-give up.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.4em] mb-6">
            Our Values
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-16">
            What we stand for.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Value 1 */}
            <div>
              <div className="w-12 h-12 mb-6 border border-black flex items-center justify-center">
                <span className="text-lg font-black">01</span>
              </div>
              <h3 className="text-xl font-black mb-3 tracking-tight">
                Proudly Filipino
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Gawang Pinoy. Made in Manila. Every piece celebrates our
                culture, our streets, our people.
              </p>
            </div>

            {/* Value 2 */}
            <div>
              <div className="w-12 h-12 mb-6 border border-black flex items-center justify-center">
                <span className="text-lg font-black">02</span>
              </div>
              <h3 className="text-xl font-black mb-3 tracking-tight">
                Built for Dreamers
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Para sa mga taong may pangarap. Sa mga taong hindi natatakot
                mag-umpisa sa wala.
              </p>
            </div>

            {/* Value 3 */}
            <div>
              <div className="w-12 h-12 mb-6 border border-black flex items-center justify-center">
                <span className="text-lg font-black">03</span>
              </div>
              <h3 className="text-xl font-black mb-3 tracking-tight">
                Quality First
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Premium fabrics, ethical production, attention to detail. Every
                stitch counts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6">
            Chasing dreams,
            <br />
            <span
              style={{
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              not crowds.
            </span>
          </h2>
          <p className="text-neutral-500 text-base mb-10 max-w-xl mx-auto">
            Join the movement. Wear the story.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all"
            >
              Shop Collection
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-neutral-200 text-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:border-black transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

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