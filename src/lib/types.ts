// src/lib/types.ts

// ============================================
// PRODUCT
// ============================================
export interface Product {
  id: string
  name: string
  slug: string | null
  description: string | null
  price: number
  image_front: string
  image_back: string | null
  image_chart: string | null   // ← IDAGDAG MO 'TO
  badge: string | null
  category: string
  sold_out: boolean
  created_at: string
  updated_at: string
}

// ============================================
// CART ITEM
// ============================================
export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  quantity: number
}

// ============================================
// ORDER
// ============================================
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled'

export type PaymentMethod = 'cod' | 'gcash'

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  payment_method: PaymentMethod
  gcash_reference: string | null
  gcash_proof_url: string | null
  subtotal: number
  shipping_fee: number
  total: number
  status: OrderStatus
  notes: string | null
  created_at: string
  updated_at: string
}

// ============================================
// ORDER ITEM
// ============================================
export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_price: number
  product_image: string | null
  size: string
  quantity: number
  subtotal: number
  created_at: string
}

// ============================================
// SIZE OPTIONS
// ============================================
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
export type Size = typeof SIZES[number]

// ============================================
// HERO MEDIA
// ============================================
export interface HeroMedia {
  id: string
  type: 'image' | 'video'
  url: string
  alt_text: string | null
  sort_order: number
  active: boolean
  created_at: string
}

// ============================================
// COLLECTION (DB version)
// ============================================
export interface Collection {
  id: string
  name: string
  status: string
  image_url: string
  link: string | null
  sort_order: number
  active: boolean
  created_at: string
}

// ============================================
// LOOKBOOK (DB version)
// ============================================
export interface LookbookItem {
  id: string
  title: string
  image_url: string
  sort_order: number
  active: boolean
  created_at: string
}