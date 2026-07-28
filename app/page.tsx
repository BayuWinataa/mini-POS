'use client'

import { useState, useEffect } from 'react'
import { Store, Package, History, RefreshCw, Sparkles } from 'lucide-react'
import ProductCatalog, { Product } from '@/components/pos/ProductCatalog'
import CartPanel, { CartItem } from '@/components/pos/CartPanel'
import CheckoutModal, { TransactionSummary } from '@/components/pos/CheckoutModal'
import ProductManagementModal from '@/components/products/ProductManagementModal'
import TransactionHistoryModal, { TransactionRecord } from '@/components/history/TransactionHistoryModal'
import { getProducts } from '@/app/actions/productActions'
import { processCheckout, getTransactions } from '@/app/actions/transactionActions'

const MOCK_FALLBACK_PRODUCTS: Product[] = [
  { id: '10000000-0000-0000-0000-000000000001', name: 'Kopi Susu Gula Aren', price: 18000, stock: 45, isActive: true },
  { id: '10000000-0000-0000-0000-000000000002', name: 'Americano Ice', price: 15000, stock: 30, isActive: true },
  { id: '10000000-0000-0000-0000-000000000003', name: 'Croissant Cokelat', price: 22000, stock: 15, isActive: true },
  { id: '10000000-0000-0000-0000-000000000004', name: 'Roti Bakar Keju', price: 16000, stock: 20, isActive: true },
  { id: '10000000-0000-0000-0000-000000000005', name: 'Matcha Latte', price: 25000, stock: 10, isActive: true },
  { id: '10000000-0000-0000-0000-000000000006', name: 'Air Mineral 600ml', price: 5000, stock: 80, isActive: true },
]

export default function PosDashboardPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_FALLBACK_PRODUCTS)
  const [cart, setCart] = useState<CartItem[]>([])
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false)
  const [activeTransaction, setActiveTransaction] = useState<TransactionSummary | null>(null)

  // Modals visibility state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  // Toast / Error Message state
  const [toastMsg, setToastMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const showToast = (text: string, type: 'error' | 'success' = 'error') => {
    setToastMsg({ type, text })
    setTimeout(() => setToastMsg(null), 4000)
  }

  // Load products & transactions
  const loadInitialData = async () => {
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
      console.error('Error loading data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
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

  const handleUpdateQuantity = (productId: string, delta: number) => {
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

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  const handleClearCart = () => {
    setCart([])
  }

  // Checkout Handler
  const handleCheckout = async () => {
    if (cart.length === 0) return

    setIsCheckoutSubmitting(true)
    try {
      const checkoutPayload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      }

      const res = await processCheckout(checkoutPayload)

      if (!res.success || !res.data) {
        showToast(res.error || 'Checkout gagal diproses.')
        return
      }

      // Checkout Success
      setActiveTransaction(res.data)
      setCart([])
      loadInitialData() // refresh stock & transaction list
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan sistem saat checkout.')
    } finally {
      setIsCheckoutSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0B0F19] text-[#F9FAFB] overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 px-6 bg-[#111827] border-b border-[#1F2937] flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FF4500] text-white rounded-xl shadow-lg shadow-[#FF4500]/25">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-white">MINI POS</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#FF4500]/10 text-[#FF4500] rounded-full border border-[#FF4500]/20">
                PROD v1.0
              </span>
            </div>
            <p className="text-[11px] text-[#9CA3AF]">Point of Sale & Management Ritel</p>
          </div>
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProductModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#1F2937] hover:bg-[#374151] text-xs font-medium rounded-lg border border-[#374151] transition-colors"
          >
            <Package className="w-4 h-4 text-[#FF4500]" />
            <span className="hidden sm:inline">Manajemen Produk</span>
          </button>

          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#1F2937] hover:bg-[#374151] text-xs font-medium rounded-lg border border-[#374151] transition-colors"
          >
            <History className="w-4 h-4 text-[#FF4500]" />
            <span className="hidden sm:inline">Riwayat Transaksi</span>
          </button>

          <button
            onClick={loadInitialData}
            title="Refresh Data"
            className="p-2 bg-[#1F2937] hover:bg-[#374151] text-[#9CA3AF] hover:text-white rounded-lg border border-[#374151] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="px-6 py-2 bg-red-500/10 border-b border-red-500/30 text-red-400 text-xs font-medium flex items-center justify-between animate-fade-in">
          <span>{toastMsg.text}</span>
          <button onClick={() => setToastMsg(null)} className="underline text-[11px] hover:text-red-300">
            Tutup
          </button>
        </div>
      )}

      {/* Main Split-Screen Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
        {/* Left Column: Product Catalog (2 Cols Wide on Large Screens) */}
        <div className="lg:col-span-2 h-full overflow-hidden flex flex-col">
          <ProductCatalog
            products={products}
            onAddToCart={handleAddToCart}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column: Cart Panel (1 Col Wide) */}
        <div className="lg:col-span-1 h-full overflow-hidden flex flex-col">
          <CartPanel
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
            isSubmitting={isCheckoutSubmitting}
          />
        </div>
      </main>

      {/* Modals */}
      <CheckoutModal
        transaction={activeTransaction}
        onClose={() => setActiveTransaction(null)}
      />

      <ProductManagementModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        products={products}
        onRefresh={loadInitialData}
      />

      <TransactionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        transactions={transactions}
      />
    </div>
  )
}
