// src/app/product/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShoppingBag,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  X,
  ZoomIn,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useCart } from '@/lib/cart-context'
import SizeChartModal from '@/components/size-chart-modal'
import type { Product } from '@/lib/types'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    cartTotalItems,
    cartSubtotal,
  } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [currentImage, setCurrentImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('M')
  const [cartOpen, setCartOpen] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [sizeChartOpen, setSizeChartOpen] = useState(false)
  const [added, setAdded] = useState(false)

  const supabase = createClient()

  // Fetch product from DB
  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error || !data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setProduct(data as Product)
      setLoading(false)
    }

    if (productId) fetchProduct()
  }, [productId])

  // Build image gallery — FRONT + BACK + CHART (fallback to global chart)
  const chartSrc = product?.image_chart || '/images/products/chart.jpg'

  const images = product
    ? [
        { type: 'front', src: product.image_front, label: 'Front' },
        ...(product.image_back
          ? [{ type: 'back', src: product.image_back, label: 'Back' }]
          : []),
        { type: 'chart', src: chartSrc, label: 'Size Chart' },
      ]
    : []

  function nextImage() {
    if (images.length === 0) return
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  function prevImage() {
    if (images.length === 0) return
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  function handleAddToCart() {
    if (!product || product.sold_out) return

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_front,
      size: selectedSize,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    setCartOpen(true)
  }

  function formatPrice(price: number) {
    return '₱' + price.toLocaleString('en-PH')
  }

  // ============================================
  // LOADING
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  // ============================================
  // NOT FOUND
  // ============================================
  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-black mb-4">Product not found</h1>
        <Link href="/shop" className="text-sm underline hover:no-underline">
          Back to Shop
        </Link>
      </div>
    )
  }

  // ============================================
  // MAIN
  // ============================================
  return (
    <div className="min-h-screen bg-white text-black">
      {/* ============================================ */}
      {/* NAVBAR */}
      {/* ============================================ */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] hover:text-neutral-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <span
              className="text-2xl font-black tracking-tight text-black"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              NostalManila
            </span>
          </Link>

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
      </nav>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* ============================================ */}
          {/* LEFT: IMAGE GALLERY */}
          {/* ============================================ */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden group">
              {/* Badge */}
              {product.badge && !product.sold_out && (
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] z-10">
                  {product.badge}
                </div>
              )}
              {product.sold_out && (
                <div className="absolute top-4 right-4 bg-white border border-neutral-200 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 z-10">
                  Sold Out
                </div>
              )}

              {/* Current Image */}
              <button
                onClick={() => setImageModalOpen(true)}
                className="w-full h-full cursor-zoom-in"
              >
                <img
                  src={images[currentImage]?.src}
                  alt={`${product.name} - ${images[currentImage]?.label}`}
                  className="w-full h-full object-contain p-8"
                />
              </button>

              {/* Zoom Hint */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-neutral-200 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <ZoomIn size={14} className="text-neutral-600" />
              </div>

              {/* Left Arrow */}
              {images.length > 1 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm border border-neutral-200 hover:bg-white transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              {/* Right Arrow */}
              {images.length > 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm border border-neutral-200 hover:bg-white transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`relative w-20 h-20 overflow-hidden transition-all ${
                      i === currentImage
                        ? 'border border-black'
                        : 'border border-transparent hover:border-neutral-300'
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.label}
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ============================================ */}
          {/* RIGHT: PRODUCT INFO */}
          {/* ============================================ */}
          <div className="lg:py-4">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-2xl font-bold mb-6">
              {formatPrice(product.price)}
            </p>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-neutral-600 leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">
                  Size
                </p>
                <button
                  onClick={() => setSizeChartOpen(true)}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-black underline underline-offset-4 transition-colors"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[52px] px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] border transition-all ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-neutral-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 mb-3">
                Quantity
              </p>
              <div className="inline-flex items-center border border-neutral-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-neutral-100 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-6 text-sm font-bold tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 hover:bg-neutral-100 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.sold_out}
              className={`w-full py-5 text-xs font-bold uppercase tracking-[0.3em] transition-all mb-8 ${
                product.sold_out
                  ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  : added
                  ? 'bg-green-600 text-white'
                  : 'bg-black text-white hover:bg-neutral-800'
              }`}
            >
              {product.sold_out
                ? 'Sold Out'
                : added
                ? '✓ Added to Cart'
                : 'Add to Cart'}
            </button>

            {/* Features */}
            <div className="space-y-2 pt-6 border-t border-neutral-100">
              <div className="flex items-center gap-3 text-xs text-neutral-600">
                <span>✓</span>
                <span>Free shipping on orders over ₱2,000</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-600">
                <span>✓</span>
                <span>Cash on Delivery available</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-600">
                <span>✓</span>
                <span>7-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* IMAGE MODAL (fullscreen) */}
      {/* ============================================ */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <button
            onClick={() => setImageModalOpen(false)}
            className="absolute top-6 right-6 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/10 rounded-full transition-colors z-10"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <img
            src={images[currentImage]?.src}
            alt={product.name}
            className="max-w-full max-h-full object-contain p-12"
          />

          {/* Image indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-xs font-bold uppercase tracking-[0.2em]">
            {currentImage + 1} / {images.length} — {images[currentImage]?.label}
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* SIZE CHART MODAL */}
      {/* ============================================ */}
      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        chartImage={chartSrc}
      />

      {/* ============================================ */}
      {/* CART SIDEBAR */}
      {/* ============================================ */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">
                Cart
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 text-neutral-400 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
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
                  <p className="text-sm font-bold uppercase tracking-[0.15em] mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-xs text-neutral-500 mb-6">
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
                      key={`${item.id}-${item.size}`}
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
                        <h3 className="text-xs font-bold mb-1 truncate uppercase tracking-[0.1em]">
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
                              onClick={() =>
                                updateQuantity(item.id, item.size, -1)
                              }
                              className="p-1.5 hover:bg-neutral-100 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.size, 1)
                              }
                              className="p-1.5 hover:bg-neutral-100 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
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

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-neutral-200 p-6 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500 uppercase tracking-[0.1em]">
                    Subtotal
                  </span>
                  <span className="font-bold">{formatPrice(cartSubtotal)}</span>
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
                  <span className="text-xs font-bold uppercase tracking-[0.15em]">
                    Total
                  </span>
                  <span className="text-sm font-black">
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