"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSupplier(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  if (!name) return { error: "اسم المورد مطلوب" };

  await prisma.supplier.create({
    data: { name, phone: phone || null, email: email || null },
  });

  revalidatePath("/suppliers");
  return { success: true };
}