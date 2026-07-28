'use client'

import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, AlertTriangle } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { Product } from './ProductCatalog'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartPanelProps {
  cart: CartItem[]
  onUpdateQuantity: (productId: string, delta: number) => void
  onRemoveItem: (productId: string) => void
  onClearCart: () => void
  onCheckout: () => void
  isSubmitting?: boolean
}

export default function CartPanel({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  isSubmitting = false,
}: CartPanelProps) {
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

  return (
    <div className="flex flex-col h-full bg-[#111827] rounded-xl border border-[#1F2937] overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 bg-[#1F2937]/50 border-b border-[#1F2937]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#FF4500]/10 text-[#FF4500] rounded-lg">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-[#F9FAFB]">Keranjang Belanja</h2>
            <p className="text-xs text-[#9CA3AF]">
              {totalItemCount > 0 ? `${totalItemCount} item dipilih` : 'Belum ada produk'}
            </p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-[#9CA3AF] hover:text-red-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
            <div className="p-4 bg-[#1F2937] rounded-full text-[#6B7280]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#F9FAFB]">Keranjang Anda Kosong</h4>
              <p className="text-xs text-[#9CA3AF] mt-1">
                Pilih produk dari katalog di sebelah kiri untuk menambah ke keranjang.
              </p>
            </div>
          </div>
        ) : (
          cart.map(({ product, quantity }) => {
            const isStockMaxed = quantity >= product.stock

            return (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-[#1F2937]/40 rounded-lg border border-[#1F2937] hover:border-[#374151] transition-all"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-xs font-semibold text-[#F9FAFB] truncate">
                    {product.name}
                  </h4>
                  <div className="font-mono-numbers text-xs text-[#FF4500] mt-0.5">
                    {formatRupiah(product.price)}
                  </div>
                  {isStockMaxed && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Maksimal stok tercapai</span>
                    </div>
                  )}
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center bg-[#1F2937] border border-[#374151] rounded-lg p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(product.id, -1)}
                      className="p-1 text-[#9CA3AF] hover:text-white rounded hover:bg-[#374151] transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono-numbers text-xs font-semibold px-2 min-w-[24px] text-center text-[#F9FAFB]">
                      {quantity}
                    </span>
                    <button
                      disabled={isStockMaxed}
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      className={`p-1 rounded transition-colors ${
                        isStockMaxed
                          ? 'text-[#4B5563] cursor-not-allowed'
                          : 'text-[#9CA3AF] hover:text-white hover:bg-[#374151]'
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(product.id)}
                    className="p-1.5 text-[#6B7280] hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Cart Summary & Checkout Action */}
      {cart.length > 0 && (
        <div className="p-4 bg-[#1F2937]/80 border-t border-[#1F2937] space-y-3">
          <div className="space-y-1.5 text-xs text-[#9CA3AF]">
            <div className="flex justify-between">
              <span>Total Item</span>
              <span className="font-mono-numbers text-[#F9FAFB]">{totalItemCount} unit</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#374151]">
              <span className="text-sm font-semibold text-[#F9FAFB]">Total Bayar</span>
              <span className="font-mono-numbers text-lg font-bold text-[#FF4500]">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            onClick={onCheckout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#FF4500] hover:bg-[#E03E00] active:scale-[0.99] text-white font-semibold text-sm rounded-lg shadow-lg shadow-[#FF4500]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Proses Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
