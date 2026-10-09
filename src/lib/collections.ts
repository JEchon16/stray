// src/lib/collections.ts
'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from './supabase-server'

// ============================================
// GET ALL COLLECTIONS
// ============================================
export async function getCollections() {
  try {
    const { data, error } = await supabaseAdmin
      .from('collections')
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
// GET ACTIVE COLLECTIONS
// ============================================
export async function getActiveCollections() {
  try {
    const { data, error } = await supabaseAdmin
      .from('collections')
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
// CREATE COLLECTION
// ============================================
export async function createCollection(data: {
  name: string
  status: string
  image_url: string
  link?: string | null
  sort_order?: number
  active?: boolean
}) {
  try {
    const { data: collection, error } = await supabaseAdmin
      .from('collections')
      .insert([data])
      .select()
      .single()

    if (error) return { error: error.message }

    revalidatePath('/admin/collections')
    revalidatePath('/')
    return { success: true, collection }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ============================================
// UPDATE COLLECTION
// ============================================
export async function updateCollection(
  id: string,
  data: Partial<{
    name: string
    status: string
    image_url: string
    link: string | null
    sort_order: number
    active: boolean
  }>
) {
  try {
    const { error } = await supabaseAdmin
      .from('collections')
      .update(data)
      .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin/collections')
    revalidatePath('/')
    return { success: true }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ============================================
// DELETE COLLECTION
// ============================================
export async function deleteCollection(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from('collections')
      .delete()
      .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin/collections')
    revalidatePath('/')
    return { success: true }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}