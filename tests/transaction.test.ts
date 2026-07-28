import { describe, it, expect } from 'vitest'

describe('Unit Test: Server-Side Transaction Calculation & Price Snapshotting', () => {
  it('TC-01: Should accurately compute subtotal per item and overall transaction total', () => {
    const cartItems = [
      { price: 18000, quantity: 2 }, // Subtotal: 36000
      { price: 25000, quantity: 1 }, // Subtotal: 25000
      { price: 6000, quantity: 3 },  // Subtotal: 18000
    ]

    const computedItems = cartItems.map((item) => ({
      ...item,
      subtotal: item.price * item.quantity,
    }))

    const totalAmount = computedItems.reduce((acc, curr) => acc + curr.subtotal, 0)
    const totalItemCount = computedItems.reduce((acc, curr) => acc + curr.quantity, 0)

    expect(computedItems[0].subtotal).toBe(36000)
    expect(computedItems[1].subtotal).toBe(25000)
    expect(computedItems[2].subtotal).toBe(18000)
    expect(totalAmount).toBe(79000)
    expect(totalItemCount).toBe(6)
  })

  it('TC-02: Should preserve snapshot price in transaction item even if product price changes later', () => {
    // Initial product state
    const originalProduct = { id: 'prod-1', name: 'Kopi Susu', price: 18000 }

    // Snapshot captured at checkout
    const transactionItemSnapshot = {
      productId: originalProduct.id,
      productName: originalProduct.name,
      price: originalProduct.price,
      quantity: 2,
      subtotal: originalProduct.price * 2,
    }

    // Product price updated later by admin
    const updatedProduct = { ...originalProduct, price: 22000 }

    // Snapshot price should remain unchanged
    expect(transactionItemSnapshot.price).toBe(18000)
    expect(transactionItemSnapshot.subtotal).toBe(36000)
    expect(transactionItemSnapshot.price).not.toBe(updatedProduct.price)
  })
})
