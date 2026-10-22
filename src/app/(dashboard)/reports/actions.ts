"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function returnSale(saleId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. جلب الفاتورة مع المنتجات
      const sale = await tx.sale.findUnique({
        where: { id: saleId },
        include: { items: true },
      });

      if (!sale || sale.isReturned) {
        throw new Error("الفاتورة غير موجودة أو تم إرجاعها مسبقاً");
      }

      // 2. إعادة الكميات إلى المخزون
      for (const item of sale.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      // 3. تحديث حالة الفاتورة إلى "مرتجعة"
      await tx.sale.update({
        where: { id: saleId },
        data: { isReturned: true },
      });
    });

    revalidatePath("/reports");
    revalidatePath("/dashboard");
    revalidatePath("/inventory");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}