'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, PackageX, Filter, Coffee, Utensils, LayoutGrid, Cookie, MoreHorizontal } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

export interface Product {
  id: string
  name: string
  price: number
  stock: number
  category?: string
  isActive: boolean
}

interface ProductCatalogProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  isLoading?: boolean
}

const CATEGORIES = [
  { id: 'all', label: 'Semua', icon: LayoutGrid },
  { id: 'minuman', label: 'Minuman', icon: Coffee },
  { id: 'makanan', label: 'Makanan', icon: Utensils },
  { id: 'snack', label: 'Snack', icon: Cookie },
  { id: 'lainnya', label: 'Lainnya', icon: MoreHorizontal },
]

export default function ProductCatalog({
  products,
  onAddToCart,
  isLoading = false,
}: ProductCatalogProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filterActiveOnly, setFilterActiveOnly] = useState(true)

  const getProductCategory = (p: Product) => {
    if (p.category) {
      return p.category.toLowerCase()
    }

    const lower = p.name.toLowerCase()
    if (
      lower.includes('kopi') ||
      lower.includes('teh') ||
      lower.includes('latte') ||
      lower.includes('americano') ||
      lower.includes('air') ||
      lower.includes('ice') ||
      lower.includes('minum')
    ) {
      return 'minuman'
    }
    if (
      lower.includes('snack') ||
      lower.includes('keripik') ||
      lower.includes('biskuit')
    ) {
      return 'snack'
    }
    if (
      lower.includes('roti') ||
      lower.includes('croissant') ||
      lower.includes('nasi') ||
      lower.includes('goreng') ||
      lower.includes('makan')
    ) {
      return 'makanan'
    }
    return 'lainnya'
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterActiveOnly ? p.isActive : true
    const category = getProductCategory(p)
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory
    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 bg-dark-surface p-4 rounded-xl border border-dark-card shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
            <input
              id="pos-search-input"
              type="text"
              placeholder="Cari produk (Tekan '/' untuk fokus)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-card text-white text-sm rounded-lg border border-dark-border focus:outline-none focus:border-brand-primary placeholder-dark-subtle transition-colors"
            />
          </div>

          <button
            onClick={() => setFilterActiveOnly(!filterActiveOnly)}
            className={`flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-all ${
              filterActiveOnly
                ? 'bg-brand-primary/10 border-brand-primary/40 text-brand-primary'
                : 'bg-dark-card border-dark-border text-dark-muted hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{filterActiveOnly ? 'Hanya Aktif' : 'Tampilkan Semua'}</span>
          </button>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-dark-card text-dark-muted hover:text-white hover:bg-dark-border border border-dark-border'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid Katalog Produk */}
      <div className="flex-1 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 6].map((i) => (
              <div
                key={i}
                className="h-36 bg-dark-surface border border-dark-card rounded-xl animate-pulse p-4 space-y-3"
              >
                <div className="h-4 bg-dark-card rounded w-3/4" />
                <div className="h-4 bg-dark-card rounded w-1/2" />
                <div className="h-8 bg-dark-card rounded w-full mt-4" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-dark-surface/50 rounded-xl border border-dashed border-dark-border p-8 text-center">
            <PackageX className="w-12 h-12 text-dark-subtle mb-3" />
            <h4 className="text-sm font-semibold text-dark-text">Produk Tidak Ditemukan</h4>
            <p className="text-xs text-dark-muted mt-1 max-w-xs">
              {search
                ? `Tidak ada produk yang cocok dengan pencarian "${search}".`
                : 'Belum ada produk yang tersedia di kategori ini.'}
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock <= 0
                const isLowStock = product.stock > 0 && product.stock <= 5

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`group relative flex flex-col justify-between p-4 bg-dark-surface rounded-xl border transition-all duration-200 ${
                      !product.isActive
                        ? 'opacity-60 border-dark-card bg-dark-surface/40'
                        : 'border-dark-card hover:border-brand-primary/50 hover:shadow-lg hover:shadow-brand-primary/5'
                    }`}
                  >
                    {/* Status & Category Badge */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-sm text-dark-text line-clamp-2 leading-snug">
                          {product.name}
                        </h3>
                        <span className="inline-block mt-1 text-[10px] text-dark-muted font-medium bg-dark-card px-1.5 py-0.5 rounded border border-dark-border">
                          {product.category || 'Lainnya'}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                          !product.isActive
                            ? 'bg-gray-800 text-gray-400 border border-gray-700'
                            : isOutOfStock
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : isLowStock
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {!product.isActive
                          ? 'Nonaktif'
                          : isOutOfStock
                          ? 'Habis'
                          : isLowStock
                          ? `Sisa ${product.stock}`
                          : `Stok ${product.stock}`}
                      </span>
                    </div>

                    {/* Pricing & Action */}
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-dark-card">
                      <div className="font-mono-numbers text-base font-bold text-brand-primary">
                        {formatRupiah(product.price)}
                      </div>

                      <button
                        disabled={!product.isActive || isOutOfStock}
                        onClick={() => onAddToCart(product)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          !product.isActive || isOutOfStock
                            ? 'bg-dark-card text-dark-subtle cursor-not-allowed'
                            : 'bg-brand-primary hover:bg-brand-hover text-white shadow-sm hover:shadow-brand-primary/20 active:scale-95'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah</span>
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
