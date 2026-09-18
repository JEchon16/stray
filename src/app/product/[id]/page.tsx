'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight,
  Plus, Minus, Trash2, X
} from 'lucide-react'

// ⚠️ Dapat pareho ito sa shop page products
const products = [
  { 
    id: 1, 
    name: 'Nostal Manila Tee', 
    price: 899, 
    category: 'Tees', 
    badge: 'New', 
    soldOut: false,
    images: [
      '/images/products/black-tee-front.jpg',
      '/images/products/black-tee-back.jpg',
      '/images/products/size-chart.jpg',
    ],
    description: 'Premium black tee na may Nostal Manila design. "Life from tha blocks."',
  },
]

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number(params.id)
  const product = products.find(p => p.id === productId)

  const [currentImage, setCurrentImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('M')
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/shop" className="text-black underline">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  const addToCart = () => {
    if (product.soldOut) return
    
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id)
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prevCart, {
        id: product.id,
        name: `${product.name} (${selectedSize})`,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
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

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  return (
    <div className="min-h-screen bg-white text-black">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/shop" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] hover:text-neutral-500 transition-colors">
            <ArrowLeft size={16} />
            BACK
          </Link>

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

      {/* PRODUCT DETAIL */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-white overflow-hidden mb-4">
              <img
                src={product.images[currentImage]}
                alt={`${product.name} - ${currentImage + 1}`}
                className="w-full h-full object-contain"
              />

              {/* Prev/Next Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full hover:bg-white transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-2 rounded-full hover:bg-white transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em]">
                  {product.badge}
                </div>
              )}

              {product.soldOut && (
                <div className="absolute top-4 right-4 bg-white border border-neutral-300 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700">
                  Sold out
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-20 h-20 bg-neutral-50 overflow-hidden transition-all ${
                    currentImage === i ? 'border-2 border-black' : 'border border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="md:pt-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              {product.name}
            </h1>

            <p className="text-2xl font-bold mb-6">
              {formatPrice(product.price)}
            </p>

            <p className="text-neutral-600 text-sm leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-[0.15em] mb-3">
                Size
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 text-xs font-bold uppercase transition-all ${
                      selectedSize === size
                        ? 'bg-black text-white'
                        : 'bg-white text-black border border-neutral-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-[0.15em] mb-3">
                Quantity
              </label>
              <div className="inline-flex items-center border border-neutral-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-neutral-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 text-base font-bold tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-neutral-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={addToCart}
              disabled={product.soldOut}
              className={`w-full py-5 font-bold text-xs uppercase tracking-[0.2em] transition-all ${
                product.soldOut
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-neutral-800'
              }`}
            >
              {product.soldOut ? 'Sold Out' : 'Add to Cart'}
            </button>

            {/* Info */}
            <div className="mt-8 pt-8 border-t border-neutral-200 space-y-3 text-xs text-neutral-500">
              <p>✓ Free shipping on orders over ₱2,000</p>
              <p>✓ Cash on Delivery available</p>
              <p>✓ 7-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* CART SIDEBAR */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100]">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Cart</h2>
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
                    <ShoppingBag size={32} strokeWidth={1} className="text-neutral-300" />
                  </div>
                  <p className="text-black text-sm font-bold uppercase tracking-[0.15em] mb-2">Your cart is empty</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-4 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-[0.15em]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b border-neutral-100 pb-4">
                      <div className="w-20 h-20 bg-neutral-50 flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold mb-1 text-black uppercase tracking-[0.1em]">{item.name}</h3>
                        <p className="text-xs text-neutral-500 mb-3">{formatPrice(item.price)}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-neutral-200">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-neutral-100">
                              <Minus size={12} />
                            </button>
                            <span className="px-3 text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:bg-neutral-100">
                              <Plus size={12} />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="p-2 text-neutral-400 hover:text-red-500">
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
                  <span className="text-neutral-500 uppercase tracking-[0.1em]">Subtotal</span>
                  <span className="font-bold">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3 flex justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.15em]">Total</span>
                  <span className="text-sm font-black">{formatPrice(cartSubtotal)}</span>
                </div>
                <button
                  onClick={() => alert('Checkout coming soon!')}
                  className="w-full bg-black text-white py-4 font-bold text-xs uppercase tracking-[0.15em] hover:bg-neutral-800 transition-all"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}