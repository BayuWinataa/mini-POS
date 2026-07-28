import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding initial products data...')

  const initialProducts = [
    {
      name: 'Kopi Susu Gula Aren',
      price: 18000,
      stock: 50,
      isActive: true,
    },
    {
      name: 'Americano Ice',
      price: 15000,
      stock: 40,
      isActive: true,
    },
    {
      name: 'Croissant Cokelat',
      price: 22000,
      stock: 25,
      isActive: true,
    },
    {
      name: 'Roti Bakar Keju',
      price: 16000,
      stock: 30,
      isActive: true,
    },
    {
      name: 'Matcha Latte',
      price: 25000,
      stock: 15,
      isActive: true,
    },
    {
      name: 'Air Mineral 600ml',
      price: 5000,
      stock: 100,
      isActive: true,
    },
    {
      name: 'Nasi Goreng Spesial',
      price: 28000,
      stock: 20,
      isActive: true,
    },
    {
      name: 'Teh Manis Dingin',
      price: 6000,
      stock: 80,
      isActive: true,
    },
  ]

  for (const product of initialProducts) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    })

    if (!existing) {
      await prisma.product.create({
        data: product,
      })
    }
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
