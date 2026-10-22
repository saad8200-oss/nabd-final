import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // تنظيف قاعدة البيانات (لإعادة التجربة من الصفر)
  await prisma.saleItem.deleteMany({})
  await prisma.sale.deleteMany({})
  await prisma.product.deleteMany({})

  // 1. إنشاء مستخدم (كاشير)
  const user = await prisma.user.upsert({
    where: { email: 'admin@nabd.com' },
    update: {},
    create: {
      email: 'admin@nabd.com',
      name: 'مدير النظام',
      password: 'hashed_password_here',
      role: 'ADMIN',
    },
  })

  // 2. إنشاء منتجات
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'قهوة عربية',
        category: 'مشروبات',
        price: 25.0,
        cost: 10.0,
        stock: 50,
        lowStockThreshold: 10,
        barcode: '123456789',
      },
    }),
    prisma.product.create({
      data: {
        name: 'شاي أخضر',
        category: 'مشروبات',
        price: 15.0,
        cost: 5.0,
        stock: 5, 
        lowStockThreshold: 10,
        barcode: '987654321',
      },
    }),
    prisma.product.create({
      data: {
        name: 'كيك شوكولاتة',
        category: 'حلويات',
        price: 40.0,
        cost: 20.0,
        stock: 20,
        lowStockThreshold: 5,
        barcode: '456789123',
      },
    }),
  ])

  // 3. إنشاء مبيعات لآخر 7 أيام (لإعطاء شكل جميل للرسم البياني)
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const saleDate = new Date(today)
    saleDate.setDate(saleDate.getDate() - i)

    await prisma.sale.create({
      data: {
        invoiceNumber: `INV-${100 + i}`,
        userId: user.id,
        subtotal: 50.0 + (i * 20), // أرقام متغيرة
        tax: 0,
        discount: 0,
        total: 50.0 + (i * 20),
        createdAt: saleDate,
        items: {
          create: [
            { productId: products[0].id, quantity: 1, unitPrice: 25.0 }
          ],
        },
      },
    })
  }

  console.log('تمت إضافة البيانات التجريبية بنجاح!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })