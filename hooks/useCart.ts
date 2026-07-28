'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Product, CartItem, DiscountType } from '@/types/pos'

const CART_STORAGE_KEY = 'mini_pos_cart_draft'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [discountType, setDiscountType] = useState<DiscountType>('percentage')
  const [discountValue, setDiscountValue] = useState<number>(0)
  const [activeVoucherCode, setActiveVoucherCode] = useState<string>('')
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

  // Subtotal, Discount & Payable Amount Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discountAmount = Math.round(
    discountType === 'percentage'
      ? (subtotal * Math.min(100, Math.max(0, discountValue))) / 100
      : Math.min(subtotal, Math.max(0, discountValue))
  )
  const finalTotal = Math.max(0, subtotal - discountAmount)

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

  const applyVoucherCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase()
    if (cleanCode === 'DISKON5') {
      setDiscountType('percentage')
      setDiscountValue(5)
      setActiveVoucherCode('DISKON5')
      toast.success('Kupon DISKON5 (Diskon 5%) dipasang!')
    } else if (cleanCode === 'DISKON10') {
      setDiscountType('percentage')
      setDiscountValue(10)
      setActiveVoucherCode('DISKON10')
      toast.success('Kupon DISKON10 (Diskon 10%) dipasang!')
    } else if (cleanCode === 'HEMAT5K') {
      setDiscountType('fixed')
      setDiscountValue(5000)
      setActiveVoucherCode('HEMAT5K')
      toast.success('Kupon HEMAT5K (Potongan Rp 5.000) dipasang!')
    } else {
      toast.error('Kode kupon tidak valid')
    }
  }

  const clearDiscount = () => {
    setDiscountValue(0)
    setActiveVoucherCode('')
  }

  const clearCart = () => {
    setCart([])
    clearDiscount()
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch (err) {
      console.error('Failed to clear cart draft from localStorage:', err)
    }
  }

  return {
    cart,
    subtotal,
    discountType,
    discountValue,
    discountAmount,
    finalTotal,
    activeVoucherCode,
    setDiscountType,
    setDiscountValue,
    applyVoucherCode,
    clearDiscount,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  }
}
