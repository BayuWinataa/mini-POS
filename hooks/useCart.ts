'use client'

import { useState } from 'react'
import { Product } from '@/components/pos/ProductCatalog'
import { CartItem } from '@/components/pos/CartPanel'

export function useCart(showToast: (msg: string) => void) {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) {
          showToast(`Stok "${product.name}" telah mencapai batas maksimal (${product.stock}).`)
          return prevCart
        }
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            if (newQty > item.product.stock) {
              showToast(`Stok maksimal (${item.product.stock}) telah tercapai.`)
              return item
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    })
  }

  const removeItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  return {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  }
}
