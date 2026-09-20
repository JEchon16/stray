// src/app/admin/(dashboard)/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Menu, X, LayoutDashboard, Package, ShoppingBag, Globe, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [signingOut, setSigningOut] = useState(false)

  // Fetch user email
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email)
    })
  }, [])

  // Close sidebar pag nag-navigate
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Prevent body scroll pag naka-open sidebar sa mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [sidebarOpen])

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ============================================ */}
      {/* MOBILE TOP BAR */}
      {/* ============================================ */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0A0A0A] border-b border-neutral-900">
        <div className="flex items-center justify-between px-4 py-4">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 hover:bg-neutral-900 rounded-sm transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo */}
          <Link href="/admin" className="flex flex-col items-center">
            <span
              className="text-lg font-black tracking-tight"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              NostalManila
            </span>
            <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-[0.3em]">
              Admin
            </span>
          </Link>

          {/* Spacer para pantay */}
          <div className="w-9" />
        </div>
      </header>

      {/* ============================================ */}
      {/* MOBILE OVERLAY (click to close) */}
      {/* ============================================ */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ============================================ */}
      {/* SIDEBAR */}
      {/* ============================================ */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-[#0A0A0A] border-r border-neutral-900 
          flex flex-col z-50
          transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo + Close button */}
        <div className="px-8 py-8 border-b border-neutral-900 flex items-center justify-between">
          <Link href="/admin" className="block group" onClick={() => setSidebarOpen(false)}>
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

          {/* Close button — mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 -mr-2 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded-sm transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-4 py-3 text-[10px] font-bold text-neutral-600 uppercase tracking-[0.3em]">
            Main
          </p>

          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center gap-3 px-4 py-3 
                  text-xs font-bold uppercase tracking-[0.15em] 
                  transition-all rounded-sm
                  ${active 
                    ? 'bg-white text-black' 
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }
                `}
              >
                <Icon size={16} strokeWidth={2} />
                {item.label}
              </Link>
            )
          })}

          <p className="px-4 py-3 mt-4 text-[10px] font-bold text-neutral-600 uppercase tracking-[0.3em]">
            Store
          </p>

          <Link
            href="/"
            target="_blank"
            className="group flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all rounded-sm"
          >
            <Globe size={16} strokeWidth={2} />
            View Store
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </Link>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-neutral-900">
          <div className="flex items-center gap-3 px-4 py-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-black text-neutral-400 flex-shrink-0">
              {userEmail?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.15em]">
                Signed in
              </p>
              <p className="text-xs text-white truncate">{userEmail || '...'}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-red-400 border border-neutral-900 hover:border-red-900/50 hover:bg-red-950/20 transition-all rounded-sm disabled:opacity-50"
          >
            <LogOut size={12} strokeWidth={2} />
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <main className="lg:ml-72 min-h-screen">
        {children}
      </main>
    </div>
  )
}