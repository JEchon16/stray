// src/app/admin/page.tsx
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient()

  const [
    { count: productCount },
    { count: orderCount },
    { count: pendingOrders },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      label: 'Total Products',
      value: productCount || 0,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
        </svg>
      ),
    },
    {
      label: 'Total Orders',
      value: orderCount || 0,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      ),
    },
    {
      label: 'Pending Orders',
      value: pendingOrders || 0,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      highlight: true,
    },
  ]

  return (
    <div className="p-10 max-w-7xl">
      {/* HEADER */}
      <div className="mb-12">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
          Overview
        </p>
        <h1 className="text-4xl font-black tracking-tight mb-2">Dashboard</h1>
        <p className="text-sm text-neutral-500">
          Welcome back. Here's what's happening with your store.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-[#0A0A0A] border p-7 transition-all hover:bg-[#111111] ${
              stat.highlight
                ? 'border-yellow-900/30'
                : 'border-neutral-900 hover:border-neutral-800'
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
                {stat.label}
              </p>
              <div className={stat.highlight ? 'text-yellow-400' : 'text-neutral-600'}>
                {stat.icon}
              </div>
            </div>
            <p
              className={`text-5xl font-black tabular-nums ${
                stat.highlight ? 'text-yellow-400' : 'text-white'
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="mb-12">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">
          Quick Actions
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="group inline-flex items-center gap-2 px-7 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="group inline-flex items-center gap-2 px-7 py-4 border border-neutral-800 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-900 hover:border-neutral-700 transition-all"
          >
            View Orders
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em]">
            Recent Orders
          </p>
          {recentOrders && recentOrders.length > 0 && (
            <Link
              href="/admin/orders"
              className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
              View All →
            </Link>
          )}
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="bg-[#0A0A0A] border border-neutral-900 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-900">
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Order</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Customer</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Total</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-neutral-900 last:border-b-0 hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-5 text-xs font-mono text-white">{order.order_number}</td>
                    <td className="px-6 py-5 text-xs text-neutral-300">{order.customer_name}</td>
                    <td className="px-6 py-5 text-xs font-bold text-white tabular-nums">
                      ₱{order.total.toLocaleString('en-PH')}
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-block px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] bg-yellow-950/40 text-yellow-400 border border-yellow-900/40">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-[#0A0A0A] border border-neutral-900 p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-900 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-700">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              </svg>
            </div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-2">
              No Orders Yet
            </p>
            <p className="text-sm text-neutral-600">
              Wala pang orders. Pag may umorder, lalabas dito.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}