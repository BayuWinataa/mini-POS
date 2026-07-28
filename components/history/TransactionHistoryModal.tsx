'use client'

import { useState } from 'react'
import { X, Search, Download, Eye, Calendar, Receipt } from 'lucide-react'
import { formatDate, formatRupiah } from '@/lib/utils'
import { exportTransactionsCSV } from '@/app/actions/exportActions'

export interface TransactionRecord {
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

interface TransactionHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  transactions: TransactionRecord[]
}

export default function TransactionHistoryModal({
  isOpen,
  onClose,
  transactions,
}: TransactionHistoryModalProps) {
  const [search, setSearch] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionRecord | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  if (!isOpen) return null

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const res = await exportTransactionsCSV()
      if (res.success && res.csvContent) {
        const blob = new Blob([res.csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', res.filename || 'riwayat_transaksi.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (err) {
      console.error('Error downloading CSV:', err)
    } finally {
      setIsExporting(false)
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    const query = search.toLowerCase()
    const matchesNumber = t.transactionNumber.toLowerCase().includes(query)
    const matchesItems = t.items.some((item) => item.productName.toLowerCase().includes(query))
    return matchesNumber || matchesItems
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#111827] border border-[#1F2937] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#F9FAFB]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1F2937]/60 border-b border-[#1F2937]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FF4500]/10 text-[#FF4500] rounded-lg">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Riwayat Transaksi Penjualan</h2>
              <p className="text-xs text-[#9CA3AF]">
                Daftar seluruh pesanan checkout yang telah berhasil diproses.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9CA3AF] hover:text-white rounded-lg hover:bg-[#1F2937] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-[#1F2937]/30 border-b border-[#1F2937] flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Cari No. Transaksi atau Nama Produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#1F2937] text-xs text-white rounded-lg border border-[#374151] focus:outline-none focus:border-[#FF4500]"
            />
          </div>

          <button
            disabled={isExporting || transactions.length === 0}
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1F2937] hover:bg-[#374151] text-white border border-[#374151] text-xs font-medium rounded-lg transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#FF4500]" />
            <span>{isExporting ? 'Mengekspor...' : 'Ekspor Laporan CSV'}</span>
          </button>
        </div>

        {/* Table List */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1F2937] text-[#9CA3AF] font-medium">
                <th className="pb-3 px-3">No. Transaksi</th>
                <th className="pb-3 px-3">Waktu Checkout</th>
                <th className="pb-3 px-3">Total Qty</th>
                <th className="pb-3 px-3">Total Bayar</th>
                <th className="pb-3 px-3 text-right">Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#6B7280]">
                    Belum ada riwayat transaksi recorded.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-[#1F2937]/40 transition-colors">
                    <td className="py-3 px-3 font-mono-numbers font-semibold text-[#FF4500]">
                      {trx.transactionNumber}
                    </td>
                    <td className="py-3 px-3 text-[#9CA3AF]">{formatDate(trx.createdAt)}</td>
                    <td className="py-3 px-3 font-mono-numbers text-[#F9FAFB]">{trx.itemCount} item</td>
                    <td className="py-3 px-3 font-mono-numbers font-bold text-[#F9FAFB]">
                      {formatRupiah(trx.totalAmount)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedTransaction(trx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1F2937] hover:bg-[#374151] text-xs text-[#F9FAFB] rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#9CA3AF]" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-modal Detail Item Transaksi */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#111827] border border-[#374151] rounded-xl shadow-2xl p-6 space-y-4 text-[#F9FAFB]">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
              <div>
                <h3 className="font-bold text-sm text-white">Rincian Transaksi</h3>
                <p className="font-mono-numbers text-xs text-[#FF4500] mt-0.5">
                  {selectedTransaction.transactionNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-[#9CA3AF] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
              {selectedTransaction.items.map((item) => (
                <div key={item.id} className="flex justify-between py-1.5 border-b border-[#1F2937]/50">
                  <div>
                    <div className="font-semibold text-white">{item.productName}</div>
                    <div className="text-[11px] text-[#9CA3AF] font-mono-numbers">
                      {item.quantity} x {formatRupiah(item.price)}
                    </div>
                  </div>
                  <div className="font-mono-numbers font-bold text-[#FF4500]">
                    {formatRupiah(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#374151] flex justify-between items-center text-xs">
              <span className="text-[#9CA3AF]">Total Bayar:</span>
              <span className="font-mono-numbers text-base font-bold text-[#FF4500]">
                {formatRupiah(selectedTransaction.totalAmount)}
              </span>
            </div>

            <button
              onClick={() => setSelectedTransaction(null)}
              className="w-full py-2 bg-[#1F2937] hover:bg-[#374151] text-xs font-medium text-white rounded-lg transition-colors"
            >
              Tutup Detail
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
