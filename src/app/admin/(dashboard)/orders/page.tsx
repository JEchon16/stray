// src/app/admin/(dashboard)/orders/page.tsx
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-950/40 text-yellow-400 border-yellow-900/40',
  confirmed: 'bg-blue-950/40 text-blue-400 border-blue-900/40',
  shipped: 'bg-purple-950/40 text-purple-400 border-purple-900/40',
  delivered: 'bg-green-950/40 text-green-400 border-green-900/40',
  cancelled: 'bg-red-950/40 text-red-400 border-red-900/40',
}

export default async function AdminOrdersPage() {
  const supabase = await createServerSupabaseClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  function formatPrice(price: number) {
    return '₱' + Number(price).toLocaleString('en-PH')
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-10 max-w-7xl">
      {/* HEADER */}
      <div className="mb-12">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
          Manage
        </p>
        <h1 className="text-4xl font-black tracking-tight mb-2">Orders</h1>
        <p className="text-sm text-neutral-500">
          {orders?.length || 0} order{(orders?.length || 0) !== 1 ? 's' : ''} total
        </p>
      </div>

      {/* ORDERS TABLE */}
      {orders && orders.length > 0 ? (
        <div className="bg-[#0A0A0A] border border-neutral-900 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-900">
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Order #
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Payment
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Total
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Date
                </th>
                <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-neutral-900 last:border-b-0 hover:bg-neutral-900/50 transition-colors"
                >
                  <td className="px-6 py-5">
                    <span className="text-xs font-mono font-bold text-white">
                      {order.order_number}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-white mb-0.5">
                      {order.customer_name}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {order.customer_phone}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs text-neutral-400 uppercase tracking-[0.1em]">
                      {order.payment_method === 'cod' ? 'COD' : 'GCash'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-white tabular-nums">
                      {formatPrice(order.total)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-block px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] border ${
                        STATUS_COLORS[order.status] || STATUS_COLORS.pending
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] text-neutral-500">
                      {formatDate(order.created_at)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors"
                    >
                      View
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="bg-[#0A0A0A] border border-neutral-900 p-20 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-900 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-700">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-2">
            No Orders Yet
          </p>
          <p className="text-sm text-neutral-600">
            Pag may umorder, lalabas dito.
          </p>
        </div>
      )}
    </div>
  )
}