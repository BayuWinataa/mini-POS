'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Product, CartItem } from '@/types/pos'

const CART_STORAGE_KEY = 'mini_pos_cart_draft'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  // Load saved draft cart from localStorage on initial client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        if (Array.isArray(parsed)) {
          setCart(parsed)
        }
      }
    } catch (err) {
      console.error('Failed to load cart draft from localStorage:', err)
    } finally {
      setMounted(true)
    }
  }, [])

  // Auto-sync cart state to localStorage whenever cart updates
  useEffect(() => {
    if (!mounted) return
    try {
      if (cart.length > 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      } else {
        localStorage.removeItem(CART_STORAGE_KEY)
      }
    } catch (err) {
      console.error('Failed to save cart draft to localStorage:', err)
    }
  }, [cart, mounted])

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
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch (err) {
      console.error('Failed to clear cart draft from localStorage:', err)
    }
  }

  return {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  }
}
