// src/app/order/[id]/page.tsx
import Link from 'next/link'
import { CheckCircle, Package, CreditCard, MapPin } from 'lucide-react'
import { getOrderByNumber } from '@/lib/orders'

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { order, items, error } = await getOrderByNumber(id)

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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <h1 className="text-2xl font-black mb-4">Order not found</h1>
        <p className="text-sm text-neutral-500 mb-8">
          Hindi namin mahanap yung order na ito.
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
      <nav className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-center">
          <Link href="/">
            <span
              className="text-2xl font-black tracking-tight"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              NostalManila
            </span>
          </Link>
        </div>
      </nav>

      {/* MAIN */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Success Icon */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
            <CheckCircle size={40} className="text-green-600" strokeWidth={1.5} />
          </div>

          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
            Salamat!
          </p>
          <h1 className="text-3xl font-black tracking-tight mb-4">
            Order Received
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-md mx-auto">
            Natanggap na namin ang order mo. We'll send updates sa email mo.
          </p>
        </div>

        {/* Order Number */}
        <div className="bg-neutral-50 border border-neutral-200 p-6 mb-8 text-center">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-2">
            Order Number
          </p>
          <p className="text-2xl font-black font-mono mb-2">
            {order.order_number}
          </p>
          <p className="text-[10px] text-neutral-500">
            {formatDate(order.created_at)}
          </p>
        </div>

        {/* Status */}
        <div className="bg-yellow-50 border border-yellow-200 p-5 mb-8 flex items-start gap-3">
          <Package size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-yellow-800 mb-1">
              Status: {order.status.toUpperCase()}
            </p>
            <p className="text-xs text-yellow-700 leading-relaxed">
              {order.status === 'pending' &&
                'Hinihintay pa namin i-confirm ang order mo.'}
              {order.status === 'confirmed' &&
                'Na-confirm na ang order mo. Preparing for shipment.'}
              {order.status === 'shipped' &&
                'Naka-ship na ang order mo. On the way na!'}
              {order.status === 'delivered' &&
                'Na-deliver na ang order mo. Salamat!'}
              {order.status === 'cancelled' &&
                'Na-cancel ang order mo. Contact us if may questions.'}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <section className="mb-8">
          <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">
            Order Items
          </h2>
          <div className="border border-neutral-200 divide-y divide-neutral-200">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4">
                <div className="w-16 h-16 bg-neutral-50 flex-shrink-0 overflow-hidden">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] mb-1 truncate">
                    {item.product_name}
                  </p>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-[0.15em]">
                    Size: {item.size} × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Address */}
        <section className="mb-8">
          <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">
            Shipping Address
          </h2>
          <div className="border border-neutral-200 p-5 flex items-start gap-3">
            <MapPin size={18} className="text-neutral-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold mb-1">{order.customer_name}</p>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {order.shipping_address}
              </p>
              <p className="text-xs text-neutral-600 mt-2">
                {order.customer_phone}
              </p>
              <p className="text-xs text-neutral-600">
                {order.customer_email}
              </p>
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="mb-8">
          <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">
            Payment Method
          </h2>
          <div className="border border-neutral-200 p-5 flex items-start gap-3">
            <CreditCard size={18} className="text-neutral-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.15em] mb-1">
                {order.payment_method === 'cod' ? 'Cash on Delivery' : 'GCash'}
              </p>
              {order.payment_method === 'gcash' && order.gcash_reference && (
                <p className="text-xs text-neutral-600">
                  Ref #: {order.gcash_reference}
                </p>
              )}
              {order.payment_method === 'cod' && (
                <p className="text-xs text-neutral-600">
                  Bayaran pagdating ng order
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Totals */}
        <section className="mb-12">
          <div className="border border-neutral-200 p-5 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500 uppercase tracking-[0.1em]">
                Subtotal
              </span>
              <span className="font-bold">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500 uppercase tracking-[0.1em]">
                Shipping
              </span>
              <span className="font-bold">
                {Number(order.shipping_fee) === 0
                  ? 'FREE'
                  : formatPrice(order.shipping_fee)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-neutral-200">
              <span className="text-xs font-bold uppercase tracking-[0.15em]">
                Total
              </span>
              <span className="text-lg font-black">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/shop"
            className="flex-1 py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 py-4 border border-neutral-200 text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-50 transition-all text-center"
          >
            Back to Home
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-[10px] text-neutral-500 text-center mt-12 leading-relaxed">
          May questions? Email us at{' '}
          <a href="mailto:Nosta@manila.com" className="underline">
            Nosta@manila.com
          </a>
        </p>
      </div>
    </div>
  )
}