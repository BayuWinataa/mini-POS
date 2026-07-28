'use client'

import { Store, Package, History, RefreshCw } from 'lucide-react'

interface HeaderProps {
  isLoading: boolean
  onOpenProductModal: () => void
  onOpenHistoryModal: () => void
  onRefresh: () => void
}

export default function Header({
  isLoading,
  onOpenProductModal,
  onOpenHistoryModal,
  onRefresh,
}: HeaderProps) {
  return (
    <header className="h-16 px-6 bg-dark-surface border-b border-dark-card flex items-center justify-between shrink-0 shadow-md">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/25">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base tracking-tight text-white">MINI POS</h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-brand-primary/10 text-brand-primary rounded-full border border-brand-primary/20">
              PROD v1.0
            </span>
          </div>
          <p className="text-[11px] text-dark-muted">Point of Sale & Management Ritel</p>
        </div>
      </div>

      {/* Action Controls Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenProductModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-dark-card hover:bg-dark-border text-xs font-medium rounded-lg border border-dark-border transition-colors text-dark-text"
        >
          <Package className="w-4 h-4 text-brand-primary" />
          <span className="hidden sm:inline">Manajemen Produk</span>
        </button>

        <button
          onClick={onOpenHistoryModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-dark-card hover:bg-dark-border text-xs font-medium rounded-lg border border-dark-border transition-colors text-dark-text"
        >
          <History className="w-4 h-4 text-brand-primary" />
          <span className="hidden sm:inline">Riwayat Transaksi</span>
        </button>

        <button
          onClick={onRefresh}
          title="Refresh Data"
          className="p-2 bg-dark-card hover:bg-dark-border text-dark-muted hover:text-white rounded-lg border border-dark-border transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  )
}
