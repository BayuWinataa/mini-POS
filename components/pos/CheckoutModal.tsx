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
      <div className="relative w-full max-w-md bg-[#111827] border border-[#1F2937] rounded-2xl shadow-2xl overflow-hidden text-[#F9FAFB]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1F2937]/50 border-b border-[#1F2937]">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold text-sm">Transaksi Berhasil</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-[#1F2937] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Struk Receipt Content */}
        <div id="printable-receipt" className="p-6 space-y-4">
          <div className="text-center pb-4 border-b border-dashed border-[#374151]">
            <div className="inline-flex p-3 bg-[#FF4500]/10 text-[#FF4500] rounded-full mb-2">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">MINI POS RITEL</h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Bukti Pembayaran Penjualan</p>
            <div className="mt-3 inline-block px-3 py-1 bg-[#1F2937] text-xs font-mono-numbers text-[#FF4500] font-semibold rounded-md border border-[#374151]">
              {transaction.transactionNumber}
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1">
              {formatDate(transaction.createdAt)}
            </p>
          </div>

          {/* Items Detail */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {transaction.items.map((item) => (
              <div key={item.id} className="flex justify-between text-xs py-1 border-b border-[#1F2937]/60">
                <div>
                  <div className="font-medium text-[#F9FAFB]">{item.productName}</div>
                  <div className="text-[11px] text-[#9CA3AF] font-mono-numbers">
                    {item.quantity} x {formatRupiah(item.price)}
                  </div>
                </div>
                <div className="font-mono-numbers font-semibold text-[#F9FAFB] self-center">
                  {formatRupiah(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          {/* Total Calculation */}
          <div className="pt-3 border-t border-dashed border-[#374151] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#9CA3AF]">
              <span>Total Qty</span>
              <span className="font-mono-numbers text-white">{transaction.itemCount} item</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#374151]">
              <span>Total Bayar</span>
              <span className="font-mono-numbers text-[#FF4500]">
                {formatRupiah(transaction.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-[#1F2937]/60 border-t border-[#1F2937] flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1F2937] hover:bg-[#374151] text-white text-xs font-medium rounded-lg border border-[#374151] transition-all"
          >
            <Printer className="w-4 h-4 text-[#9CA3AF]" />
            <span>Cetak Struk</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#FF4500] hover:bg-[#E03E00] text-white text-xs font-semibold rounded-lg shadow-md transition-all"
          >
            Transaksi Baru
          </button>
        </div>
      </div>
    </div>
  )
}
