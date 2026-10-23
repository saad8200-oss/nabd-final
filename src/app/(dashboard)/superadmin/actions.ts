"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createCompany(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const expiryDate = formData.get("expiryDate") as string;
  const logo = formData.get("logo") as string | null;

  if (!name || !email || !password) return { error: "جميع الحقول مطلوبة" };

  // التحقق من عدم وجود الشركة مسبقاً
  const existingCompany = await prisma.company.findUnique({ where: { email } });
  if (existingCompany) return { error: "البريد الإلكتروني مسجل بالفعل" };

  const hashedPassword = await bcrypt.hash(password, 10);

  // إنشاء الشركة والمستخدم (المدير) في نفس الوقت
  await prisma.$transaction(async (tx) => {
    // 1. إنشاء الشركة
    const company = await tx.company.create({
      data: {
        name,
        email,
        password: hashedPassword,
        logo: logo || null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
    });

    // 2. إنشاء مستخدم (مدير) مرتبط بالشركة
    await tx.user.create({
      data: {
        name: `مدير ${name}`,
        email: email,
        password: hashedPassword,
        role: "ADMIN",
        companyId: company.id, // <--- هنا نربط المستخدم بالشركة
      },
    });
  });

  revalidatePath("/superadmin");
  return { success: true };
}

export async function updateCompany(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const expiryDate = formData.get("expiryDate") as string;
  const isActive = formData.get("isActive") === "on";

  await prisma.company.update({
    where: { id },
    data: {
      name,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      isActive,
    },
  });

  revalidatePath("/superadmin");
  return { success: true };
}

export async function deleteCompany(id: string) {
  await prisma.company.delete({
    where: { id },
  });
  revalidatePath("/superadmin");
  return { success: true };
}