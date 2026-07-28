'use client'

import { useState, useEffect, useCallback } from 'react'
import { Product, TransactionRecord } from '@/types/pos'
import { getProducts } from '@/app/actions/productActions'
import { getTransactions } from '@/app/actions/transactionActions'

const MOCK_FALLBACK_PRODUCTS: Product[] = [
  { id: '10000000-0000-0000-0000-000000000001', name: 'Kopi Susu Gula Aren', price: 18000, stock: 45, isActive: true },
  { id: '10000000-0000-0000-0000-000000000002', name: 'Americano Ice', price: 15000, stock: 30, isActive: true },
  { id: '10000000-0000-0000-0000-000000000003', name: 'Croissant Cokelat', price: 22000, stock: 15, isActive: true },
  { id: '10000000-0000-0000-0000-000000000004', name: 'Roti Bakar Keju', price: 16000, stock: 20, isActive: true },
  { id: '10000000-0000-0000-0000-000000000005', name: 'Matcha Latte', price: 25000, stock: 10, isActive: true },
  { id: '10000000-0000-0000-0000-000000000006', name: 'Air Mineral 600ml', price: 5000, stock: 80, isActive: true },
]

export function usePosData() {
  const [products, setProducts] = useState<Product[]>(MOCK_FALLBACK_PRODUCTS)
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshData = useCallback(async () => {
    setIsLoading(true)
    try {
      const prodRes = await getProducts()
      if (prodRes.success && prodRes.data && prodRes.data.length > 0) {
        setProducts(prodRes.data)
      } else {
        setProducts(MOCK_FALLBACK_PRODUCTS)
      }

      const trxRes = await getTransactions()
      if (trxRes.success && trxRes.data) {
        setTransactions(trxRes.data)
      }
    } catch (err) {
      console.error('Error fetching POS data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  return {
    products,
    transactions,
    isLoading,
    refreshData,
  }
}
