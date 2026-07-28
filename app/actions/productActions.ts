'use server'

import { prisma } from '@/lib/prisma'
import { ProductSchema, ProductUpdateSchema, type ProductInput } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export async function getProducts(options?: { activeOnly?: boolean; search?: string }) {
  try {
    const where: Prisma.ProductWhereInput = {}

    if (options?.activeOnly) {
      where.isActive = true
    }

    if (options?.search) {
      where.name = {
        contains: options.search,
        mode: 'insensitive',
      }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: products }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { success: false, error: 'Gagal mengambil data produk dari server' }
  }
}

export async function createProduct(input: ProductInput) {
  try {
    const validated = ProductSchema.parse(input)

    const existing = await prisma.product.findFirst({
      where: { name: { equals: validated.name, mode: 'insensitive' } },
    })

    if (existing) {
      return { success: false, error: 'Produk dengan nama tersebut sudah ada' }
    }

    const product = await prisma.product.create({
      data: validated,
    })

    revalidatePath('/')
    return { success: true, data: product }
  } catch (error: unknown) {
    console.error('Error creating product:', error)
    const errorMsg = error instanceof Error ? error.message : 'Gagal menambahkan produk'
    return { success: false, error: errorMsg }
  }
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  try {
    const validated = ProductUpdateSchema.parse(input)

    const existing = await prisma.product.findUnique({
      where: { id },
    })

    if (!existing) {
      return { success: false, error: 'Produk tidak ditemukan' }
    }

    if (validated.name && validated.name !== existing.name) {
      const nameConflict = await prisma.product.findFirst({
        where: {
          name: { equals: validated.name, mode: 'insensitive' },
          id: { not: id },
        },
      })
      if (nameConflict) {
        return { success: false, error: 'Nama produk sudah digunakan oleh produk lain' }
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: validated,
    })

    revalidatePath('/')
    return { success: true, data: updated }
  } catch (error: unknown) {
    console.error('Error updating product:', error)
    const errorMsg = error instanceof Error ? error.message : 'Gagal memperbarui produk'
    return { success: false, error: errorMsg }
  }
}

export async function toggleProductStatus(id: string) {
  try {
    const existing = await prisma.product.findUnique({
      where: { id },
    })

    if (!existing) {
      return { success: false, error: 'Produk tidak ditemukan' }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        isActive: !existing.isActive,
      },
    })

    revalidatePath('/')
    return { success: true, data: updated }
  } catch (error) {
    console.error('Error toggling product status:', error)
    return { success: false, error: 'Gagal mengubah status produk' }
  }
}

export async function deleteProduct(id: string) {
  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      include: {
        transactionItems: {
          take: 1,
        },
      },
    })

    if (!existing) {
      return { success: false, error: 'Produk tidak ditemukan' }
    }

    // Jika produk memiliki riwayat transaksi, ubah status menjadi non-aktif (soft delete)
    if (existing.transactionItems.length > 0) {
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      })
      revalidatePath('/')
      return {
        success: true,
        message: 'Produk memiliki riwayat transaksi. Status diubah menjadi non-aktif.',
      }
    }

    // Jika belum pernah ditransaksikan, hapus permanen
    await prisma.product.delete({
      where: { id },
    })

    revalidatePath('/')
    return { success: true, message: 'Produk berhasil dihapus' }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Gagal menghapus produk' }
  }
}
