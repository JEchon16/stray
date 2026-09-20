// src/lib/cart-context.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  updateQuantity: (id: string, size: string, change: number) => void
  removeFromCart: (id: string, size: string) => void
  clearCart: () => void
  cartTotalItems: number
  cartSubtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'nostalmanila-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load cart from localStorage
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setCart(JSON.parse(saved))
      }
    } catch (err) {
      console.error('Failed to load cart:', err)
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch (err) {
      console.error('Failed to save cart:', err)
    }
  }, [cart, mounted])

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.size === item.size
      )
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, size: string, change: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    )
  }

  const removeFromCart = (id: string, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === id && item.size === size))
    )
  }

  const clearCart = () => setCart([])

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotalItems,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}