'use client'

import { Store, Package, History, RefreshCw, TrendingUp } from 'lucide-[#FF4500]'
import { Store as StoreIcon, Package as PackageIcon, History as HistoryIcon, RefreshCw as RefreshIcon, TrendingUp as TrendingIcon } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

interface HeaderProps {
  isLoading: boolean
  todaySalesTotal?: number
  todayTransactionCount?: number
  onOpenProductModal: () => void
  onOpenHistoryModal: () => void
  onRefresh: () => void
}

export default function Header({
  isLoading,
  todaySalesTotal = 0,
  todayTransactionCount = 0,
  onOpenProductModal,
  onOpenHistoryModal,
  onRefresh,
}: HeaderProps) {
  return (
    <header className="h-16 px-6 bg-dark-surface border-b border-dark-card flex items-center justify-between shrink-0 shadow-md">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/25">
          <StoreIcon className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base tracking-tight text-white">MINI POS</h1>
          </div>
          <p className="text-[11px] text-dark-muted">Point of Sale & Management Ritel</p>
        </div>
      </div>

      {/* Today Sales Summary Widget */}
      <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-dark-card/60 rounded-xl border border-dark-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <TrendingIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-dark-muted uppercase font-medium">Omset Hari Ini</div>
            <div className="font-mono-numbers text-xs font-bold text-emerald-400">
              {formatRupiah(todaySalesTotal)}
            </div>
          </div>
        </div>
        <div className="h-6 w-px bg-dark-border" />
        <div className="text-right">
          <div className="text-[10px] text-dark-muted uppercase font-medium">Transaksi</div>
          <div className="font-mono-numbers text-xs font-semibold text-white">
            {todayTransactionCount} pesanan
          </div>
        </div>
      </div>

      {/* Action Controls Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenProductModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-dark-card hover:bg-dark-border text-xs font-medium rounded-lg border border-dark-border transition-colors text-dark-text"
        >
          <PackageIcon className="w-4 h-4 text-brand-primary" />
          <span className="hidden sm:inline">Manajemen Produk</span>
        </button>

        <button
          onClick={onOpenHistoryModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-dark-card hover:bg-dark-border text-xs font-medium rounded-lg border border-dark-border transition-colors text-dark-text"
        >
          <HistoryIcon className="w-4 h-4 text-brand-primary" />
          <span className="hidden sm:inline">Riwayat Transaksi</span>
        </button>

        <button
          onClick={onRefresh}
          title="Refresh Data"
          className="p-2 bg-dark-card hover:bg-dark-border text-dark-muted hover:text-white rounded-lg border border-dark-border transition-colors"
        >
          <RefreshIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  )
}
