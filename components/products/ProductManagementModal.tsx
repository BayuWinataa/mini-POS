'use client'

import { useState } from 'react'
import { X, Plus, Edit2, Search, Power, Trash2 } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { Product } from '../pos/ProductCatalog'
import { createProduct, updateProduct, toggleProductStatus, deleteProduct } from '@/app/actions/productActions'

interface ProductManagementModalProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  onRefresh: () => void
}

export default function ProductManagementModal({
  isOpen,
  onClose,
  products,
  onRefresh,
}: ProductManagementModalProps) {
  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [category, setCategory] = useState('Minuman')
  const [isActive, setIsActive] = useState(true)

  const [errorMsg, setErrorMsg] = useState('')
  const [infoMsg, setInfoMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleOpenAddForm = () => {
    setEditingProduct(null)
    setName('')
    setPrice('')
    setStock('')
    setCategory('Minuman')
    setIsActive(true)
    setErrorMsg('')
    setInfoMsg('')
    setIsFormOpen(true)
  }

  const handleOpenEditForm = (product: Product) => {
    setEditingProduct(product)
    setName(product.name)
    setPrice(product.price.toString())
    setStock(product.stock.toString())
    setCategory(product.category || 'Minuman')
    setIsActive(product.isActive)
    setErrorMsg('')
    setInfoMsg('')
    setIsFormOpen(true)
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setInfoMsg('')

    const priceNum = parseInt(price, 10)
    const stockNum = parseInt(stock, 10)

    if (!name.trim()) return setErrorMsg('Nama produk wajib diisi')
    if (isNaN(priceNum) || priceNum < 100) return setErrorMsg('Harga minimal Rp 100')
    if (isNaN(stockNum) || stockNum < 0) return setErrorMsg('Stok tidak boleh negatif')

    setIsSubmitting(true)

    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, {
          name: name.trim(),
          price: priceNum,
          stock: stockNum,
          category,
          isActive,
        })
        if (!res.success) throw new Error(res.error)
      } else {
        const res = await createProduct({
          name: name.trim(),
          price: priceNum,
          stock: stockNum,
          category,
          isActive,
        })
        if (!res.success) throw new Error(res.error)
      }

      setIsFormOpen(false)
      onRefresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan produk')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleProductStatus(id)
      onRefresh()
    } catch (err) {
      console.error('Error toggling status:', err)
    }
  }

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) {
      return
    }

    setDeletingId(product.id)
    try {
      const res = await deleteProduct(product.id)
      if (res.message) {
        setInfoMsg(res.message)
        setTimeout(() => setInfoMsg(''), 4000)
      }
      onRefresh()
    } catch (err) {
      console.error('Error deleting product:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-dark-surface border border-dark-card rounded-2xl shadow-2xl overflow-hidden flex flex-col text-dark-text">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-dark-card/60 border-b border-dark-card">
          <div>
            <h2 className="font-bold text-lg text-white">Manajemen Katalog Produk</h2>
            <p className="text-xs text-dark-muted">
              Kelola stok, harga, kategori, status aktif, dan hapus produk kasir.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-dark-muted hover:text-white rounded-lg hover:bg-dark-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Notification Banner */}
        {infoMsg && (
          <div className="px-6 py-2 bg-brand-primary/10 border-b border-brand-primary/30 text-brand-primary text-xs font-medium flex justify-between items-center">
            <span>{infoMsg}</span>
            <button onClick={() => setInfoMsg('')} className="underline text-[11px]">Tutup</button>
          </div>
        )}

        {/* Toolbar Controls */}
        <div className="p-4 bg-dark-card/30 border-b border-dark-card flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
            <input
              type="text"
              placeholder="Cari nama produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-dark-card text-xs text-white rounded-lg border border-dark-border focus:outline-none focus:border-brand-primary"
            />
          </div>

          <button
            onClick={handleOpenAddForm}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white font-medium text-xs rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-dark-card text-dark-muted font-medium">
                <th className="pb-3 px-3">Nama Produk</th>
                <th className="pb-3 px-3">Kategori</th>
                <th className="pb-3 px-3">Harga Unit</th>
                <th className="pb-3 px-3">Stok Tersedia</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-card">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-dark-subtle">
                    Tidak ada produk ditemukan.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-dark-card/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-dark-text">{product.name}</td>
                    <td className="py-3 px-3 text-dark-muted">
                      <span className="px-2 py-0.5 text-[10px] bg-dark-card border border-dark-border rounded-md">
                        {product.category || 'Lainnya'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono-numbers text-brand-primary">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="py-3 px-3 font-mono-numbers">
                      <span
                        className={
                          product.stock <= 5
                            ? 'text-amber-400 font-bold'
                            : 'text-dark-text'
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                          product.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{product.isActive ? 'Aktif' : 'Non-aktif'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditForm(product)}
                        title="Edit Produk"
                        className="p-1.5 text-dark-muted hover:text-white hover:bg-dark-card rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        disabled={deletingId === product.id}
                        onClick={() => handleDeleteProduct(product)}
                        title="Hapus Produk"
                        className="p-1.5 text-dark-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-modal Form Tambah/Edit Produk */}
      {isFormOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-dark-surface border border-dark-border rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-card">
              <h3 className="font-bold text-base text-white">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-dark-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-dark-muted mb-1 font-medium">Nama Produk</label>
                <input
                  type="text"
                  placeholder="Misal: Kopi Susu Aren"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-card text-white rounded-lg border border-dark-border focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-dark-muted mb-1 font-medium">Kategori Produk</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-card text-white rounded-lg border border-dark-border focus:outline-none focus:border-brand-primary"
                >
                  <option value="Minuman">Minuman</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Snack">Snack</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-dark-muted mb-1 font-medium">Harga (Rp)</label>
                  <input
                    type="number"
                    placeholder="18000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-card text-white rounded-lg border border-dark-border focus:outline-none focus:border-brand-primary font-mono-numbers"
                  />
                </div>

                <div>
                  <label className="block text-dark-muted mb-1 font-medium">Stok Awal</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-card text-white rounded-lg border border-dark-border focus:outline-none focus:border-brand-primary font-mono-numbers"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-dark-border bg-dark-card text-brand-primary focus:ring-0"
                />
                <label htmlFor="isActiveToggle" className="text-dark-text">
                  Aktifkan produk untuk dijual di kasir
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-2 bg-dark-card text-dark-muted hover:text-white rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-brand-primary hover:bg-brand-hover text-white rounded-lg font-semibold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
