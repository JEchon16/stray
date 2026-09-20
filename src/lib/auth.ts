// src/lib/auth.ts
'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from './supabase-server'

// ============================================
// SIGN IN
// ============================================
export async function signIn(email: string, password: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// ============================================
// SIGN OUT
// ============================================
export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

// ============================================
// GET CURRENT USER
// ============================================
export async function getUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ============================================
// REQUIRE AUTH (redirect to login if not)
// ============================================
export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/admin/login')
  }
  return user
}