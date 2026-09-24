// src/lib/hero.ts
'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from './supabase-server'

// ============================================
// GET ALL HERO MEDIA
// ============================================
export async function getHeroMedia() {
  try {
    const { data, error } = await supabaseAdmin
      .from('hero_media')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) return { error: error.message, data: [] }

    return { data: data || [], error: null }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
      data: [],
    }
  }
}

// ============================================
// GET ACTIVE HERO MEDIA (para sa home page)
// ============================================
export async function getActiveHeroMedia() {
  try {
    const { data, error } = await supabaseAdmin
      .from('hero_media')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })

    if (error) return { error: error.message, data: [] }

    return { data: data || [], error: null }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
      data: [],
    }
  }
}

// ============================================
// CREATE HERO MEDIA
// ============================================
export async function createHeroMedia(data: {
  type: 'image' | 'video'
  url: string
  alt_text?: string | null
  sort_order?: number
  active?: boolean
}) {
  try {
    const { data: item, error } = await supabaseAdmin
      .from('hero_media')
      .insert([data])
      .select()
      .single()

    if (error) return { error: error.message }

    revalidatePath('/admin/hero')
    revalidatePath('/')
    return { success: true, item }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ============================================
// UPDATE HERO MEDIA
// ============================================
export async function updateHeroMedia(
  id: string,
  data: Partial<{
    type: 'image' | 'video'
    url: string
    alt_text: string | null
    sort_order: number
    active: boolean
  }>
) {
  try {
    const { error } = await supabaseAdmin
      .from('hero_media')
      .update(data)
      .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin/hero')
    revalidatePath('/')
    return { success: true }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ============================================
// DELETE HERO MEDIA
// ============================================
export async function deleteHeroMedia(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from('hero_media')
      .delete()
      .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin/hero')
    revalidatePath('/')
    return { success: true }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}