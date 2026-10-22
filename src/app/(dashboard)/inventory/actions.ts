"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  } else {
    // إضافة منتج جديد
    await prisma.product.create({
      data,
    });
  }

  // تحديث الصفحة لعرض التغييرات فوراً
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });
  
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
}