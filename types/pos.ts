export interface Product {
  id: string
  name: string
  price: number
  stock: number
  category?: string
  isActive: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface TransactionItemRecord {
  id: string
  productName: string
  price: number
  quantity: number
  subtotal: number
}

export type DiscountType = 'percentage' | 'fixed'

export interface DiscountInput {
  type: DiscountType
  value: number
}

export interface TransactionRecord {
  id: string
  transactionNumber: string
  totalAmount: number
  discountAmount?: number
  itemCount: number
  createdAt: Date | string
  items: TransactionItemRecord[]
}
