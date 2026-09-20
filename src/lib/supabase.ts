// src/lib/supabase.ts
// CLIENT-SIDE Supabase (safe for browser)
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!   // ← PUBLISHABLE, hindi SECRET
  )
}