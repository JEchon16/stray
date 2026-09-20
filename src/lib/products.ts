// src/lib/products.ts
'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from './supabase-server'

export interface ProductFormData {
  name: string
  slug: string
  description: string
  price: number
  image_front: string
  image_back: string | null
  image_chart: string | null   // ← BAGONG FIELD
  badge: string | null
  category: string
  sold_out: boolean
}

// ============================================
// CREATE PRODUCT
// ============================================
export async function createProduct(data: ProductFormData) {
  try {
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert([data])
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/products')
    revalidatePath('/shop')
    return { success: true, product }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ============================================
// UPDATE PRODUCT
// ============================================
export async function updateProduct(id: string, data: ProductFormData) {
  try {
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/products')
    revalidatePath('/shop')
    return { success: true, product }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ============================================
// DELETE PRODUCT
// ============================================
export async function deleteProduct(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/products')
    revalidatePath('/shop')
    return { success: true }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
// ============================================
// GET SINGLE PRODUCT
// ============================================
export async function getProduct(id: string) {
  try {
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return { error: error.message, product: null }
    }

    return { product, error: null }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
      product: null,
    }
  }
}
