'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Product, CartItem } from '@/types/pos'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id)
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.warning(`Stok "${product.name}" telah mencapai batas maksimal (${product.stock}).`)
        return
      }
      toast.success(`Ditambahkan: +1 ${product.name}`)
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    } else {
      toast.success(`Ditambahkan ke keranjang: ${product.name}`)
      setCart((prevCart) => [...prevCart, { product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId: string, delta: number) => {
    const targetItem = cart.find((item) => item.product.id === productId)
    if (targetItem && delta > 0) {
      if (targetItem.quantity + delta > targetItem.product.stock) {
        toast.warning(`Stok maksimal (${targetItem.product.stock}) telah tercapai.`)
        return
      }
    }

    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
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
