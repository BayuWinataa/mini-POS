import { describe, it, expect } from 'vitest'

describe('Unit Test: Product Status Validation & Filtering', () => {
  const mockProducts = [
    { id: 'p1', name: 'Kopi Susu Gula Aren', price: 18000, stock: 50, isActive: true },
    { id: 'p2', name: 'Es Teh Manis', price: 6000, stock: 80, isActive: true },
    { id: 'p3', name: 'Menu Musiman Non-Aktif', price: 30000, stock: 10, isActive: false },
  ]

  it('TC-06: Should reject checkout for items marked as inactive', () => {
    const isCartValid = (cartItems: { productId: string }[]) => {
      for (const item of cartItems) {
        const prod = mockProducts.find((p) => p.id === item.productId)
        if (!prod || !prod.isActive) {
          return { valid: false, reason: `Produk ${prod?.name || item.productId} non-aktif` }
        }
      }
      return { valid: true }
    }

    const validCartResult = isCartValid([{ productId: 'p1' }, { productId: 'p2' }])
    const invalidCartResult = isCartValid([{ productId: 'p1' }, { productId: 'p3' }])

    expect(validCartResult.valid).toBe(true)
    expect(invalidCartResult.valid).toBe(false)
    expect(invalidCartResult.reason).toContain('non-aktif')
  })

  it('TC-07: Should filter catalog products to show active items only by default', () => {
    const activeProducts = mockProducts.filter((p) => p.isActive)

    expect(activeProducts.length).toBe(2)
    expect(activeProducts.some((p) => p.id === 'p3')).toBe(false)
  })

  it('TC-08: Should safely deactivate product when historical transactions exist during deletion', () => {
    const productsList = [...mockProducts]
    const hasTransactions = (id: string) => id === 'p1' // p1 has transactions

    const deleteOrDeactivate = (id: string) => {
      if (hasTransactions(id)) {
        const prod = productsList.find((p) => p.id === id)
        if (prod) prod.isActive = false
        return { action: 'soft_deleted' }
      } else {
        const idx = productsList.findIndex((p) => p.id === id)
        if (idx !== -1) productsList.splice(idx, 1)
        return { action: 'permanently_deleted' }
      }
    }

    const res1 = deleteOrDeactivate('p1') // Has transaction -> soft delete
    const res2 = deleteOrDeactivate('p2') // No transaction -> permanent delete

    expect(res1.action).toBe('soft_deleted')
    expect(productsList.find((p) => p.id === 'p1')?.isActive).toBe(false)
    expect(res2.action).toBe('permanently_deleted')
    expect(productsList.find((p) => p.id === 'p2')).toBeUndefined()
  })
})
