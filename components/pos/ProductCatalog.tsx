'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, PackageX, Filter } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

export interface Product {
  id: string
  name: string
  price: number
  stock: number
  isActive: boolean
}

interface ProductCatalogProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  isLoading?: boolean
}

export default function ProductCatalog({
  products,
  onAddToCart,
  isLoading = false,
}: ProductCatalogProps) {
  const [search, setSearch] = useState('')
  const [filterActiveOnly, setFilterActiveOnly] = useState(true)

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterActiveOnly ? p.isActive : true
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#111827] p-4 rounded-xl border border-[#1F2937] shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Cari produk (misal: Kopi, Roti)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1F2937] text-white text-sm rounded-lg border border-[#374151] focus:outline-none focus:border-[#FF4500] placeholder-[#6B7280] transition-colors"
          />
        </div>

        <button
          onClick={() => setFilterActiveOnly(!filterActiveOnly)}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-all ${
            filterActiveOnly
              ? 'bg-[#FF4500]/10 border-[#FF4500]/40 text-[#FF4500]'
              : 'bg-[#1F2937] border-[#374151] text-[#9CA3AF] hover:text-white'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>{filterActiveOnly ? 'Hanya Produk Aktif' : 'Tampilkan Semua'}</span>
        </button>
      </div>

      {/* Grid Katalog Produk */}
      <div className="flex-1 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 6].map((i) => (
              <div
                key={i}
                className="h-36 bg-[#111827] border border-[#1F2937] rounded-xl animate-pulse p-4 space-y-3"
              >
                <div className="h-4 bg-[#1F2937] rounded w-3/4" />
                <div className="h-4 bg-[#1F2937] rounded w-1/2" />
                <div className="h-8 bg-[#1F2937] rounded w-full mt-4" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-[#111827]/50 rounded-xl border border-dashed border-[#374151] p-8 text-center">
            <PackageX className="w-12 h-12 text-[#6B7280] mb-3" />
            <h4 className="text-sm font-semibold text-[#F9FAFB]">Produk Tidak Ditemukan</h4>
            <p className="text-xs text-[#9CA3AF] mt-1 max-w-xs">
              {search
                ? `Tidak ada produk yang cocok dengan pencarian "${search}".`
                : 'Belum ada produk yang tersedia di katalog.'}
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
                    className={`group relative flex flex-col justify-between p-4 bg-[#111827] rounded-xl border transition-all duration-200 ${
                      !product.isActive
                        ? 'opacity-60 border-[#1F2937] bg-[#111827]/40'
                        : 'border-[#1F2937] hover:border-[#FF4500]/50 hover:shadow-lg hover:shadow-[#FF4500]/5'
                    }`}
                  >
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm text-[#F9FAFB] line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
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
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#1F2937]">
                      <div className="font-mono-numbers text-base font-bold text-[#FF4500]">
                        {formatRupiah(product.price)}
                      </div>

                      <button
                        disabled={!product.isActive || isOutOfStock}
                        onClick={() => onAddToCart(product)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          !product.isActive || isOutOfStock
                            ? 'bg-[#1F2937] text-[#6B7280] cursor-not-allowed'
                            : 'bg-[#FF4500] hover:bg-[#E03E00] text-white shadow-sm hover:shadow-[#FF4500]/20 active:scale-95'
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
