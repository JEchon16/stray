// src/app/account/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  ShoppingBag,
  LogOut,
  Mail,
  Package,
  Calendar,
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Order } from '@/lib/types'

export default function AccountPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])

  // ============================================
  // CHECK AUTH + FETCH USER + ORDERS
  // ============================================
  useEffect(() => {
    async function loadData() {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login?redirect=/account')
        return
      }

      setUser(user)

      // Fetch orders ng customer
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

      if (ordersData) setOrders(ordersData as Order[])

      setLoading(false)
    }

    loadData()
  }, [router, supabase])

  // ============================================
  // SIGN OUT
  // ============================================
  async function handleSignOut() {
    setSigningOut(true)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  function formatPrice(price: number) {
    return '₱' + Number(price).toLocaleString('en-PH')
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200'
    }
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

  if (!user) return null

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

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <img
              src="/images/nostal-manila-logo.jpg"
              alt="Nostal Manila"
              className="h-8 w-auto object-contain"
            />
          </Link>

          <div className="w-20" />
        </div>
      </nav>

      {/* MAIN */}
      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-16">
        {/* HEADER */}
        <div className="mb-12">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] mb-3">
            My Account
          </p>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Kumusta, {user.user_metadata?.full_name?.split(' ')[0] || 'Customer'}!
          </h1>
          <p className="text-sm text-neutral-500">
            Manage your account and view your orders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: PROFILE */}
          <div className="lg:col-span-1">
            <div className="border border-neutral-200 p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-black flex-shrink-0">
                  {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() ||
                    user.email?.charAt(0)?.toUpperCase() ||
                    'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">
                    {user.user_metadata?.full_name || 'Customer'}
                  </p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-[0.15em]">
                    Member since {formatDate(user.created_at)}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">
                    Full Name
                  </p>
                  <p className="text-sm">
                    {user.user_metadata?.full_name || 'Not set'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">
                    Email
                  </p>
                  <p className="text-sm break-all">{user.email}</p>
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 border border-red-200 hover:bg-red-50 transition-all disabled:opacity-50"
              >
                <LogOut size={14} />
                {signingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>

          {/* RIGHT: ORDERS */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Package size={18} />
                <h2 className="text-sm font-black uppercase tracking-[0.15em]">
                  My Orders
                </h2>
              </div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]">
                {orders.length} order{orders.length !== 1 ? 's' : ''}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="border border-neutral-200 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                  <ShoppingBag
                    size={28}
                    strokeWidth={1.5}
                    className="text-neutral-400"
                  />
                </div>
                <p className="text-sm font-bold mb-2">Wala pang orders</p>
                <p className="text-xs text-neutral-500 mb-6">
                  Start shopping para makita mo orders mo dito.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.15em] hover:bg-neutral-800 transition-all"
                >
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/order/${order.order_number}`}
                    className="group block border border-neutral-200 hover:border-black p-6 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                      <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">
                          Order Number
                        </p>
                        <p className="font-mono text-sm font-bold">
                          {order.order_number}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Date + Total */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Calendar size={14} />
                        {formatDate(order.created_at)}
                      </div>
                      <p className="text-sm font-black">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}