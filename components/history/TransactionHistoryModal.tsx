'use client'

import { useState } from 'react'
import { X, Search, Download, Eye, Receipt } from 'lucide-react'
import { formatDate, formatRupiah } from '@/lib/utils'
import { exportTransactionsCSV } from '@/app/actions/exportActions'

import { TransactionRecord } from '@/types/pos'
export type { TransactionRecord }

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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] bg-dark-surface border border-dark-card rounded-2xl shadow-2xl overflow-hidden flex flex-col text-dark-text cursor-default"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-dark-card/60 border-b border-dark-card">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-dark-text">Riwayat Transaksi Penjualan</h2>
              <p className="text-xs text-dark-muted">
                Daftar seluruh pesanan checkout yang telah berhasil diproses.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-dark-muted hover:text-dark-text rounded-lg hover:bg-dark-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-dark-card/30 border-b border-dark-card flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
            <input
              type="text"
              placeholder="Cari No. Transaksi atau Nama Produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-dark-card text-xs text-dark-text rounded-lg border border-dark-border focus:outline-none focus:border-brand-primary"
            />
          </div>

          <button
            disabled={isExporting || transactions.length === 0}
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-dark-card hover:bg-dark-border text-dark-text border border-dark-border text-xs font-medium rounded-lg transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-brand-primary" />
            <span>{isExporting ? 'Mengekspor...' : 'Ekspor Laporan CSV'}</span>
          </button>
        </div>

        {/* Table List */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-dark-card text-dark-muted font-medium">
                <th className="pb-3 px-3">No. Transaksi</th>
                <th className="pb-3 px-3">Waktu Checkout</th>
                <th className="pb-3 px-3">Total Qty</th>
                <th className="pb-3 px-3">Total Bayar</th>
                <th className="pb-3 px-3 text-right">Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-card">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-dark-subtle">
                    Belum ada riwayat transaksi recorded.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-dark-card/40 transition-colors">
                    <td className="py-3 px-3 font-mono-numbers font-semibold text-brand-primary">
                      {trx.transactionNumber}
                    </td>
                    <td className="py-3 px-3 text-dark-muted">{formatDate(trx.createdAt)}</td>
                    <td className="py-3 px-3 font-mono-numbers text-dark-text">{trx.itemCount} item</td>
                    <td className="py-3 px-3 font-mono-numbers font-bold text-dark-text">
                      {formatRupiah(trx.totalAmount)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedTransaction(trx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-dark-card hover:bg-dark-border text-xs text-dark-text rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-dark-muted" />
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
        <div
          onClick={() => setSelectedTransaction(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-dark-surface border border-dark-border rounded-xl shadow-2xl p-6 space-y-4 text-dark-text cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-dark-card">
              <div>
                <h3 className="font-bold text-sm text-dark-text">Rincian Transaksi</h3>
                <p className="font-mono-numbers text-xs text-brand-primary mt-0.5">
                  {selectedTransaction.transactionNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-dark-muted hover:text-dark-text"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
              {selectedTransaction.items.map((item) => (
                <div key={item.id} className="flex justify-between py-1.5 border-b border-dark-card/50">
                  <div>
                    <div className="font-semibold text-dark-text">{item.productName}</div>
                    <div className="text-[11px] text-dark-muted font-mono-numbers">
                      {item.quantity} x {formatRupiah(item.price)}
                    </div>
                  </div>
                  <div className="font-mono-numbers font-bold text-brand-primary">
                    {formatRupiah(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-dark-border flex justify-between items-center text-xs">
              <span className="text-dark-muted">Total Bayar:</span>
              <span className="font-mono-numbers text-base font-bold text-brand-primary">
                {formatRupiah(selectedTransaction.totalAmount)}
              </span>
            </div>

            <button
              onClick={() => setSelectedTransaction(null)}
              className="w-full py-2 bg-dark-card hover:bg-dark-border text-xs font-medium text-dark-text rounded-lg transition-colors"
            >
              Tutup Detail
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
