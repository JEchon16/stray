'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ShoppingBag, Search, Menu, X, ArrowRight 
} from 'lucide-react'

// Custom Brand Icons (SVG)
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
)

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    '/images/hero1.jpg',
    '/images/hero2.jpg',
    '/images/hero3.jpg',
    '/images/hero4.jpg',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [heroSlides.length])

  const navLinks = [
    { href: '#shop', label: 'Shop' },
    { href: '#collections', label: 'Collections' },
    { href: '#lookbook', label: 'Lookbook' },
    { href: '#about', label: 'About' },
  ]

  const products = [
    { id: 1, name: 'STRAY 4M Tee — Black', price: '₱899', image: '/images/product-1.jpg', badge: 'New' },
    { id: 2, name: 'STRAY 4M Tee — White', price: '₱899', image: '/images/product-2.jpg', badge: null },
    { id: 3, name: 'STRAY 4 MONEY Tee', price: '₱899', image: '/images/product-3.jpg', badge: 'Best Seller' },
    { id: 4, name: 'Peso Dreams Tee', price: '₱899', image: '/images/product-4.jpg', badge: null },
  ]

  const collections = [
    { name: '2026 Collection', status: 'Coming Soon', image: '/images/hero3.jpg' },
    { name: 'STRAY 4M', status: 'Available', image: '/images/product-1.jpg' },
    { name: 'Peso Dreams', status: 'Available', image: '/images/hero1.jpg' },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* ANNOUNCEMENT BAR */}
      <div className="bg-white text-black py-2 overflow-hidden">
        <div className="marquee-wrapper">
          <div className="marquee-content">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 px-6">
                <span className="text-xs font-bold uppercase tracking-wider">Free Shipping on Orders Over ₱2,000</span>
                <span className="text-xs">•</span>
                <span className="text-xs font-bold uppercase tracking-wider">New Drop: STRAY 4M Collection</span>
                <span className="text-xs">•</span>
                <span className="text-xs font-bold uppercase tracking-wider">Cash on Delivery Available</span>
                <span className="text-xs">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-black tracking-tight" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Stray4m
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-neutral-900 rounded-full transition-colors">
              <Search size={18} />
            </button>
            <button className="p-2 hover:bg-neutral-900 rounded-full transition-colors relative">
              <ShoppingBag size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-900 bg-[#0A0A0A] px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg font-medium uppercase tracking-wider text-sm transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO - Auto Rotating */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide ${i === currentSlide ? 'active' : ''}`}
          >
            <img
              src={slide}
              alt={`Slide ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

        <div className="relative z-10 h-full flex items-end pb-16 px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-2xl anim-fade-up">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.3em] mb-4">
                New Collection 2026
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-6">
                Peso Dreams.
                <br />
                <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400 }}>
                  Diamond Goals.
                </span>
              </h1>
              <p className="text-neutral-300 text-base sm:text-lg mb-8 max-w-md">
                Chasing dreams, not crowds. Premium streetwear para sa mga taong may pangarap.
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="#shop" 
                  className="group bg-white text-black px-8 py-4 font-bold text-sm uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2"
                >
                  Shop Collection
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="#lookbook" 
                  className="bg-transparent border border-white/30 text-white px-8 py-4 font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all"
                >
                  View Lookbook
                </a>
              </div>
            </div>

            <div className="flex gap-2 mt-12">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-0.5 transition-all duration-300 ${
                    i === currentSlide ? 'w-12 bg-white' : 'w-6 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="shop" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.3em] mb-2">
                Featured
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
                SHOP THE DROP
              </h2>
            </div>
            <a 
              href="#" 
              className="hidden sm:flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
            >
              View All <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, i) => (
              <div 
                key={product.id} 
                className={`group cursor-pointer anim-fade-up delay-${(i + 1) * 100}`}
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-900 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-white text-black px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-white text-black py-3 text-center text-xs font-bold uppercase tracking-wider translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    Quick Add
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1 group-hover:text-neutral-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-neutral-500">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="collections" className="py-20 px-6 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.3em] mb-2">
              Collections
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              EXPLORE THE SERIES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {collections.map((collection, i) => (
              <div 
                key={i}
                className={`group relative aspect-[3/4] overflow-hidden cursor-pointer anim-fade-up delay-${(i + 1) * 100}`}
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    {collection.status}
                  </p>
                  <h3 className="text-xl font-black mb-4">{collection.name}</h3>
                  <button className="text-xs font-bold uppercase tracking-wider border-b-2 border-white pb-1 hover:border-neutral-400 transition-colors">
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

          {/* LOOKBOOK - White background with floating ring logos */}
      <section id="lookbook" className="relative py-20 px-6 bg-white overflow-hidden">
        {/* Floating Ring Logos */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/images/stray4m-ring.jpg"
            alt=""
            className="floating-ring ring-anim-1"
            style={{ top: '5%', left: '3%', width: '120px', height: '120px' }}
          />
          <img
            src="/images/stray4m-ring.jpg"
            alt=""
            className="floating-ring ring-anim-2"
            style={{ top: '15%', right: '5%', width: '150px', height: '150px' }}
          />
          <img
            src="/images/stray4m-ring.jpg"
            alt=""
            className="floating-ring ring-anim-3"
            style={{ bottom: '20%', left: '8%', width: '100px', height: '100px' }}
          />
          <img
            src="/images/stray4m-ring.jpg"
            alt=""
            className="floating-ring ring-anim-4"
            style={{ bottom: '10%', right: '10%', width: '140px', height: '140px' }}
          />
          <img
            src="/images/stray4m-ring.jpg"
            alt=""
            className="floating-ring ring-anim-1"
            style={{ top: '45%', left: '45%', width: '90px', height: '90px', animationDelay: '0.7s' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.3em] mb-2">
                Lookbook
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-black">
                WEAR THE STORY
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              { image: '/images/lookbook-1.jpg', title: 'Street Nights' },
              { image: '/images/lookbook-2.jpg', title: 'The Crew' },
            ].map((item, i) => (
              <div 
                key={i}
                className={`group relative aspect-[4/3] overflow-hidden cursor-pointer anim-fade-up delay-${(i + 1) * 100}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-300 mb-2">
                    Lookbook 2026
                  </p>
                  <h3 className="text-3xl font-black text-white">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section id="about" className="py-32 px-6 bg-[#111111]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.3em] mb-6">
            The Story
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-8">
            We were never meant to fit in.
            <br />
            <span style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400 }}>
              That's the whole point.
            </span>
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            STRAYFM was born from the streets, built for dreamers. Para sa mga taong
            hindi sumusunod sa uso — sila ang gumagawa ng sariling landas.
            <br /><br />
            <strong className="text-white">Peso Dreams. Diamond Goals.</strong> Hindi lang ito damit. Ito ay mindset.
          </p>
          <div className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider">
            <span>Chasing dreams, not crowds</span>
            <ArrowRight size={16} />
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 px-6 border-t border-b border-neutral-900">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
            JOIN THE MOVEMENT
          </h3>
          <p className="text-neutral-500 text-sm mb-8">
            Be the first to know about new drops, exclusive offers, at secret events.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-4 bg-transparent border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors text-sm"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-neutral-200 transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <h4 
                className="text-3xl font-black mb-4" 
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              >
                Strayfm
              </h4>
              <p className="text-neutral-500 text-sm max-w-md mb-6 leading-relaxed">
                Premium streetwear for the dreamers. Peso dreams, diamond goals — 
                chasing dreams, not crowds.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="p-2 border border-neutral-800 hover:bg-white hover:text-black transition-all">
                  <InstagramIcon size={16} />
                </a>
                <a href="#" className="p-2 border border-neutral-800 hover:bg-white hover:text-black transition-all">
                  <FacebookIcon size={16} />
                </a>
                <a href="#" className="p-2 border border-neutral-800 hover:bg-white hover:text-black transition-all">
                  <TikTokIcon size={16} />
                </a>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider mb-4">Shop</h5>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider mb-4">Help</h5>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-600">
            <p>© 2026 STRAYFM. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}