// src/app/checkout/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Upload,
  Check,
} from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { createOrder } from '@/lib/orders'
import { uploadGcashProof } from '@/lib/upload'
import { createClient } from '@/lib/supabase'

const GCASH_NUMBER = '0993-264-8558'
const GCASH_NAME = 'Jeffmark Ganoza'
const FREE_SHIPPING_THRESHOLD = 2000
const SHIPPING_FEE = 500

export default function CheckoutPage() {
  const router = useRouter()
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    clearCart,
  } = useCart()

  const supabase = createClient()

  // Auth state
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // Form state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [notes, setNotes] = useState('')

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'gcash'>('cod')
  const [gcashReference, setGcashReference] = useState('')
  const [gcashProof, setGcashProof] = useState<File | null>(null)
  const [gcashProofPreview, setGcashProofPreview] = useState('')

  // ============================================
  // CHECK AUTH
  // ============================================
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login?redirect=/checkout')
        return
      }

      setUserId(user.id)

      // Auto-fill email
      if (user.email) setEmail(user.email)

      // Auto-fill name kung meron sa metadata
      const fullNameMeta = user.user_metadata?.full_name
      if (fullNameMeta) setFullName(fullNameMeta)

      setCheckingAuth(false)
    }

    checkAuth()
  }, [router, supabase])

  // ============================================
  // SHIPPING FEE LOGIC
  // ============================================
  const shippingFee =
    cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = cartSubtotal + shippingFee

  function formatPrice(price: number) {
    return '₱' + price.toLocaleString('en-PH')
  }

  function handleGcashProofChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setGcashProof(file)
      setGcashProofPreview(URL.createObjectURL(file))
    }
  }

  // ============================================
  // SUBMIT ORDER
  // ============================================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (cart.length === 0) {
      setError('Walang laman ang cart mo.')
      return
    }

    if (!fullName || !email || !phone || !address || !city || !province) {
      setError('Please fill in all required fields.')
      return
    }

    if (paymentMethod === 'gcash') {
      if (!gcashReference || !gcashProof) {
        setError(
          'Please enter GCash reference number and upload proof of payment.'
        )
        return
      }
    }

    setLoading(true)

    try {
      let gcashProofUrl: string | null = null

      // Upload GCash proof if needed
      if (paymentMethod === 'gcash' && gcashProof) {
        const uploadResult = await uploadGcashProof(
          gcashProof,
          `gcash-proof-${Date.now()}`
        )

        if (uploadResult.error || !uploadResult.url) {
          setError(`GCash proof upload failed: ${uploadResult.error}`)
          setLoading(false)
          return
        }
        gcashProofUrl = uploadResult.url
      }

      // Create order
     const result = await createOrder({
  customer_name: fullName,
  customer_email: email,
  customer_phone: phone,
  shipping_address: `...`,
  payment_method: paymentMethod,
  gcash_reference: paymentMethod === 'gcash' ? gcashReference : null,
  gcash_proof_url: gcashProofUrl,
  notes: notes || null,
  items: cart.map((item) => ({
    product_id: item.id,
    product_name: item.name,
    product_price: item.price,
    product_image: item.image,
    size: item.size,
    quantity: item.quantity,
  })),
  shipping_fee: shippingFee,
  customer_id: userId,   // ← ✅ DAPAT MERON NA 'TO
})

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      // Clear cart
      clearCart()

      // Redirect to confirmation
      router.push(`/order/${result.order.order_number}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setLoading(false)
    }
  }

  // ============================================
  // LOADING STATE
  // ============================================
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  // ============================================
  // EMPTY CART STATE
  // ============================================
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
          <ShoppingBag size={32} strokeWidth={1} className="text-neutral-300" />
        </div>
        <h1 className="text-2xl font-black mb-3">Walang laman ang cart</h1>
        <p className="text-sm text-neutral-500 mb-8">
          Mag-add ka muna ng products bago mag-checkout.
        </p>
        <Link
          href="/shop"
          className="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all"
        >
          Back to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/shop"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] hover:text-neutral-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Shop
          </Link>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <img
              src="/images/nostal-manila-logo.jpg"
              alt="Nostal Manila"
              className="h-8 w-auto object-contain"
            />
          </Link>

          <div className="w-24" />
        </div>
      </nav>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
            Almost there
          </p>
          <h1 className="text-4xl font-black tracking-tight">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* ============================================ */}
            {/* LEFT: FORM */}
            {/* ============================================ */}
            <div className="lg:col-span-2 space-y-10">
              {/* CONTACT INFO */}
              <section>
                <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-5">
                  Contact Information
                </h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors"
                        placeholder="Juan Dela Cruz"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors"
                        placeholder="juan@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors"
                      placeholder="0917-XXX-XXXX"
                    />
                  </div>
                </div>
              </section>

              {/* SHIPPING ADDRESS */}
              <section>
                <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-5">
                  Shipping Address
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors"
                      placeholder="House #, Street, Barangay"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors"
                        placeholder="Quezon City"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                        Province <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        required
                        className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors"
                        placeholder="Metro Manila"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors"
                        placeholder="1100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors resize-none"
                      placeholder="Landmark, delivery instructions, etc."
                    />
                  </div>
                </div>
              </section>

              {/* PAYMENT METHOD */}
              <section>
                <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-5">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`w-full flex items-center gap-4 p-5 border-2 transition-all text-left ${
                      paymentMethod === 'cod'
                        ? 'border-black bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === 'cod'
                          ? 'border-black'
                          : 'border-neutral-300'
                      }`}
                    >
                      {paymentMethod === 'cod' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold uppercase tracking-[0.15em] mb-1">
                        Cash on Delivery
                      </p>
                      <p className="text-xs text-neutral-500">
                        Bayaran pagdating ng order
                      </p>
                    </div>
                  </button>

                  {/* GCash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('gcash')}
                    className={`w-full flex items-center gap-4 p-5 border-2 transition-all text-left ${
                      paymentMethod === 'gcash'
                        ? 'border-black bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === 'gcash'
                          ? 'border-black'
                          : 'border-neutral-300'
                      }`}
                    >
                      {paymentMethod === 'gcash' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold uppercase tracking-[0.15em] mb-1">
                        GCash
                      </p>
                      <p className="text-xs text-neutral-500">
                        Send payment sa GCash number
                      </p>
                    </div>
                  </button>
                </div>

                {/* GCash Details */}
                {paymentMethod === 'gcash' && (
                  <div className="mt-6 p-6 bg-neutral-50 border border-neutral-200 space-y-5">
                    <div className="p-5 bg-white border border-neutral-200">
                      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-3">
                        Send Payment To:
                      </p>
                      <p className="text-xl font-black mb-1">{GCASH_NUMBER}</p>
                      <p className="text-xs text-neutral-500">
                        Account Name: {GCASH_NAME}
                      </p>
                      <p className="text-xs text-neutral-600 mt-3">
                        Amount to send:{' '}
                        <strong>{formatPrice(total)}</strong>
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                        GCash Reference Number{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={gcashReference}
                        onChange={(e) => setGcashReference(e.target.value)}
                        className="w-full px-5 py-4 bg-white border border-neutral-200 text-black text-sm focus:outline-none focus:border-black transition-colors font-mono"
                        placeholder="0000 0000 0000"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-3">
                        Upload Proof of Payment{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative border-2 border-dashed border-neutral-300 hover:border-black transition-colors">
                        {gcashProofPreview ? (
                          <div className="relative">
                            <img
                              src={gcashProofPreview}
                              alt="Proof"
                              className="w-full max-h-64 object-contain p-4"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setGcashProof(null)
                                setGcashProofPreview('')
                              }}
                              className="absolute top-2 right-2 p-2 bg-black text-white rounded-full hover:bg-neutral-800 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12">
                            <Upload
                              size={24}
                              className="text-neutral-400 mb-3"
                            />
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-600 mb-1">
                              Click to upload
                            </p>
                            <p className="text-[10px] text-neutral-400">
                              Screenshot ng GCash transaction
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleGcashProofChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* ============================================ */}
            {/* RIGHT: ORDER SUMMARY */}
            {/* ============================================ */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-neutral-50 border border-neutral-200 p-6">
                <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-5">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-3">
                      <div className="w-16 h-16 bg-white border border-neutral-200 flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate uppercase tracking-[0.1em] mb-0.5">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-[0.15em] mb-1">
                          Size: {item.size} × {item.quantity}
                        </p>
                        <p className="text-xs font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-5 border-t border-neutral-200">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500 uppercase tracking-[0.1em]">
                      Subtotal
                    </span>
                    <span className="font-bold">
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500 uppercase tracking-[0.1em]">
                      Shipping
                    </span>
                    <span className="font-bold">
                      {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-neutral-200">
                    <span className="text-xs font-bold uppercase tracking-[0.15em]">
                      Total
                    </span>
                    <span className="text-lg font-black">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mt-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-xs">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-5 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Placing order...' : 'Place Order'}
                </button>

                <p className="text-[10px] text-neutral-500 text-center mt-4 leading-relaxed">
                  Sa pag-place ng order, sumasang-ayon ka sa aming{' '}
                  <a href="#" className="underline">
                    Terms
                  </a>{' '}
                  at{' '}
                  <a href="#" className="underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}