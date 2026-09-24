// src/app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Menu,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Product, HeroMedia, Collection, LookbookItem } from '@/lib/types'

// ============================================
// CUSTOM BRAND ICONS
// ============================================
const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

// ============================================
// HOME PAGE
// ============================================
export default function HomePage() {
  const supabase = createClient()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [heroMedia, setHeroMedia] = useState<HeroMedia[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [lookbook, setLookbook] = useState<LookbookItem[]>([])
  const [loading, setLoading] = useState(true)

  // ============================================
  // FETCH LAHAT NG DATA
  // ============================================
  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      // Fetch hero media
      const { data: heroData } = await supabase
        .from('hero_media')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })

      if (heroData && heroData.length > 0) {
        setHeroMedia(heroData as HeroMedia[])
      } else {
        // Fallback sa hardcoded
        setHeroMedia([
          { id: 'fallback-1', type: 'image', url: '/images/hero1.jpg', alt_text: null, sort_order: 1, active: true, created_at: '' },
          { id: 'fallback-2', type: 'image', url: '/images/hero2.jpg', alt_text: null, sort_order: 2, active: true, created_at: '' },
          { id: 'fallback-3', type: 'image', url: '/images/hero3.jpg', alt_text: null, sort_order: 3, active: true, created_at: '' },
          { id: 'fallback-4', type: 'image', url: '/images/hero4.jpg', alt_text: null, sort_order: 4, active: true, created_at: '' },
        ] as HeroMedia[])
      }

      // Fetch products
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)

      if (productData) setFeaturedProducts(productData as Product[])

      // Fetch collections
      const { data: collectionsData } = await supabase
        .from('collections')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })

      if (collectionsData && collectionsData.length > 0) {
        setCollections(collectionsData as Collection[])
      } else {
        // Fallback
        setCollections([
          { id: 'fallback-1', name: '2026 Collection', status: 'Coming Soon', image_url: '/images/hero3.jpg', link: '/shop', sort_order: 1, active: true, created_at: '' },
          { id: 'fallback-2', name: 'Nostal Manila', status: 'Available', image_url: '/images/products/black-tee-front.jpg', link: '/shop', sort_order: 2, active: true, created_at: '' },
          { id: 'fallback-3', name: 'Peso Dreams', status: 'Available', image_url: '/images/hero1.jpg', link: '/shop', sort_order: 3, active: true, created_at: '' },
        ] as Collection[])
      }

      // Fetch lookbook
      const { data: lookbookData } = await supabase
        .from('lookbook')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })

      if (lookbookData && lookbookData.length > 0) {
        setLookbook(lookbookData as LookbookItem[])
      } else {
        // Fallback
        setLookbook([
          { id: 'fallback-1', title: 'Street Nights', image_url: '/images/lookbook-1.jpg', sort_order: 1, active: true, created_at: '' },
          { id: 'fallback-2', title: 'The Crew', image_url: '/images/lookbook-2.jpg', sort_order: 2, active: true, created_at: '' },
        ] as LookbookItem[])
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  // ============================================
  // AUTO-PLAY SLIDER
  // ============================================
  useEffect(() => {
    if (!isPlaying || heroMedia.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroMedia.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isPlaying, heroMedia.length])

  const goToSlide = (index: number) => setCurrentSlide(index)
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % heroMedia.length)
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + heroMedia.length) % heroMedia.length
    )
  const togglePlay = () => setIsPlaying(!isPlaying)

  function formatPrice(price: number) {
    return '₱' + Number(price).toLocaleString('en-PH')
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* ============================================ */}
      {/* ANNOUNCEMENT BAR */}
      {/* ============================================ */}
      <div className="bg-black text-white py-2 overflow-hidden">
        <div className="marquee-wrapper">
          <div className="marquee-content">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 px-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Free Shipping on Orders Over ₱2,000
                </span>
                <span className="text-[10px]">•</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  New Drop: Nostal Manila 2026
                </span>
                <span className="text-[10px]">•</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Cash on Delivery Available
                </span>
                <span className="text-[10px]">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* NAVBAR */}
      {/* ============================================ */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* LEFT: Logo + Nav Links */}
            <div className="flex items-center gap-10 lg:gap-14">
              <Link href="/" className="flex-shrink-0">
                <img
                  src="/images/nostal-manila-logo.jpg"
                  alt="Nostal Manila"
                  className="h-8 w-auto object-contain"
                />
              </Link>

              <div className="hidden lg:flex items-center gap-8">
                <Link
                  href="/"
                  className="text-[11px] font-bold uppercase tracking-[0.15em] text-black border-b border-black pb-0.5"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className="text-[11px] font-bold uppercase tracking-[0.15em] text-black hover:text-neutral-400 transition-colors"
                >
                  Shop
                </Link>
                <a
                  href="#collections"
                  className="text-[11px] font-bold uppercase tracking-[0.15em] text-black hover:text-neutral-400 transition-colors"
                >
                  Collections
                </a>
                <a
                  href="#about"
                  className="text-[11px] font-bold uppercase tracking-[0.15em] text-black hover:text-neutral-400 transition-colors"
                >
                  About
                </a>
              </div>
            </div>

            {/* RIGHT: CTA + Mobile Menu */}
            <div className="flex items-center gap-4">
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-black hover:text-neutral-400 transition-colors whitespace-nowrap"
              >
                Visit Shop
                <ArrowRight size={14} />
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 -mr-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-100 bg-white px-6 py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-black bg-neutral-100 rounded-lg font-bold uppercase tracking-wider text-xs"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg font-bold uppercase tracking-wider text-xs transition-all"
            >
              Shop
            </Link>
            <a
              href="#collections"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg font-bold uppercase tracking-wider text-xs transition-all"
            >
              Collections
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg font-bold uppercase tracking-wider text-xs transition-all"
            >
              About
            </a>
          </div>
        )}
      </nav>

      {/* ============================================ */}
      {/* HERO SLIDER */}
      {/* ============================================ */}
      <section className="relative h-[75vh] min-h-[500px] overflow-hidden bg-black">
        {heroMedia.map((media, i) => (
          <div
            key={media.id}
            className={`hero-slide ${i === currentSlide ? 'active' : ''}`}
          >
            {media.type === 'video' ? (
              <video
                src={media.url}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                src={media.url}
                alt={media.alt_text || 'Hero'}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Slider controls */}
        <div className="absolute bottom-6 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-4">
            <button
              onClick={prevSlide}
              className="p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {heroMedia.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? 'w-8 h-2 bg-white'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>

            <div className="w-px h-6 bg-white/20 mx-2" />

            <button
              onClick={togglePlay}
              className="p-2 text-white/60 hover:text-white transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <div className="ml-2 text-xs font-bold text-white/60 tabular-nums hidden sm:block">
              {String(currentSlide + 1).padStart(2, '0')} /{' '}
              {String(heroMedia.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FEATURED DROP */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
                Featured
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
                Shop The Drop
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500 hover:text-black transition-colors"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-neutral-100 mb-4" />
                  <div className="h-3 bg-neutral-100 mb-2 w-32 mx-auto" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-sm">
                Wala pang products. Mag-add sa admin panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group block cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden mb-4">
                    <img
                      src={product.image_front}
                      alt={product.name}
                      className={`absolute inset-0 w-full h-full object-contain transition-all duration-700 ${
                        product.sold_out ? 'opacity-40' : 'group-hover:opacity-0'
                      }`}
                    />
                    {!product.sold_out && product.image_back && (
                      <img
                        src={product.image_back}
                        alt={`${product.name} - back`}
                        className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-all duration-700"
                      />
                    )}

                    {product.badge && !product.sold_out && (
                      <div className="absolute top-3 left-3 bg-black text-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em]">
                        {product.badge}
                      </div>
                    )}
                    {product.sold_out && (
                      <div className="absolute top-3 right-3 bg-white border border-neutral-200 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-600">
                        Sold Out
                      </div>
                    )}
                  </div>

                  <div className="relative h-5 text-center overflow-hidden">
                    {!product.sold_out ? (
                      <>
                        <h3 className="text-xs font-medium text-black uppercase tracking-[0.1em] absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-full">
                          {product.name}
                        </h3>
                        <p className="text-xs font-bold text-black uppercase tracking-[0.1em] absolute inset-0 flex items-center justify-center opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          {formatPrice(product.price)}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs font-medium text-neutral-400 uppercase tracking-[0.1em] absolute inset-0 flex items-center justify-center">
                        Sold Out
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================ */}
      {/* COLLECTIONS */}
      {/* ============================================ */}
      <section id="collections" className="py-24 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
              Collections
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Explore The Series
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={collection.link || '/shop'}
                className="group relative overflow-hidden cursor-pointer block"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-200">
                  <img
                    src={collection.image_url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-2">
                    {collection.status}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
                    {collection.name}
                  </h3>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-white border-b-2 border-white pb-1 group-hover:border-neutral-400 transition-colors">
                    Explore
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* LOOKBOOK */}
      {/* ============================================ */}
      <section id="lookbook" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
                Lookbook
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
                Wear The Story
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {lookbook.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] overflow-hidden cursor-pointer"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 mb-2">
                    Lookbook 2026
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BRAND STORY */}
      {/* ============================================ */}
      <section id="about" className="py-32 px-6 bg-neutral-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-6">
            The Story
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-8">
            We were never meant to fit in.
            <br />
            <span
              style={{
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              That's the whole point.
            </span>
          </h2>
          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            NostalManila was born from the streets, built for dreamers. Para sa
            mga taong hindi sumusunod sa uso — sila ang gumagawa ng sariling
            landas.
            <br />
            <br />
            <strong className="text-black">From Broke to Bling.</strong> Hindi
            lang ito damit. Ito ay mindset.
          </p>
          <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]">
            <span>Chasing dreams, not crowds</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* NEWSLETTER */}
      {/* ============================================ */}
      <section className="py-24 px-6 bg-white border-t border-neutral-100">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">
            Newsletter
          </p>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4">
            Join The Movement
          </h3>
          <p className="text-neutral-500 text-sm mb-10 max-w-md mx-auto">
            Be the first to know about new drops, exclusive offers, at secret
            events.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-4 bg-white border border-neutral-200 text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors text-sm"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-black text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="py-16 px-6 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <h4
                className="text-2xl font-black mb-4 text-black"
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              >
                NostalManila
              </h4>
              <p className="text-neutral-500 text-sm max-w-md mb-6 leading-relaxed">
                Premium streetwear for the dreamers. Peso dreams, diamond goals
                — chasing dreams, not crowds.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/nostalmanila/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-neutral-200 hover:bg-black hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={16} />
                </a>
                <a
                  href="https://www.facebook.com/NostalManila"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-neutral-200 hover:bg-black hover:text-white transition-all"
                  aria-label="Facebook"
                >
                  <FacebookIcon size={16} />
                </a>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-[0.15em] mb-4 text-black">
                Shop
              </h5>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li>
                  <Link href="/shop" className="hover:text-black transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-black transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-black transition-colors">
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-black transition-colors">
                    Sale
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-[0.15em] mb-4 text-black">
                Help
              </h5>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Size Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Returns
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-black transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-3">
              <p>© 2026 NOSTALMANILA. All rights reserved.</p>
              <Link
                href="/admin/login"
                className="group p-1.5 hover:bg-neutral-100 rounded transition-all"
                aria-label="Admin access"
                title="Admin"
              >
                <span
                  className="text-base font-black text-neutral-300 group-hover:text-black transition-colors"
                  style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                >
                  N
                </span>
              </Link>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-black transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}