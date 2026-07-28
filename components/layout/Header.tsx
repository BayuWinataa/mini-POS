'use client'

import Image from 'next/image'
import { Package, History, RefreshCw, Sun, Moon, BarChart3 } from 'lucide-react'
import { useTheme } from '@/providers/theme-provider'

interface HeaderProps {
  isLoading: boolean
  onOpenProductModal: () => void
  onOpenHistoryModal: () => void
  onOpenAnalyticsModal: () => void
  onRefresh: () => void
}

export default function Header({
  isLoading,
  onOpenProductModal,
  onOpenHistoryModal,
  onOpenAnalyticsModal,
  onRefresh,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="h-16 px-6 bg-dark-surface border-b border-dark-card flex items-center justify-between shrink-0 shadow-md transition-colors duration-200">
      <div className="flex items-center gap-3">
        <Image
          src="/logo.jpg"
          alt="MINI POS Logo"
          width={36}
          height={36}
          className="w-9 h-9 rounded-xl object-cover shadow-md shadow-brand-primary/20 border border-brand-primary/30 shrink-0"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base tracking-tight text-dark-text">MINI POS</h1>
          </div>
          <p className="text-[11px] text-dark-muted">Point of Sale & Management Ritel</p>
        </div>
      </div>

      {/* Action Controls Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenAnalyticsModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-semibold rounded-lg border border-brand-primary/30 transition-all shadow-sm"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard Analisis</span>
        </button>

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
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          className="p-2 bg-dark-card hover:bg-dark-border text-dark-muted hover:text-dark-text rounded-lg border border-dark-border transition-all duration-200"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 animate-fade-in" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-fade-in" />
          )}
        </button>

        <button
          onClick={onRefresh}
          title="Refresh Data"
          className="p-2 bg-dark-card hover:bg-dark-border text-dark-muted hover:text-dark-text rounded-lg border border-dark-border transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  )
}
