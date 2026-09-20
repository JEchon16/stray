// src/app/admin/(dashboard)/products/page.tsx
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function AdminProductsPage() {
  const supabase = await createServerSupabaseClient()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-10 max-w-7xl">
      {/* HEADER */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-3">
            Manage
          </p>
          <h1 className="text-4xl font-black tracking-tight mb-2">Products</h1>
          <p className="text-sm text-neutral-500">
            {products?.length || 0} product{(products?.length || 0) !== 1 ? 's' : ''} total
          </p>
        </div>

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
      </div>

      {/* PRODUCTS TABLE */}
      {products && products.length > 0 ? (
        <div className="bg-[#0A0A0A] border border-neutral-900 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-900">
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 w-20">
                  Image
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-neutral-900 last:border-b-0 hover:bg-neutral-900/50 transition-colors"
                >
                  {/* Image */}
                  <td className="px-6 py-4">
                    <div className="w-14 h-14 bg-neutral-900 overflow-hidden flex-shrink-0">
                      <img
                        src={product.image_front}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white mb-0.5">
                      {product.name}
                    </p>
                    {product.slug && (
                      <p className="text-[10px] text-neutral-600 font-mono">
                        /{product.slug}
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="text-xs text-neutral-400">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-white tabular-nums">
                      ₱{Number(product.price).toLocaleString('en-PH')}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {product.sold_out ? (
                      <span className="inline-block px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] bg-red-950/40 text-red-400 border border-red-900/40">
                        Sold Out
                      </span>
                    ) : product.badge ? (
                      <span className="inline-block px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] bg-yellow-950/40 text-yellow-400 border border-yellow-900/40">
                        {product.badge}
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] bg-green-950/40 text-green-400 border border-green-900/40">
                        Active
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-900 transition-all rounded-sm"
                        title="Edit"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Link>
                      <Link
                        href={`/product/${product.id}`}
                        target="_blank"
                        className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-900 transition-all rounded-sm"
                        title="View in store"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7" />
                          <path d="M7 7h10v10" />
                        </svg>
                      </Link>
                    </div>
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
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-2">
            No Products Yet
          </p>
          <p className="text-sm text-neutral-600 mb-6">
            Start by adding your first product.
          </p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-7 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all"
          >
            + Add Your First Product
          </Link>
        </div>
      )}
    </div>
  )
}