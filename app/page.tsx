'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import ProductCatalog from '@/components/pos/ProductCatalog'
import CartPanel from '@/components/pos/CartPanel'
import CheckoutModal, { TransactionSummary } from '@/components/pos/CheckoutModal'
import ProductManagementModal from '@/components/products/ProductManagementModal'
import TransactionHistoryModal from '@/components/history/TransactionHistoryModal'

import { usePosData } from '@/hooks/usePosData'
import { useCart } from '@/hooks/useCart'
import { processCheckout } from '@/app/actions/transactionActions'

export default function PosDashboardPage() {
  // Toast Notification State
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const showToast = (text: string) => {
    setToastMsg(text)
    setTimeout(() => setToastMsg(null), 4000)
  }

  // Custom Hooks for Data & Cart
  const { products, transactions, isLoading, refreshData } = usePosData()
  const { cart, addToCart, updateQuantity, removeItem, clearCart } = useCart(showToast)

  // State for Checkout & Modals
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false)
  const [activeTransaction, setActiveTransaction] = useState<TransactionSummary | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  // Checkout Execution
  const handleCheckout = async () => {
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
        showToast(res.error || 'Checkout gagal diproses.')
        return
      }

      setActiveTransaction(res.data)
      clearCart()
      refreshData()
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan sistem saat checkout.')
    } finally {
      setIsCheckoutSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0B0F19] text-[#F9FAFB] overflow-hidden">
      {/* Navbar Header */}
      <Header
        isLoading={isLoading}
        onOpenProductModal={() => setIsProductModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onRefresh={refreshData}
      />

      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="px-6 py-2 bg-red-500/10 border-b border-red-500/30 text-red-400 text-xs font-medium flex items-center justify-between animate-fade-in">
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="underline text-[11px] hover:text-red-300">
            Tutup
          </button>
        </div>
      )}

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
