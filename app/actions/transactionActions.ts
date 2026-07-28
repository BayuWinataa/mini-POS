'use server'

import { prisma } from '@/lib/prisma'
import { generateTransactionNumber } from '@/lib/utils'
import { CheckoutSchema, type CheckoutInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function processCheckout(input: CheckoutInput) {
  try {
    const validated = CheckoutSchema.parse(input)
    const productIds = validated.items.map((item) => item.productId)

    // 1. Fetch latest product details directly from database (Server-side source of truth)
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    })

    const productMap = new Map(dbProducts.map((p) => [p.id, p]))

    // 2. Validate product existence, active status, and stock sufficiency
    let totalAmount = 0
    let totalItemCount = 0
    const transactionItemsData: {
      productId: string
      productName: string
      price: number
      quantity: number
      subtotal: number
    }[] = []

    for (const item of validated.items) {
      const product = productMap.get(item.productId)

      if (!product) {
        return {
          success: false,
          error: `Produk dengan ID "${item.productId}" tidak ditemukan di database.`,
        }
      }

      if (!product.isActive) {
        return {
          success: false,
          error: `Produk "${product.name}" sedang dalam status non-aktif dan tidak dapat dibeli.`,
        }
      }

      if (product.stock < item.quantity) {
        return {
          success: false,
          error: `Stok produk "${product.name}" tidak mencukupi. (Stok tersedia: ${product.stock}, Diminta: ${item.quantity})`,
        }
      }

      const itemSubtotal = product.price * item.quantity
      totalAmount += itemSubtotal
      totalItemCount += item.quantity

      // Store SNAPSHOT of productName and price at checkout time
      transactionItemsData.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      })
    }

    // 3. Execute Atomic Database Transaction using Prisma $transaction
    const transaction = await prisma.$transaction(async (tx) => {
      // Create Transaction record
      const createdTransaction = await tx.transaction.create({
        data: {
          transactionNumber: generateTransactionNumber(),
          totalAmount,
          itemCount: totalItemCount,
          items: {
            create: transactionItemsData,
          },
        },
        include: {
          items: true,
        },
      })

      // Update product stocks (decrement stock) with atomic check
      for (const item of validated.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      return createdTransaction
    })

    revalidatePath('/')
    return { success: true, data: transaction }
  } catch (error: unknown) {
    console.error('Error processing checkout:', error)
    const errorMsg = error instanceof Error ? error.message : 'Terjadi kesalahan sistem saat memproses transaksi.'
    return {
      success: false,
      error: errorMsg,
    }
  }
}

export async function getTransactions(options?: { search?: string }) {
  try {
    const where: Prisma.TransactionWhereInput = {}

    if (options?.search) {
      where.OR = [
        { transactionNumber: { contains: options.search, mode: 'insensitive' } },
        {
          items: {
            some: {
              productName: { contains: options.search, mode: 'insensitive' },
            },
          },
        },
      ]
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
      },
    })

    return { success: true, data: transactions }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return { success: false, error: 'Gagal mengambil riwayat transaksi' }
  }
}

export async function getTransactionById(id: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        items: true,
      },
    })

    if (!transaction) {
      return { success: false, error: 'Transaksi tidak ditemukan' }
    }

    return { success: true, data: transaction }
  } catch (error) {
    console.error('Error fetching transaction detail:', error)
    return { success: false, error: 'Gagal mengambil detail transaksi' }
  }
}
