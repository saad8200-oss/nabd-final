"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "ADMIN" | "CASHIER" | "WAREHOUSE";

  if (!name || !email || !password || !role) {
    return { error: "جميع الحقول مطلوبة" };
  }

  // التحقق من عدم وجود البريد مسبقاً
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "البريد الإلكتروني مسجل بالفعل" };
  }

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(password, 10);

  // إنشاء المستخدم
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  revalidatePath("/settings");
  return { success: true };
}
// ... الكود السابق (createUser) ...

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as "ADMIN" | "CASHIER" | "WAREHOUSE";
  const password = formData.get("password") as string;

  const data: any = { name, email, role };
  
  // إذا تم إدخال كلمة مرور جديدة، نقوم بتشفيرها
  if (password && password.trim() !== "") {
    data.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({
    where: { id },
    data,
  });

  revalidatePath("/settings");
  return { success: true };
}

export async function deleteUser(id: string) {
  // منع حذف الحساب الحالي (اختياري)
  // يمكننا إضافة تحقق هنا إذا أردنا
  
  await prisma.user.delete({
    where: { id },
  });
  
  revalidatePath("/settings");
  return { success: true };
}
export async function updateStoreSettings(formData: FormData) {
  const storeName = formData.get("storeName") as string;
  const logoUrl = formData.get("logoUrl") as string;

  const existing = await prisma.storeSettings.findFirst();

  if (existing) {
    await prisma.storeSettings.update({
      where: { id: existing.id },
      data: { storeName, logoUrl },
    });
  } else {
    await prisma.storeSettings.create({
      data: { storeName, logoUrl },
    });
  }

  revalidatePath("/settings");
  revalidatePath("/login"); // لتحديث صفحة الدخول بالشعار الجديد
  return { success: true };
}