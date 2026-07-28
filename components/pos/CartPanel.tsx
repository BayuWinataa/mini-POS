'use client'

import { useState } from 'react'
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, AlertTriangle, Tag, Percent, DollarSign, Ticket, X } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { Product, CartItem, DiscountType } from '@/types/pos'
export type { CartItem }

interface CartPanelProps {
  cart: CartItem[]
  subtotal: number
  discountType: DiscountType
  discountValue: number
  discountAmount: number
  finalTotal: number
  activeVoucherCode?: string
  onSetDiscountType: (type: DiscountType) => void
  onSetDiscountValue: (val: number) => void
  onApplyVoucherCode: (code: string) => void
  onClearDiscount: () => void
  onUpdateQuantity: (productId: string, delta: number) => void
  onRemoveItem: (productId: string) => void
  onClearCart: () => void
  onCheckout: () => void
  isSubmitting?: boolean
}

export default function CartPanel({
  cart,
  subtotal,
  discountType,
  discountValue,
  discountAmount,
  finalTotal,
  activeVoucherCode,
  onSetDiscountType,
  onSetDiscountValue,
  onApplyVoucherCode,
  onClearDiscount,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  isSubmitting = false,
}: CartPanelProps) {
  const [showDiscountInput, setShowDiscountInput] = useState(false)
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="flex flex-col h-full bg-dark-surface rounded-xl border border-dark-card overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 bg-dark-card/50 border-b border-dark-card">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-dark-text">Keranjang Belanja</h3>
            <p className="text-[11px] text-dark-muted">
              {cart.length > 0 ? `${cart.length} item dipilih` : 'Belum ada produk'}
            </p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="flex items-center gap-1 text-xs text-dark-subtle hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-dark-subtle space-y-2">
            <div className="p-4 bg-dark-card rounded-full">
              <ShoppingBag className="w-8 h-8 text-dark-subtle" />
            </div>
            <h4 className="font-semibold text-sm text-dark-text">Keranjang Anda Kosong</h4>
            <p className="text-xs text-dark-muted max-w-[200px]">
              Pilih produk dari katalog di sebelah kiri untuk menambah ke keranjang.
            </p>
          </div>
        ) : (
          cart.map((item) => {
            const { product, quantity } = item
            const isStockMaxed = quantity >= product.stock

            return (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-dark-card/60 rounded-xl border border-dark-border/80 group hover:border-brand-primary/30 transition-colors"
              >
                {/* Product Name & Price */}
                <div className="flex-1 min-w-0 pr-3">
                  <h4 className="font-semibold text-xs text-dark-text truncate">
                    {product.name}
                  </h4>
                  <div className="font-mono-numbers text-xs text-brand-primary mt-0.5">
                    {formatRupiah(product.price)}
                  </div>
                  {isStockMaxed && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Maksimal stok</span>
                    </div>
                  )}
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center bg-dark-card border border-dark-border rounded-lg p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(product.id, -1)}
                      className="p-1 text-dark-muted hover:text-dark-text rounded hover:bg-dark-border transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono-numbers text-xs font-semibold px-2 min-w-[24px] text-center text-dark-text">
                      {quantity}
                    </span>
                    <button
                      disabled={isStockMaxed}
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      className={`p-1 rounded transition-colors ${
                        isStockMaxed
                          ? 'text-dark-subtle cursor-not-allowed'
                          : 'text-dark-muted hover:text-dark-text hover:bg-dark-border'
                      }`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(product.id)}
                    className="p-1.5 text-dark-subtle hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
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
        <div className="p-4 bg-dark-card/80 border-t border-dark-card space-y-3 shrink-0">
          {/* Discount & Voucher Section */}
          <div className="p-3 bg-dark-surface rounded-xl border border-dark-border space-y-2.5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowDiscountInput(!showDiscountInput)}
                className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:underline"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{discountAmount > 0 ? 'Diskon Terpasang' : '+ Tambah Diskon / Kupon'}</span>
              </button>

              {discountAmount > 0 && (
                <button
                  onClick={onClearDiscount}
                  className="flex items-center gap-1 text-[10px] text-red-400 hover:underline"
                >
                  <X className="w-3 h-3" />
                  <span>Hapus Diskon</span>
                </button>
              )}
            </div>

            {(showDiscountInput || discountAmount > 0) && (
              <div className="space-y-2 pt-1 animate-fade-in">
                {/* Type & Value Controls */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex bg-dark-card border border-dark-border rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => onSetDiscountType('percentage')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        discountType === 'percentage'
                          ? 'bg-brand-primary text-white font-bold'
                          : 'text-dark-muted hover:text-dark-text'
                      }`}
                    >
                      %
                    </button>
                    <button
                      type="button"
                      onClick={() => onSetDiscountType('fixed')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        discountType === 'fixed'
                          ? 'bg-brand-primary text-white font-bold'
                          : 'text-dark-muted hover:text-dark-text'
                      }`}
                    >
                      Rp
                    </button>
                  </div>

                  <input
                    type="number"
                    placeholder={discountType === 'percentage' ? 'Persen (misal: 10)' : 'Nominal (misal: 5000)'}
                    value={discountValue || ''}
                    onChange={(e) => onSetDiscountValue(Number(e.target.value))}
                    className="flex-1 px-2.5 py-1 bg-dark-card text-dark-text text-xs rounded-lg border border-dark-border focus:outline-none focus:border-brand-primary font-mono-numbers"
                  />
                </div>

                {/* Quick Voucher Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-dark-muted self-center mr-1 flex items-center gap-1">
                    <Ticket className="w-3 h-3 text-amber-500" /> Kupon:
                  </span>
                  {['DISKON5', 'DISKON10', 'HEMAT5K'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => onApplyVoucherCode(code)}
                      className={`px-2 py-0.5 text-[10px] font-mono-numbers rounded border transition-colors ${
                        activeVoucherCode === code
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold'
                          : 'bg-dark-card border-dark-border text-dark-muted hover:text-dark-text'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Detailed Cost Breakdown */}
          <div className="space-y-1.5 text-xs text-dark-muted">
            <div className="flex justify-between">
              <span>Total Item</span>
              <span className="font-mono-numbers text-dark-text">{totalItemCount} unit</span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono-numbers text-dark-text">{formatRupiah(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-500 dark:text-emerald-400 font-medium">
                <span>Potongan Diskon</span>
                <span className="font-mono-numbers">- {formatRupiah(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between pt-2 border-t border-dark-border">
              <span className="text-sm font-semibold text-dark-text">Total Bayar</span>
              <span className="font-mono-numbers text-lg font-bold text-brand-primary">
                {formatRupiah(finalTotal)}
              </span>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            onClick={onCheckout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-primary hover:bg-brand-hover active:scale-[0.99] text-white font-semibold text-sm rounded-lg shadow-lg shadow-brand-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
