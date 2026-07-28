'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Product, CartItem } from '@/types/pos'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.warning(`Stok "${product.name}" telah mencapai batas maksimal (${product.stock}).`)
          return prevCart
        }
        toast.success(`Ditambahkan: +1 ${product.name}`)
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      toast.success(`Ditambahkan ke keranjang: ${product.name}`)
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
              toast.warning(`Stok maksimal (${item.product.stock}) telah tercapai.`)
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
    toast.info('Item dihapus dari keranjang')
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
