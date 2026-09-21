// src/app/shop/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Search, Menu, X, Plus, Minus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Product } from '@/lib/types'

// Cart Item Type
interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  quantity: number
}

export default function ShopPage() {
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setProducts(data as Product[])
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const categories = ['All', 'Tees', 'Jackets', 'Pants', 'Shorts', 'Accessories']

  const filteredProducts =
    activeFilter === 'All'
      ? products
      : products.filter((p) => p.category === activeFilter)

  // Cart Functions
  const addToCart = (product: Product) => {
    if (product.sold_out) return

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id)
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_front,
          size: 'M', // default size
          quantity: 1,
        },
      ]
    })
    setCartOpen(true)
  }

  const updateQuantity = (id: string, change: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    )
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const formatPrice = (price: number) => {
    return '₱' + price.toLocaleString('en-PH')
  }

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Left: Menu */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/home"
                className="text-xs font-bold uppercase tracking-[0.15em] hover:text-neutral-500 transition-colors"
              >
                HOME
              </Link>
              <Link
                href="/shop"
                className="text-xs font-bold uppercase tracking-[0.15em] border-b border-black pb-0.5"
              >
                SHOP
              </Link>
              <a
                href="#about"
                className="text-xs font-bold uppercase tracking-[0.15em] hover:text-neutral-500 transition-colors"
              >
                ABOUT
              </a>
              <a
                href="#contact"
                className="text-xs font-bold uppercase tracking-[0.15em] hover:text-neutral-500 transition-colors"
              >
                CONTACT
              </a>
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
            <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
              <Search size={18} />
            </button>
            <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
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
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors relative"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartTotalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartTotalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-6 py-4 space-y-1">
            <Link
              href="/home"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-black hover:bg-neutral-100 rounded-lg font-bold uppercase tracking-wider text-xs"
            >
              HOME
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-black bg-neutral-100 rounded-lg font-bold uppercase tracking-wider text-xs"
            >
              SHOP
            </Link>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg font-bold uppercase tracking-wider text-xs transition-all"
            >
              ABOUT
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg font-bold uppercase tracking-wider text-xs transition-all"
            >
              CONTACT
            </a>
          </div>
        )}
      </nav>

      {/* HERO TITLE */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.2em] mb-3 text-black">
            NEW COLLECTION
          </h1>
        </div>
      </section>

      {/* FILTER TABS */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`text-xs font-bold uppercase tracking-[0.2em] transition-all pb-1 ${
                activeFilter === cat
                  ? 'text-black border-b border-black'
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* LOADING STATE */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-20">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-neutral-100 mb-6" />
                  <div className="h-3 bg-neutral-100 mb-2 mx-auto w-32" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-20">
              {filteredProducts.map((product, i) => (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className={`group anim-fade-up delay-${(i + 1) * 100} cursor-pointer block`}
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden mb-6">
                    {/* Front Image */}
                    <img
                      src={product.image_front}
                      alt={product.name}
                      className={`absolute inset-0 w-full h-full object-contain transition-all duration-700 ${
                        product.sold_out
                          ? 'opacity-40'
                          : 'group-hover:opacity-0'
                      }`}
                    />

                    {/* Back Image - Shows on hover */}
                    {!product.sold_out && product.image_back && (
                      <img
                        src={product.image_back}
                        alt={`${product.name} - back`}
                        className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-all duration-700"
                      />
                    )}

                    {/* Sold Out Badge */}
                    {product.sold_out && (
                      <div className="absolute top-3 right-3 bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-700 z-10">
                        Sold out
                      </div>
                    )}

                    {/* New Badge */}
                    {product.badge && !product.sold_out && (
                      <div className="absolute top-3 left-3 bg-black text-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] z-10">
                        {product.badge}
                      </div>
                    )}
                  </div>

                  {/* Product Info - Name ↔ Price Swap */}
                  <div className="relative h-5 text-center overflow-hidden">
                    {!product.sold_out ? (
                      <>
                        <h3 className="text-xs font-medium text-black uppercase tracking-[0.1em] transition-all duration-500 absolute inset-0 flex items-center justify-center group-hover:opacity-0 group-hover:-translate-y-full">
                          {product.name}
                        </h3>

                        <p className="text-xs font-bold text-black uppercase tracking-[0.1em] transition-all duration-500 absolute inset-0 flex items-center justify-center opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0">
                          {formatPrice(product.price)}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs font-medium text-neutral-400 uppercase tracking-[0.1em] absolute inset-0 flex items-center justify-center">
                        Sold out
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-sm">
                {activeFilter === 'All'
                  ? 'Wala pang products. Mag-add ka sa admin panel.'
                  : `Walang products sa category na "${activeFilter}".`}
              </p>
            </div>
          )}
        </div>
      </section>

            {/* FOOTER */}
      <footer className="py-16 px-6 border-t border-neutral-200">
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
                Premium streetwear for the dreamers. Proudly Filipino.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="p-2 hover:bg-black hover:text-white transition-all"
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-2 hover:bg-black hover:text-white transition-all"
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-2 hover:bg-black hover:text-white transition-all"
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
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
                  <a href="#" className="hover:text-black transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-3">
              <p>© 2026 NOSTALMANILA. All rights reserved.</p>

              {/* Admin Access */}
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

      {/* CART SIDEBAR */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-black">
                Cart
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 text-neutral-400 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <div className="w-20 h-20 mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                    <ShoppingBag
                      size={32}
                      strokeWidth={1}
                      className="text-neutral-300"
                    />
                  </div>
                  <p className="text-black text-sm font-bold uppercase tracking-[0.15em] mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-neutral-500 text-xs mb-6">
                    Wala pang laman ang cart mo.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-neutral-100 pb-4"
                    >
                      <div className="w-20 h-20 bg-neutral-50 flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold mb-1 truncate text-black uppercase tracking-[0.1em]">
                          {item.name}
                        </h3>
                        <p className="text-[10px] text-neutral-500 mb-1 uppercase tracking-[0.15em]">
                          Size: {item.size}
                        </p>
                        <p className="text-xs text-neutral-500 mb-3">
                          {formatPrice(item.price)}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-neutral-200">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1.5 hover:bg-neutral-100 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1.5 hover:bg-neutral-100 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-neutral-200 p-6 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500 uppercase tracking-[0.1em]">
                    Subtotal
                  </span>
                  <span className="font-bold text-black">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500 uppercase tracking-[0.1em]">
                    Shipping
                  </span>
                  <span className="font-bold text-neutral-500">
                    {cartSubtotal >= 2000 ? 'FREE' : 'Calculated at checkout'}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-3 flex justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-black">
                    Total
                  </span>
                  <span className="text-sm font-black text-black">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full bg-black text-white py-4 text-center font-bold text-xs uppercase tracking-[0.15em] hover:bg-neutral-800 transition-all"
                >
                  Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}