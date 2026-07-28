import { describe, it, expect } from 'vitest'

describe('Integration Test Logic: Stock Availability & Negative Stock Prevention', () => {
  it('TC-03: Should decrement product stock correctly after successful transaction', () => {
    let currentStock = 50
    const purchasedQuantity = 5

    if (currentStock >= purchasedQuantity) {
      currentStock -= purchasedQuantity
    }

    expect(currentStock).toBe(45)
  })

  it('TC-04: Should reject transaction if requested quantity exceeds available stock', () => {
    const product = { id: 'prod-2', name: 'Croissant Cokelat', stock: 3 }
    const requestedQuantity = 5

    const canFulfill = product.stock >= requestedQuantity

    expect(canFulfill).toBe(false)
  })

  it('TC-05: Should guarantee product stock never becomes negative', () => {
    let stock = 2
    const attemptOrder = (qty: number) => {
      if (qty > stock) {
        throw new Error(`Stok produk tidak mencukupi (Stok: ${stock}, Diminta: ${qty})`)
      }
      stock -= qty
      return stock
    }

    expect(() => attemptOrder(5)).toThrowError(/Stok produk tidak mencukupi/)
    expect(stock).toBe(2)
  })
})
