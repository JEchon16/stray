// src/app/admin/(dashboard)/orders/[id]/page.tsx
'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { updateOrderStatus } from '@/lib/orders'
import type { Order, OrderItem } from '@/lib/types'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-950/40 text-yellow-400 border-yellow-900/40',
  confirmed: 'bg-blue-950/40 text-blue-400 border-blue-900/40',
  shipped: 'bg-purple-950/40 text-purple-400 border-purple-900/40',
  delivered: 'bg-green-950/40 text-green-400 border-green-900/40',
  cancelled: 'bg-red-950/40 text-red-400 border-red-900/40',
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true)
      const supabase = createClient()

      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()

      if (orderData) {
        setOrder(orderData as Order)
        setCurrentStatus(orderData.status)

        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', id)

        setItems((itemsData || []) as OrderItem[])
      }

      setLoading(false)
    }

    fetchOrder()
  }, [id])

  async function handleStatusUpdate() {
    if (!order || currentStatus === order.status) return

    setUpdating(true)
    const result = await updateOrderStatus(order.id, currentStatus)

    if (result.error) {
      alert(`Error: ${result.error}`)
      setUpdating(false)
      return
    }

    setOrder({ ...order, status: currentStatus as any })
    setSuccessMsg('Status updated successfully!')
    setTimeout(() => setSuccessMsg(''), 3000)
    setUpdating(false)
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
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Loading
  if (loading) {
    return (
      <div className="p-10">
        <div className="animate-pulse space-y-8">
          <div className="h-4 bg-neutral-900 w-32" />
          <div className="h-12 bg-neutral-900 w-64" />
        </div>
      </div>
    )
  }

  // Not found
  if (!order) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-black mb-4">Order not found</h1>
        <Link href="/admin/orders" className="text-sm underline">
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="p-10 max-w-5xl">
      {/* HEADER */}
      <div className="mb-12">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] hover:text-white transition-colors mb-6"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Orders
        </Link>

        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
              Order
            </p>
            <h1 className="text-4xl font-black tracking-tight font-mono mb-2">
              {order.order_number}
            </h1>
            <p className="text-sm text-neutral-500">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>

          <span
            className={`inline-block px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] border ${
              STATUS_COLORS[order.status] || STATUS_COLORS.pending
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* UPDATE STATUS */}
      <section className="mb-10 p-6 bg-[#0A0A0A] border border-neutral-900">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">
          Update Status
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value)}
            className="px-5 py-3 bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-white transition-colors min-w-[200px]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={updating || currentStatus === order.status}
            className="px-6 py-3 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? 'Updating...' : 'Update Status'}
          </button>
          {successMsg && (
            <span className="text-xs text-green-400">{successMsg}</span>
          )}
        </div>
      </section>

      {/* CUSTOMER INFO + SHIPPING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <section className="p-6 bg-[#0A0A0A] border border-neutral-900">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">
            Customer
          </p>
          <div className="space-y-2">
            <p className="text-sm font-bold">{order.customer_name}</p>
            <p className="text-xs text-neutral-400">{order.customer_email}</p>
            <p className="text-xs text-neutral-400">{order.customer_phone}</p>
          </div>
        </section>

        <section className="p-6 bg-[#0A0A0A] border border-neutral-900">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">
            Shipping Address
          </p>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {order.shipping_address}
          </p>
          {order.notes && (
            <>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mt-4 mb-2">
                Notes
              </p>
              <p className="text-xs text-neutral-400 italic">
                "{order.notes}"
              </p>
            </>
          )}
        </section>
      </div>

      {/* PAYMENT INFO */}
      <section className="mb-10 p-6 bg-[#0A0A0A] border border-neutral-900">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">
          Payment
        </p>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em] mb-1">
              Method
            </p>
            <p className="text-sm font-bold uppercase">
              {order.payment_method === 'cod' ? 'Cash on Delivery' : 'GCash'}
            </p>
          </div>
          {order.payment_method === 'gcash' && order.gcash_reference && (
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em] mb-1">
                Reference #
              </p>
              <p className="text-sm font-mono">{order.gcash_reference}</p>
            </div>
          )}
        </div>

        {/* GCash Proof */}
        {order.gcash_proof_url && (
          <div className="mt-6">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em] mb-3">
              Proof of Payment
            </p>
            <a
              href={order.gcash_proof_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-neutral-800 hover:border-white transition-colors"
            >
              <img
                src={order.gcash_proof_url}
                alt="GCash Proof"
                className="max-w-md max-h-96 object-contain"
              />
            </a>
            <p className="text-[10px] text-neutral-500 mt-2">
              Click image para i-view sa bagong tab
            </p>
          </div>
        )}
      </section>

      {/* ORDER ITEMS */}
      <section className="mb-10">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">
          Items ({items.length})
        </p>
        <div className="bg-[#0A0A0A] border border-neutral-900 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-900">
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Size
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Qty
                </th>
                <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-neutral-900 last:border-b-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-neutral-900 flex-shrink-0 overflow-hidden">
                        <img
                          src={item.product_image || ''}
                          alt={item.product_name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <span className="text-xs font-bold text-white">
                        {item.product_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-neutral-400">
                    {item.size}
                  </td>
                  <td className="px-6 py-4 text-xs text-neutral-400 tabular-nums">
                    {formatPrice(item.product_price)}
                  </td>
                  <td className="px-6 py-4 text-xs text-neutral-400 tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-white tabular-nums text-right">
                    {formatPrice(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TOTALS */}
      <section className="p-6 bg-[#0A0A0A] border border-neutral-900 space-y-2 max-w-md ml-auto">
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500 uppercase tracking-[0.1em]">
            Subtotal
          </span>
          <span className="font-bold text-white tabular-nums">
            {formatPrice(order.subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-500 uppercase tracking-[0.1em]">
            Shipping
          </span>
          <span className="font-bold text-white tabular-nums">
            {Number(order.shipping_fee) === 0
              ? 'FREE'
              : formatPrice(order.shipping_fee)}
          </span>
        </div>
        <div className="flex justify-between pt-3 border-t border-neutral-900">
          <span className="text-xs font-bold uppercase tracking-[0.15em]">
            Total
          </span>
          <span className="text-lg font-black text-white tabular-nums">
            {formatPrice(order.total)}
          </span>
        </div>
      </section>
    </div>
  )
}