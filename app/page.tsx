'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import Header from '@/components/layout/Header'
import ProductCatalog from '@/components/pos/ProductCatalog'
import CartPanel from '@/components/pos/CartPanel'
import CheckoutModal, { TransactionSummary } from '@/components/pos/CheckoutModal'
import ProductManagementModal from '@/components/products/ProductManagementModal'
import TransactionHistoryModal from '@/components/history/TransactionHistoryModal'

import { usePosData } from '@/hooks/usePosData'
import { useCart } from '@/hooks/useCart'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { processCheckout } from '@/app/actions/transactionActions'

export default function PosDashboardPage() {
  // Custom Hooks for Data & Cart
  const { products, transactions, isLoading, refreshData } = usePosData()
  const { cart, addToCart, updateQuantity, removeItem, clearCart } = useCart()

  // State for Checkout & Modals
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false)
  const [activeTransaction, setActiveTransaction] = useState<TransactionSummary | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  // Calculate Today's Sales Statistics
  const todayStr = new Date().toDateString()
  const todayTransactions = transactions.filter(
    (t) => new Date(t.createdAt).toDateString() === todayStr
  )
  const todaySalesTotal = todayTransactions.reduce((sum, t) => sum + t.totalAmount, 0)
  const todayTransactionCount = todayTransactions.length

  // Close Modals Helper for Keyboard Shortcut
  const handleCloseAllModals = useCallback(() => {
    setActiveTransaction(null)
    setIsProductModalOpen(false)
    setIsHistoryModalOpen(false)
  }, [])

  // Checkout Execution
  const handleCheckout = useCallback(async () => {
    if (cart.length === 0) return

    setIsCheckoutSubmitting(true)
    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      }

      const res = await processCheckout(payload)
      if (!res.success || !res.data) {
        toast.error(res.error || 'Checkout gagal diproses.')
        return
      }

      toast.success('Transaksi berhasil diproses!')
      setActiveTransaction(res.data)
      clearCart()
      refreshData()
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan sistem saat checkout.')
    } finally {
      setIsCheckoutSubmitting(false)
    }
  }, [cart, clearCart, refreshData])

  // Global Keyboard Hotkeys Listener
  useKeyboardShortcuts({
    onCloseModals: handleCloseAllModals,
    onCheckout: handleCheckout,
  })

  return (
    <div className="flex flex-col h-screen bg-dark-bg text-dark-text overflow-hidden">
      {/* Navbar Header */}
      <Header
        isLoading={isLoading}
        todaySalesTotal={todaySalesTotal}
        todayTransactionCount={todayTransactionCount}
        onOpenProductModal={() => setIsProductModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onRefresh={refreshData}
      />

      {/* Main Split-Screen Dashboard */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
        <div className="lg:col-span-2 h-full overflow-hidden flex flex-col">
          <ProductCatalog
            products={products}
            onAddToCart={addToCart}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-1 h-full overflow-hidden flex flex-col">
          <CartPanel
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onClearCart={clearCart}
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
        onRefresh={refreshData}
      />

      <TransactionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        transactions={transactions}
      />
    </div>
  )
}
