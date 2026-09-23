// src/components/navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Search, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Product } from '@/lib/types'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [cartCount, setCartCount] = useState(0)

  const supabase = createClient()

  // Fetch products for search
  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*')
      if (data) setProducts(data as Product[])
    }
    fetchProducts()
  }, [])

  // Read cart count from localStorage
  useEffect(() => {
    function updateCartCount() {
      try {
        const saved = localStorage.getItem('nostalmanila-cart')
        if (saved) {
          const cart = JSON.parse(saved)
          const count = cart.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          )
          setCartCount(count)
        } else {
          setCartCount(0)
        }
      } catch {
        setCartCount(0)
      }
    }

    updateCartCount()

    // Listen to cart updates
    window.addEventListener('storage', updateCartCount)
    window.addEventListener('cart-updated', updateCartCount)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cart-updated', updateCartCount)
    }
  }, [])

  // Close search on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  // Prevent body scroll when modal open
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [searchOpen])

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/shop', label: 'SHOP' },
    { href: '/about', label: 'ABOUT' },
    { href: '/contact', label: 'CONTACT' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const filteredProducts = searchQuery.trim()
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        )
      })
    : []

  function formatPrice(price: number) {
    return '₱' + Number(price).toLocaleString('en-PH')
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Left: Menu (mobile) + Nav links (desktop) */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -ml-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
                    isActive(link.href)
                      ? 'text-black border-b border-black pb-0.5'
                      : 'text-black hover:text-neutral-500'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Center: Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <img
              src="/images/nostal-manila-logo.jpg"
              alt="Nostal Manila"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Right: Icons */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Open search"
            >
              <Search size={18} />
            </button>

            {/* User */}
            <button
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Account"
            >
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* Cart */}
            <Link
              href="/shop"
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-100 bg-white px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg font-bold uppercase tracking-wider text-xs transition-all ${
                  isActive(link.href)
                    ? 'text-black bg-neutral-100'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ============================================ */}
      {/* SEARCH MODAL */}
      {/* ============================================ */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setSearchOpen(false)
              setSearchQuery('')
            }}
          />

          <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-neutral-100">
              <Search size={20} className="text-neutral-400 flex-shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-black text-base placeholder-neutral-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery('')
                }}
                className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {searchQuery === '' ? (
                <div className="p-6 sm:p-8 text-center">
                  <p className="text-xs text-neutral-400 uppercase tracking-[0.2em]">
                    Type to search products
                  </p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div>
                  <div className="px-5 sm:px-6 py-3 border-b border-neutral-100 bg-neutral-50">
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
                      {filteredProducts.length} result
                      {filteredProducts.length !== 1 ? 's' : ''} para sa "
                      {searchQuery}"
                    </p>
                  </div>

                  <div className="p-2">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={() => {
                          setSearchOpen(false)
                          setSearchQuery('')
                        }}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors group"
                      >
                        <div className="w-16 h-16 bg-neutral-50 rounded-lg flex-shrink-0 overflow-hidden">
                          <img
                            src={product.image_front}
                            alt={product.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-black mb-0.5 truncate uppercase tracking-[0.05em]">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-[0.15em] mb-1">
                            {product.category}
                          </p>
                          <p className="text-sm font-bold text-black">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-neutral-50 rounded-full flex items-center justify-center">
                    <Search size={24} className="text-neutral-300" />
                  </div>
                  <p className="text-sm font-bold text-black mb-2">
                    Walang nahanap
                  </p>
                  <p className="text-xs text-neutral-500">
                    Walang results para sa "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}