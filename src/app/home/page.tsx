'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ShoppingBag, Search, Menu, X, ArrowRight,
  ChevronLeft, ChevronRight, Play, Pause, ChevronDown,
  Plus, Minus, Trash2
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

// Animated Word Component - Wave hover effect
function AnimatedWord({ 
  text, 
  className = '' 
}: { 
  text: string; 
  className?: string;
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      className={`inline-block cursor-default ${className}`}
    >
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-300"
          style={{
            transform: hovered 
              ? `translateY(-10px) scale(1.15) rotate(${i % 2 === 0 ? -5 : 5}deg)`
              : 'translateY(0) scale(1) rotate(0deg)',
            transitionDelay: `${i * 40}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

// Cart Item Type
interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])

  const heroSlides = [
    { image: '/images/hero1.jpg', title: 'Peso Dreams', subtitle: 'Diamond Goals' },
    { image: '/images/hero2.jpg', title: 'Chasing Dreams', subtitle: 'Not Crowds' },
    { image: '/images/hero3.jpg', title: 'From Broke', subtitle: 'To Bling' },
    { image: '/images/hero4.jpg', title: 'STRAY 4M', subtitle: 'Collection' },
  ]

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [isPlaying, heroSlides.length])

  const goToSlide = (index: number) => setCurrentSlide(index)
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  const togglePlay = () => setIsPlaying(!isPlaying)

  const navLinks = [
    { href: '#shop', label: 'Shop' },
    { href: '#collections', label: 'Collections' },
    { href: '#lookbook', label: 'Lookbook' },
    { href: '#about', label: 'About' },
  ]

  const products = [
    { id: 1, name: 'STRAY 4M Tee — Black', price: 899, image: '/images/product-1.jpg', badge: 'New' },
    { id: 2, name: 'STRAY 4M Tee — White', price: 899, image: '/images/product-2.jpg', badge: null },
    { id: 3, name: 'STRAY 4 MONEY Tee', price: 899, image: '/images/product-3.jpg', badge: 'Best Seller' },
    { id: 4, name: 'Peso Dreams Tee', price: 899, image: '/images/product-4.jpg', badge: null },
  ]

  // Cart Functions
  const addToCart = (product: typeof products[0]) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id)
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      }]
    })
    setCartOpen(true)
  }

  const updateQuantity = (id: number, change: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    )
  }

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const formatPrice = (price: number) => {
    return '₱' + price.toLocaleString('en-PH')
  }

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const collections = [
    { name: '2026 Collection', status: 'Coming Soon', image: '/images/hero3.jpg' },
    { name: 'STRAY 4M', status: 'Available', image: '/images/product-1.jpg' },
    { name: 'Peso Dreams', status: 'Available', image: '/images/hero1.jpg' },
  ]

  // Close modals with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSearchQuery('')
        setCartOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (searchOpen || cartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [searchOpen, cartOpen])

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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <span 
              className="text-xl font-black tracking-tight text-white group-hover:scale-105 transition-transform"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              Stray4m
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 lg:gap-10">ss
            <a href="#" className="relative text-sm font-bold text-white uppercase tracking-wider transition-colors group">
              HOME
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white" />
            </a>

            <div className="relative group/shop">
              <button className="flex items-center gap-1 text-sm font-bold text-white uppercase tracking-wider hover:text-neutral-400 transition-colors">
                SHOP
                <ChevronDown size={14} className="group-hover/shop:rotate-180 transition-transform" />
              </button>
              
              <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover/shop:opacity-100 group-hover/shop:visible transition-all duration-200">
                <div className="bg-[#111111] border border-neutral-800 min-w-[220px] py-2 shadow-2xl">
                 <Link href="/shop" className="flex items-center gap-1 text-sm font-bold text-white uppercase tracking-wider hover:text-neutral-400 transition-colors">
                  SHOP
                  <ChevronDown size={14} />
                </Link>
                  <a href="#" className="block px-5 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors uppercase tracking-wider">
                    New Arrivals
                  </a>
                  <a href="#" className="block px-5 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors uppercase tracking-wider">
                    Best Sellers
                  </a>
                  <a href="#" className="block px-5 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors uppercase tracking-wider">
                    Sale
                  </a>
                </div>
              </div>
            </div>

            <a href="#collections" className="text-sm font-bold text-white uppercase tracking-wider hover:text-neutral-400 transition-colors">
              FUNDA®
            </a>
            <a href="#" className="text-sm font-bold text-white uppercase tracking-wider hover:text-neutral-400 transition-colors">
              SIZE CHART
            </a>
            <a href="#contact" className="text-sm font-bold text-white uppercase tracking-wider hover:text-neutral-400 transition-colors">
              CONTACT US
            </a>
            <a href="#about" className="text-sm font-bold text-white uppercase tracking-wider hover:text-neutral-400 transition-colors">
              ABOUT US
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-neutral-900 rounded-full transition-colors"
              aria-label="Open search"
            >
              <Search size={18} />
            </button>
            <button 
              onClick={() => setCartOpen(true)}
              className="p-2 hover:bg-neutral-900 rounded-full transition-colors relative"
              aria-label="Open cart"
            >
              <ShoppingBag size={18} />
              {cartTotalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartTotalItems}
                </span>
              )}
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
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-white bg-neutral-900 rounded-lg font-bold uppercase tracking-wider text-sm">
              HOME
            </a>
            <a href="#shop" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg font-bold uppercase tracking-wider text-sm transition-all">
              SHOP
            </a>
            <a href="#collections" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg font-bold uppercase tracking-wider text-sm transition-all">
              FUNDA®
            </a>
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg font-bold uppercase tracking-wider text-sm transition-all">
              SIZE CHART
            </a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg font-bold uppercase tracking-wider text-sm transition-all">
              CONTACT US
            </a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg font-bold uppercase tracking-wider text-sm transition-all">
              ABOUT US
            </a>
          </div>
        )}
      </nav>

      {/* SEARCH MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:px-6">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setSearchOpen(false)
              setSearchQuery('')
            }}
          />
          <div className="relative w-full max-w-2xl bg-[#111111] border border-neutral-800 shadow-2xl anim-fade-up">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-neutral-800">
              <Search size={22} className="text-neutral-500 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-white placeholder-neutral-600 focus:outline-none text-base"
              />
              <button
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery('')
                }}
                className="p-2 text-neutral-500 hover:text-white transition-colors"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {searchQuery === '' ? (
                <div className="p-8 text-center">
                  <p className="text-neutral-500 text-sm mb-4 uppercase tracking-wider font-bold">Popular searches</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['STRAY 4M', 'Peso Dreams', 'Diamond Goals', 'Tee'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-bold uppercase tracking-wider hover:border-white hover:text-white transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="p-2">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        addToCart(product)
                        setSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="w-full flex items-center gap-4 p-4 hover:bg-neutral-900 transition-colors group text-left"
                    >
                      <div className="w-16 h-16 bg-neutral-900 flex-shrink-0 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white group-hover:text-neutral-400 transition-colors">
                          {product.name}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">{formatPrice(product.price)}</p>
                      </div>
                      <ArrowRight size={16} className="text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-neutral-900 rounded-full flex items-center justify-center">
                    <Search size={24} className="text-neutral-600" />
                  </div>
                  <p className="text-white font-bold mb-2">No results found</p>
                  <p className="text-neutral-500 text-sm">Walang nahanap para sa "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CART SIDEBAR */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />

          {/* Cart Panel */}
          <div className="absolute top-0 right-0 h-full w-full max-w-md bg-[#0A0A0A] border-l border-neutral-900 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-900">
              <h2 className="text-lg font-black uppercase tracking-wider">Cart</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 text-neutral-500 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <div className="w-20 h-20 mb-4 bg-neutral-900 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-neutral-700" />
                  </div>
                  <p className="text-white font-bold mb-2">Your cart is empty</p>
                  <p className="text-neutral-500 text-sm mb-6">Wala pang laman ang cart mo.</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-neutral-900/50 p-4 border border-neutral-900">
                      <div className="w-20 h-20 bg-neutral-900 flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold mb-1 truncate">{item.name}</h3>
                        <p className="text-sm text-neutral-400 mb-3">{formatPrice(item.price)}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-neutral-800">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1.5 hover:bg-neutral-800 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 text-sm font-bold tabular-nums">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1.5 hover:bg-neutral-800 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-neutral-900 p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="font-bold">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Shipping</span>
                  <span className="font-bold text-neutral-400">
                    {cartSubtotal >= 2000 ? 'FREE' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="border-t border-neutral-900 pt-4 flex justify-between">
                  <span className="text-base font-bold uppercase tracking-wider">Total</span>
                  <span className="text-base font-black">{formatPrice(cartSubtotal)}</span>
                </div>
                <button
                  onClick={() => alert('Checkout functionality coming soon!')}
                  className="w-full bg-white text-black py-4 font-bold text-sm uppercase tracking-wider hover:bg-neutral-200 transition-all"
                >
                  Checkout
                </button>
                <p className="text-[10px] text-neutral-600 text-center uppercase tracking-wider">
                  Cash on Delivery available
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HERO - Auto Rotating Slider with Animated Words */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-black">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide ${i === currentSlide ? 'active' : ''}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent pointer-events-none" />

        <div className="absolute inset-0 flex items-end pb-24 px-6 sm:px-12 z-10 pointer-events-none">
          <div className="max-w-7xl mx-auto w-full">
            <div key={currentSlide} className="max-w-3xl anim-fade-up">
              <p className="text-xs font-bold text-neutral-300 uppercase tracking-[0.3em] mb-3">
                New Collection 2026
              </p>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-3 text-white">
                <AnimatedWord text={heroSlides[currentSlide].title} />
              </h1>
              <h2 
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-6 text-white"
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400 }}
              >
                <AnimatedWord text={heroSlides[currentSlide].subtitle} />.
              </h2>
              <p className="text-neutral-300 text-sm sm:text-base mb-6 max-w-md">
                Chasing dreams, not crowds. Premium streetwear para sa mga taong may pangarap.
              </p>
              <div className="flex flex-wrap gap-3 pointer-events-auto">
                <a 
                  href="#shop" 
                  className="group bg-white text-black px-6 sm:px-8 py-3 sm:py-4 font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2"
                >
                  Shop Collection
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="#lookbook" 
                  className="bg-transparent border border-white/40 text-white px-6 sm:px-8 py-3 sm:py-4 font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all backdrop-blur-sm"
                >
                  View Lookbook
                </a>
              </div>
            </div>
          </div>
        </div>

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
              {heroSlides.map((_, i) => (
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
              {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
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
                className={`group anim-fade-up delay-${(i + 1) * 100}`}
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
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-0 left-0 right-0 bg-white text-black py-3 text-center text-xs font-bold uppercase tracking-wider translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-neutral-200"
                  >
                    Add to Cart
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1 group-hover:text-neutral-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-neutral-500">{formatPrice(product.price)}</p>
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

      {/* LOOKBOOK */}
      <section id="lookbook" className="relative py-20 px-6 bg-neutral-200 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <img src="/images/stray4m-ring.jpg" alt="" className="floating-ring ring-anim-1 mix-blend-multiply" style={{ top: '5%', left: '3%', width: '120px', height: '120px' }} />
          <img src="/images/stray4m-ring.jpg" alt="" className="floating-ring ring-anim-2 mix-blend-multiply" style={{ top: '15%', right: '5%', width: '150px', height: '150px' }} />
          <img src="/images/stray4m-ring.jpg" alt="" className="floating-ring ring-anim-3 mix-blend-multiply" style={{ bottom: '20%', left: '8%', width: '100px', height: '100px' }} />
          <img src="/images/stray4m-ring.jpg" alt="" className="floating-ring ring-anim-4 mix-blend-multiply" style={{ bottom: '10%', right: '10%', width: '140px', height: '140px' }} />
          <img src="/images/stray4m-ring.jpg" alt="" className="floating-ring ring-anim-1 mix-blend-multiply" style={{ top: '45%', left: '45%', width: '90px', height: '90px', animationDelay: '0.7s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-bold text-neutral-600 uppercase tracking-[0.3em] mb-2">
                Lookbook
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900">
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
            STRAY4FM was born from the streets, built for dreamers. Para sa mga taong
            hindi sumusunod sa uso — sila ang gumagawa ng sariling landas.
            <br /><br />
            <strong className="text-white">From Broke to Bling.</strong> Hindi lang ito damit. Ito ay mindset.
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
                className="text-2xl font-black mb-4 text-white hover:scale-105 transition-transform inline-block"
                style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              >
                Stray4m
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