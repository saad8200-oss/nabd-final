"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { logAction } from "@/lib/audit";

// دالة حفظ المنتج (إضافة أو تعديل)
export async function saveProduct(formData: FormData) {
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const price = parseFloat(formData.get("price") as string);
  const cost = parseFloat(formData.get("cost") as string);
  const stock = parseInt(formData.get("stock") as string);
  const lowStockThreshold = parseInt(formData.get("lowStockThreshold") as string);
  const barcode = formData.get("barcode") as string;
  const imageUrl = formData.get("imageUrl") as string;

  const data = {
    name,
    category: category || null,
    price,
    cost,
    stock,
    lowStockThreshold,
    barcode: barcode && barcode.trim() !== "" ? barcode.trim() : undefined,
    imageUrl: imageUrl || null,
  };

  if (id) {
    // تعديل منتج موجود
    await prisma.product.update({
      where: { id },
      data,
    });
    await logAction("UPDATE", "Product", id, `تم تعديل المنتج: ${name}`);
  } else {
    // إضافة منتج جديد
    const newProduct = await prisma.product.create({
      data,
    });
    await logAction("CREATE", "Product", newProduct.id, `تم إضافة منتج: ${name}`);
  }

  revalidatePath("/inventory");
  revalidatePath("/dashboard");
}

// دالة حذف المنتج
export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });
  
  await logAction("DELETE", "Product", id, `تم حذف منتج`);
  
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
}

// دالة تعديل كمية المخزون (سحب/إضافة)
export async function adjustStock(
  productId: string, 
  quantity: number, 
  type: "ADD" | "REMOVE", 
  reason: string
) {
  try {
    // 1. تحديث المخزون في المعاملة (بدون logAction لتجنب بطء المعاملة)
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) throw new Error("المنتج غير موجود");

      const newStock = type === "ADD" 
        ? product.stock + quantity 
        : product.stock - quantity;

      if (newStock < 0) throw new Error("الكمية المتوفرة لا تكفي للسحب");

      await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      return { product, newStock };
    });

    // 2. تسجيل العملية خارج المعاملة (لتجنب تجاوز وقت المعاملة)
    await logAction(
      type === "ADD" ? "STOCK_IN" : "STOCK_OUT",
      "Product",
      productId,
      `${type === "ADD" ? "إضافة" : "سحب"} ${quantity} من ${result.product.name} - السبب: ${reason}`
    );

    revalidatePath("/inventory");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}