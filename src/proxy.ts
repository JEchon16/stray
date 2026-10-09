// src/proxy.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminLogin = pathname === '/admin/login'

  // Check kung admin yung user (via app_metadata.role)
  const isAdmin = user?.app_metadata?.role === 'admin'

  // ============================================
  // ADMIN ROUTES PROTECTION
  // ============================================
  if (isAdminRoute) {
    // Kung nasa /admin/login:
    if (isAdminLogin) {
      // Kung naka-login as admin, redirect sa dashboard
      if (user && isAdmin) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      // Kung customer (hindi admin), allow lang — pero i-sign out sa page
      // Kung walang user, allow
      return response
    }

    // Kung ibang /admin/* routes:
    // 1. Walang session — redirect sa login
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // 2. Naka-login pero HINDI ADMIN — redirect sa home
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}