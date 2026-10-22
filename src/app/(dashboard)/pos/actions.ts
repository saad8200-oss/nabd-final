"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CartItem } from "@/stores/cart-store";

export async function processSale(items: CartItem[], total: number) {
  if (!items || items.length === 0) throw new Error("السلة فارغة");

  const user = await prisma.user.findFirst();
  if (!user) throw new Error("لا يوجد مستخدم مسجل");

  await prisma.$transaction(async (tx) => {
    const sale = await tx.sale.create({
      data: {
        invoiceNumber: `INV-${Date.now()}`,
        userId: user.id,
        subtotal: total,
        total: total,
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        },
      },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } },
      });
    }
  });

  revalidatePath("/pos");
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  
  return { success: true };
}