'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  TrendingUp,
  ShoppingBag,
  Package,
  Calendar,
  BarChart3,
  PieChart,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { Product, TransactionRecord } from '@/types/pos'
import { useTheme } from '@/providers/theme-provider'
import {
  AnalyticsTimeRange,
  filterTransactionsByRange,
  getKPISummary,
  getRevenueTrendChartData,
  getTopProductsChartData,
  getCategoryDistributionChartData,
  getPeakHoursChartData,
} from '@/lib/analytics'

// Chart.js imports & registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface AnalyticsDashboardModalProps {
  isOpen: boolean
  onClose: () => void
  transactions: TransactionRecord[]
  products: Product[]
}

export default function AnalyticsDashboardModal({
  isOpen,
  onClose,
  transactions,
  products,
}: AnalyticsDashboardModalProps) {
  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>('7d')
  const { theme } = useTheme()

  if (!isOpen) return null

  const isDark = theme === 'dark'
  const textColor = isDark ? '#9CA3AF' : '#475569'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.07)'

  // Process filtered transactions
  const filteredTrx = filterTransactionsByRange(transactions, timeRange)
  const kpi = getKPISummary(filteredTrx, products)

  // Chart dataset processing
  const revenueTrend = getRevenueTrendChartData(filteredTrx, timeRange)
  const topProducts = getTopProductsChartData(filteredTrx)
  const categoryDist = getCategoryDistributionChartData(filteredTrx, products)
  const peakHours = getPeakHoursChartData(filteredTrx)

  // 1. Revenue Trend Line Chart Config
  const lineChartData = {
    labels: revenueTrend.labels.length > 0 ? revenueTrend.labels : ['Hari ini'],
    datasets: [
      {
        label: 'Omset Penjualan (Rp)',
        data: revenueTrend.revenues.length > 0 ? revenueTrend.revenues : [0],
        borderColor: '#FF4500',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 300)
          gradient.addColorStop(0, 'rgba(255, 69, 0, 0.4)')
          gradient.addColorStop(1, 'rgba(255, 69, 0, 0.0)')
          return gradient
        },
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#FF4500',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
    ],
  }

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => ` Omset: ${formatRupiah(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: textColor, font: { size: 11 } },
        grid: { color: gridColor },
      },
      y: {
        ticks: {
          color: textColor,
          font: { size: 11 },
          callback: (value: any) => `Rp ${(value / 1000).toLocaleString('id-ID')}rb`,
        },
        grid: { color: gridColor },
      },
    },
  }

  // 2. Top Products Bar Chart Config
  const topProductsChartData = {
    labels: topProducts.labels.length > 0 ? topProducts.labels : ['Belum Ada Data'],
    datasets: [
      {
        label: 'Jumlah Terjual (Qty)',
        data: topProducts.quantities.length > 0 ? topProducts.quantities : [0],
        backgroundColor: '#3B82F6',
        borderRadius: 6,
      },
    ],
  }

  const topProductsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => ` Terjual: ${context.raw} unit`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: textColor, font: { size: 11 } },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textColor, font: { size: 11 } },
        grid: { display: false },
      },
    },
  }

  // 3. Category Doughnut Chart Config
  const categoryChartData = {
    labels: categoryDist.labels.length > 0 ? categoryDist.labels : ['Belum Ada Data'],
    datasets: [
      {
        data: categoryDist.values.length > 0 ? categoryDist.values : [1],
        backgroundColor: [
          '#FF4500',
          '#10B981',
          '#F59E0B',
          '#8B5CF6',
          '#EC4899',
          '#3B82F6',
        ],
        borderWidth: isDark ? 2 : 1,
        borderColor: isDark ? '#1F2937' : '#FFFFFF',
      },
    ],
  }

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { color: textColor, font: { size: 11 }, padding: 12 },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => ` Omset: ${formatRupiah(context.raw)}`,
        },
      },
    },
  }

  // 4. Peak Hours Bar Chart Config
  const peakHoursChartData = {
    labels: peakHours.labels,
    datasets: [
      {
        label: 'Jumlah Transaksi',
        data: peakHours.data,
        backgroundColor: '#10B981',
        borderRadius: 4,
      },
    ],
  }

  const peakHoursOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.raw} Transaksi`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: textColor, font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: textColor, font: { size: 10 }, stepSize: 1 },
        grid: { color: gridColor },
      },
    },
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md cursor-pointer animate-fade-in"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl max-h-[92vh] bg-dark-surface border border-dark-border rounded-2xl shadow-2xl flex flex-col overflow-hidden cursor-default transition-colors duration-200"
      >
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 bg-dark-card/60 border-b border-dark-card gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-xl border border-brand-primary/20">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg tracking-tight text-dark-text">
                  Dashboard Analisis Penjualan
                </h2>
              </div>
              <p className="text-xs text-dark-muted">
                Statistik performa ritel, grafik omset, tren produk terlaris & analisis waktu ramai.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Time Range Selector */}
            <div className="flex items-center bg-dark-card border border-dark-border rounded-xl p-1 text-xs">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${timeRange === '7d'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-dark-muted hover:text-dark-text'
                  }`}
              >
                7 Hari
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${timeRange === '30d'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-dark-muted hover:text-dark-text'
                  }`}
              >
                30 Hari
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${timeRange === 'all'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-dark-muted hover:text-dark-text'
                  }`}
              >
                Semua
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-dark-muted hover:text-dark-text rounded-xl hover:bg-dark-card transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Key Performance Indicator (KPI) Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-dark-card border border-dark-border rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <div className="text-[11px] font-medium uppercase text-dark-muted tracking-wider">
                  Total Omset
                </div>
                <div className="font-mono-numbers text-xl font-extrabold text-brand-primary mt-1">
                  {formatRupiah(kpi.totalRevenue)}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-500 mt-1 font-medium">
                  <ArrowUpRight className="w-3 h-3" /> Terhitung Akumulasi
                </div>
              </div>
              <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 bg-dark-card border border-dark-border rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <div className="text-[11px] font-medium uppercase text-dark-muted tracking-wider">
                  Total Pesanan
                </div>
                <div className="font-mono-numbers text-xl font-extrabold text-dark-text mt-1">
                  {kpi.totalOrders} Transaksi
                </div>
                <div className="text-[10px] text-dark-muted mt-1 font-medium">
                  Pesanan Berhasil
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 bg-dark-card border border-dark-border rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <div className="text-[11px] font-medium uppercase text-dark-muted tracking-wider">
                  Rata-rata Transaksi (AOV)
                </div>
                <div className="font-mono-numbers text-xl font-extrabold text-emerald-500 dark:text-emerald-400 mt-1">
                  {formatRupiah(kpi.averageOrderValue)}
                </div>
                <div className="text-[10px] text-dark-muted mt-1 font-medium">
                  Rata-rata per Struk
                </div>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 bg-dark-card border border-dark-border rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <div className="text-[11px] font-medium uppercase text-dark-muted tracking-wider">
                  Total Produk Terjual
                </div>
                <div className="font-mono-numbers text-xl font-extrabold text-amber-500 dark:text-amber-400 mt-1">
                  {kpi.totalItemsSold} Qty
                </div>
                <div className="text-[10px] text-dark-muted mt-1 font-medium truncate">
                  Kategori Utama: <span className="text-dark-text font-semibold">{kpi.topCategoryName}</span>
                </div>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* 2. Main Charts Section (Row 1: Line Chart & Doughnut Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Trend Line Chart */}
            <div className="lg:col-span-2 p-5 bg-dark-card border border-dark-border rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-dark-text flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-primary" />
                    <span>Tren Omset Penjualan</span>
                  </h3>
                  <p className="text-[11px] text-dark-muted mt-0.5">
                    Grafik perjalanan pendapatan kasir sesuai rentang waktu.
                  </p>
                </div>
              </div>

              <div className="h-64 relative">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>

            {/* Category Share Doughnut Chart */}
            <div className="p-5 bg-dark-card border border-dark-border rounded-2xl space-y-4 shadow-sm">
              <div>
                <h3 className="font-bold text-sm text-dark-text flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-500" />
                  <span>Distribusi Kategori</span>
                </h3>
                <p className="text-[11px] text-dark-muted mt-0.5">
                  Persentase kontribusi pendapatan per kategori produk.
                </p>
              </div>

              <div className="h-64 relative flex items-center justify-center">
                <Doughnut data={categoryChartData} options={categoryOptions} />
              </div>
            </div>
          </div>

          {/* 3. Secondary Charts Section (Row 2: Top Products & Peak Hours) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 5 Products Bar Chart */}
            <div className="p-5 bg-dark-card border border-dark-border rounded-2xl space-y-4 shadow-sm">
              <div>
                <h3 className="font-bold text-sm text-dark-text flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-500" />
                  <span>Top 5 Produk Terlaris (Qty)</span>
                </h3>
                <p className="text-[11px] text-dark-muted mt-0.5">
                  Produk dengan volume penjualan paling tinggi di toko Anda.
                </p>
              </div>

              <div className="h-60 relative">
                <Bar data={topProductsChartData} options={topProductsOptions} />
              </div>
            </div>

            {/* Peak Hours Bar Chart */}
            <div className="p-5 bg-dark-card border border-dark-border rounded-2xl space-y-4 shadow-sm">
              <div>
                <h3 className="font-bold text-sm text-dark-text flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Analisis Jam Sibuk Penjualan (08:00 - 22:00)</span>
                </h3>
                <p className="text-[11px] text-dark-muted mt-0.5">
                  Frekuensi transaksi kasir berdasarkan jam operasional harian.
                </p>
              </div>

              <div className="h-60 relative">
                <Bar data={peakHoursChartData} options={peakHoursOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-dark-card/80 border-t border-dark-card flex justify-between items-center text-xs shrink-0">
          <div className="text-dark-muted font-medium">
            Menampilkan data dari <span className="text-dark-text font-semibold">{filteredTrx.length} transaksi</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-dark-card hover:bg-dark-border text-dark-text font-medium rounded-xl border border-dark-border transition-colors shadow-sm"
          >
            Tutup Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  )
}
