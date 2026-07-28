'use server'

import { prisma } from '@/lib/prisma'
import { formatDate, formatRupiah } from '@/lib/utils'

export async function exportTransactionsCSV() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
      },
    })

    // Header CSV
    const headers = [
      'No. Transaksi',
      'Tanggal',
      'Total Item',
      'Total Bayar (IDR)',
      'Detail Item (Produk x Qty @ Harga)',
    ]

    const rows = (transactions as any[]).map((t: any) => {
      const itemsDetail = t.items
        .map((item: any) => `${item.productName} (${item.quantity}x @ ${formatRupiah(item.price)})`)
        .join('; ')

      return [
        `"${t.transactionNumber}"`,
        `"${formatDate(t.createdAt)}"`,
        t.itemCount,
        t.totalAmount,
        `"${itemsDetail}"`,
      ].join(',')
    })

    const csvContent = [headers.join(','), ...rows].join('\n')

    return {
      success: true,
      csvContent,
      filename: `riwayat_transaksi_pos_${new Date().toISOString().slice(0, 10)}.csv`,
    }
  } catch (error) {
    console.error('Error exporting transactions to CSV:', error)
    return { success: false, error: 'Gagal mengekspor riwayat transaksi ke CSV' }
  }
}
