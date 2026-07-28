import { Product, TransactionRecord } from '@/types/pos'

export type AnalyticsTimeRange = '7d' | '30d' | 'all'

export interface KPISummary {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  totalItemsSold: number
  topCategoryName: string
}

export function filterTransactionsByRange(
  transactions: TransactionRecord[],
  range: AnalyticsTimeRange
): TransactionRecord[] {
  if (range === 'all') return transactions

  const now = new Date()
  const days = range === '7d' ? 7 : 30
  const cutoff = new Date(now.valueOf() - days * 24 * 60 * 60 * 1000)

  return transactions.filter((t) => new Date(t.createdAt) >= cutoff)
}

export function getKPISummary(
  transactions: TransactionRecord[],
  products: Product[]
): KPISummary {
  const totalRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0)
  const totalOrders = transactions.length
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  let totalItemsSold = 0
  const categorySalesMap = new Map<string, number>()

  // Map product id -> category fallback lookup
  const productCatMap = new Map(products.map((p) => [p.name.toLowerCase(), p.category || 'Lainnya']))

  transactions.forEach((t) => {
    t.items.forEach((item) => {
      totalItemsSold += item.quantity
      const category =
        productCatMap.get(item.productName.toLowerCase()) || 'Lainnya'
      const currentCatTotal = categorySalesMap.get(category) || 0
      categorySalesMap.set(category, currentCatTotal + item.subtotal)
    })
  })

  let topCategoryName = '-'
  let maxCatRevenue = 0
  categorySalesMap.forEach((revenue, catName) => {
    if (revenue > maxCatRevenue) {
      maxCatRevenue = revenue
      topCategoryName = catName
    }
  })

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    totalItemsSold,
    topCategoryName,
  }
}

export function getRevenueTrendChartData(
  transactions: TransactionRecord[],
  range: AnalyticsTimeRange
) {
  const dateMap = new Map<string, { revenue: number; orders: number }>()

  // Sort chronologically
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  sorted.forEach((t) => {
    const d = new Date(t.createdAt)
    const dateStr = d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    })

    const curr = dateMap.get(dateStr) || { revenue: 0, orders: 0 }
    dateMap.set(dateStr, {
      revenue: curr.revenue + t.totalAmount,
      orders: curr.orders + 1,
    })
  })

  const labels = Array.from(dateMap.keys())
  const revenues = Array.from(dateMap.values()).map((v) => v.revenue)
  const orders = Array.from(dateMap.values()).map((v) => v.orders)

  return { labels, revenues, orders }
}

export function getTopProductsChartData(transactions: TransactionRecord[]) {
  const productMap = new Map<string, { qty: number; revenue: number }>()

  transactions.forEach((t) => {
    t.items.forEach((item) => {
      const curr = productMap.get(item.productName) || { qty: 0, revenue: 0 }
      productMap.set(item.productName, {
        qty: curr.qty + item.quantity,
        revenue: curr.revenue + item.subtotal,
      })
    })
  })

  const sortedProducts = Array.from(productMap.entries())
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 5)

  const labels = sortedProducts.map(([name]) => name)
  const quantities = sortedProducts.map(([, data]) => data.qty)
  const revenues = sortedProducts.map(([, data]) => data.revenue)

  return { labels, quantities, revenues }
}

export function getCategoryDistributionChartData(
  transactions: TransactionRecord[],
  products: Product[]
) {
  const categoryMap = new Map<string, number>()
  const productCatMap = new Map(products.map((p) => [p.name.toLowerCase(), p.category || 'Lainnya']))

  transactions.forEach((t) => {
    t.items.forEach((item) => {
      const cat = productCatMap.get(item.productName.toLowerCase()) || 'Lainnya'
      const curr = categoryMap.get(cat) || 0
      categoryMap.set(cat, curr + item.subtotal)
    })
  })

  const labels = Array.from(categoryMap.keys())
  const values = Array.from(categoryMap.values())

  return { labels, values }
}

export function getPeakHoursChartData(transactions: TransactionRecord[]) {
  const hourlyCounts = new Array(24).fill(0)

  transactions.forEach((t) => {
    const hour = new Date(t.createdAt).getHours()
    hourlyCounts[hour] += 1
  })

  // Focus operational hours 08:00 - 22:00
  const labels: string[] = []
  const data: number[] = []

  for (let h = 8; h <= 22; h++) {
    labels.push(`${h.toString().padStart(2, '0')}:00`)
    data.push(hourlyCounts[h] || 0)
  }

  return { labels, data }
}
