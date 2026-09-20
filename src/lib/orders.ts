// src/lib/orders.ts
'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from './supabase-server'
import {
  sendOrderConfirmedEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail,
} from './email'

// ============================================
// TYPES
// ============================================
export interface CheckoutItem {
  product_id: string
  product_name: string
  product_price: number
  product_image: string
  size: string
  quantity: number
}

export interface CheckoutData {
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  payment_method: 'cod' | 'gcash'
  gcash_reference?: string | null
  gcash_proof_url?: string | null
  notes?: string | null
  items: CheckoutItem[]
  shipping_fee: number
}

// ============================================
// GENERATE ORDER NUMBER (NM-2026-0001)
// ============================================
async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()

  const { data: latest } = await supabaseAdmin
    .from('orders')
    .select('order_number')
    .like('order_number', `NM-${year}-%`)
    .order('order_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  let nextNumber = 1
  if (latest?.order_number) {
    const parts = latest.order_number.split('-')
    const lastNumber = parseInt(parts[2], 10)
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1
    }
  }

  return `NM-${year}-${String(nextNumber).padStart(4, '0')}`
}

// ============================================
// CREATE ORDER
// ============================================
export async function createOrder(data: CheckoutData) {
  try {
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.product_price * item.quantity,
      0
    )
    const total = subtotal + data.shipping_fee
    const orderNumber = await generateOrderNumber()

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          order_number: orderNumber,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          shipping_address: data.shipping_address,
          payment_method: data.payment_method,
          gcash_reference: data.gcash_reference || null,
          gcash_proof_url: data.gcash_proof_url || null,
          subtotal,
          shipping_fee: data.shipping_fee,
          total,
          status: 'pending',
          notes: data.notes || null,
        },
      ])
      .select()
      .single()

    if (orderError || !order) {
      return { error: orderError?.message || 'Failed to create order' }
    }

    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      product_image: item.product_image,
      size: item.size,
      quantity: item.quantity,
      subtotal: item.product_price * item.quantity,
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      await supabaseAdmin.from('orders').delete().eq('id', order.id)
      return { error: itemsError.message }
    }

    revalidatePath('/admin/orders')
    revalidatePath('/admin')

    return { success: true, order }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

// ============================================
// GET ORDER BY ID (with items)
// ============================================
export async function getOrder(id: string) {
  try {
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return {
        error: orderError?.message || 'Order not found',
        order: null,
        items: [],
      }
    }

    const { data: items, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', id)

    if (itemsError) {
      return { error: itemsError.message, order: null, items: [] }
    }

    return { order, items: items || [], error: null }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
      order: null,
      items: [],
    }
  }
}

// ============================================
// GET ORDER BY ORDER NUMBER
// ============================================
export async function getOrderByNumber(orderNumber: string) {
  try {
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single()

    if (orderError || !order) {
      return { error: 'Order not found', order: null, items: [] }
    }

    const { data: items } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)

    return { order, items: items || [], error: null }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
      order: null,
      items: [],
    }
  }
}

// ============================================
// UPDATE ORDER STATUS (with email notification)
// ============================================
export async function updateOrderStatus(id: string, status: string) {
  try {
    // 1. Update DB
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (error) return { error: error.message }

    // 2. Fetch updated order + items
    const { order, items } = await getOrder(id)

    // 3. Send email notification based sa status
    let emailResult: { success: boolean; error?: string; id?: string } = {
      success: true,
    }

    if (order && items) {
      switch (status) {
        case 'confirmed':
          emailResult = await sendOrderConfirmedEmail(order, items)
          break
        case 'shipped':
          emailResult = await sendOrderShippedEmail(order, items)
          break
        case 'delivered':
          emailResult = await sendOrderDeliveredEmail(order, items)
          break
        case 'cancelled':
          emailResult = await sendOrderCancelledEmail(order, items)
          break
        // 'pending' — walang email (reset lang)
        default:
          emailResult = { success: true }
      }

      if (!emailResult.success) {
        console.error('Email send failed:', emailResult.error)
        // Hindi natin i-block yung status update kahit may email error
      }
    }

    // 4. Revalidate admin pages
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${id}`)
    revalidatePath('/admin')

    return { success: true, emailSent: emailResult.success }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}