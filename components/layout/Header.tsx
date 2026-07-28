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
          onClick={onOpenProductModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#1F2937] hover:bg-[#374151] text-xs font-medium rounded-lg border border-[#374151] transition-colors"
        >
          <Package className="w-4 h-4 text-[#FF4500]" />
          <span className="hidden sm:inline">Manajemen Produk</span>
        </button>

        <button
          onClick={onOpenHistoryModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#1F2937] hover:bg-[#374151] text-xs font-medium rounded-lg border border-[#374151] transition-colors"
        >
          <History className="w-4 h-4 text-[#FF4500]" />
          <span className="hidden sm:inline">Riwayat Transaksi</span>
        </button>

        <button
          onClick={onRefresh}
          title="Refresh Data"
          className="p-2 bg-[#1F2937] hover:bg-[#374151] text-[#9CA3AF] hover:text-white rounded-lg border border-[#374151] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  )
}
