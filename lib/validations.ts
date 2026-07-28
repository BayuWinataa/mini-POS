import { z } from 'zod'

export const ProductSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi').max(100, 'Nama produk terlalu panjang'),
  price: z.number().int('Harga harus berupa angka bulat').min(100, 'Harga minimal Rp 100'),
  stock: z.number().int('Stok harus berupa angka bulat').min(0, 'Stok tidak boleh negatif'),
  isActive: z.boolean().default(true),
})

export const ProductUpdateSchema = ProductSchema.partial()

export const CartItemSchema = z.object({
  productId: z.string().min(1, 'ID Produk wajib diisi'),
  quantity: z.number().int().min(1, 'Jumlah pembelian minimal 1'),
})

export const CheckoutSchema = z.object({
  items: z.array(CartItemSchema).min(1, 'Keranjang belanja tidak boleh kosong'),
})

export type ProductInput = z.infer<typeof ProductSchema>
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>
export type CartItemInput = z.infer<typeof CartItemSchema>
export type CheckoutInput = z.infer<typeof CheckoutSchema>
