// src/app/admin/layout.tsx
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { signOut } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ⚠️ Huwag i-redirect dito — middleware na yung bahala
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* ============================================ */}
      {/* SIDEBAR */}
      {/* ============================================ */}
      <aside className="w-72 bg-[#0A0A0A] border-r border-neutral-900 flex flex-col">
        {/* Logo */}
        <div className="px-8 py-8 border-b border-neutral-900">
          <Link href="/admin" className="block group">
            <h1
              className="text-2xl font-black text-white group-hover:opacity-80 transition-opacity"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              NostalManila
            </h1>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mt-1.5">
              Admin Panel
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-4 py-3 text-[10px] font-bold text-neutral-600 uppercase tracking-[0.3em]">
            Main
          </p>

          <Link
            href="/admin"
            className="group flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all rounded-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className="group flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all rounded-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
            </svg>
            Products
          </Link>

          <Link
            href="/admin/orders"
            className="group flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all rounded-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
            Orders
          </Link>

          <p className="px-4 py-3 mt-4 text-[10px] font-bold text-neutral-600 uppercase tracking-[0.3em]">
            Store
          </p>

          <Link
            href="/"
            target="_blank"
            className="group flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all rounded-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            View Store
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </Link>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-neutral-900">
          {user && (
            <div className="flex items-center gap-3 px-4 py-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-black text-neutral-400">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.15em]">
                  Signed in
                </p>
                <p className="text-xs text-white truncate">{user.email}</p>
              </div>
            </div>
          )}

          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-red-400 border border-neutral-900 hover:border-red-900/50 hover:bg-red-950/20 transition-all rounded-sm"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}