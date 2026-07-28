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

export interface TransactionRecord {
  id: string
  transactionNumber: string
  totalAmount: number
  itemCount: number
  createdAt: Date | string
  items: TransactionItemRecord[]
}
