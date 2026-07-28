'use client'

import { useEffect } from 'react'
import { CheckCircle2, Printer, X, ShoppingBag } from 'lucide-react'
import confetti from 'canvas-confetti'
import { formatDate, formatRupiah } from '@/lib/utils'

export interface TransactionSummary {
  id: string
  transactionNumber: string
  totalAmount: number
  itemCount: number
  createdAt: Date | string
  items: {
    id: string
    productName: string
    price: number
    quantity: number
    subtotal: number
  }[]
}

interface CheckoutModalProps {
  transaction: TransactionSummary | null
  onClose: () => void
}

export default function CheckoutModal({ transaction, onClose }: CheckoutModalProps) {
  useEffect(() => {
    if (transaction) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF4500', '#ffffff', '#10B981'],
      })
    }
  }, [transaction])

  if (!transaction) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-dark-surface border border-dark-card rounded-2xl shadow-2xl overflow-hidden text-dark-text">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-dark-card/50 border-b border-dark-card">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold text-sm">Transaksi Berhasil</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-dark-muted hover:text-white rounded-lg hover:bg-dark-card transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Struk Receipt Content */}
        <div id="printable-receipt" className="p-6 space-y-4">
          <div className="text-center pb-4 border-b border-dashed border-dark-border">
            <div className="inline-flex p-3 bg-brand-primary/10 text-brand-primary rounded-full mb-2">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">MINI POS RITEL</h3>
            <p className="text-xs text-dark-muted mt-0.5">Bukti Pembayaran Penjualan</p>
            <div className="mt-3 inline-block px-3 py-1 bg-dark-card text-xs font-mono-numbers text-brand-primary font-semibold rounded-md border border-dark-border">
              {transaction.transactionNumber}
            </div>
            <p className="text-[11px] text-dark-muted mt-1">
              {formatDate(transaction.createdAt)}
            </p>
          </div>

          {/* Items Detail */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {transaction.items.map((item) => (
              <div key={item.id} className="flex justify-between text-xs py-1 border-b border-dark-card/60">
                <div>
                  <div className="font-medium text-dark-text">{item.productName}</div>
                  <div className="text-[11px] text-dark-muted font-mono-numbers">
                    {item.quantity} x {formatRupiah(item.price)}
                  </div>
                </div>
                <div className="font-mono-numbers font-semibold text-dark-text self-center">
                  {formatRupiah(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          {/* Total Calculation */}
          <div className="pt-3 border-t border-dashed border-dark-border space-y-1.5 text-xs">
            <div className="flex justify-between text-dark-muted">
              <span>Total Qty</span>
              <span className="font-mono-numbers text-white">{transaction.itemCount} item</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-dark-border">
              <span>Total Bayar</span>
              <span className="font-mono-numbers text-brand-primary">
                {formatRupiah(transaction.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-dark-card/60 border-t border-dark-card flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-dark-card hover:bg-dark-border text-white text-xs font-medium rounded-lg border border-dark-border transition-all"
          >
            <Printer className="w-4 h-4 text-dark-muted" />
            <span>Cetak Struk</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold rounded-lg shadow-md transition-all"
          >
            Transaksi Baru
          </button>
        </div>
      </div>
    </div>
  )
}
