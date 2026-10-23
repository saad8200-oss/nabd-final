"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// 1. إضافة شركة جديدة
export async function createCompany(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const expiryDate = formData.get("expiryDate") as string;
  const logo = formData.get("logo") as string | null;

  if (!name || !email || !password) return { error: "جميع الحقول مطلوبة" };

  const existingCompany = await prisma.company.findUnique({ where: { email } });
  if (existingCompany) return { error: "البريد الإلكتروني مسجل بالفعل" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name,
        email,
        password: hashedPassword,
        logo: logo || null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
    });

    await tx.user.create({
      data: {
        name: `مدير ${name}`,
        email: email,
        password: hashedPassword,
        role: "ADMIN",
        companyId: company.id,
      },
    });
  });

  revalidatePath("/superadmin/companies");
  return { success: true };
}

// 2. تعديل شركة
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

  revalidatePath("/superadmin/companies");
  return { success: true };
}

// 3. حذف شركة
export async function deleteCompany(id: string) {
  await prisma.company.delete({
    where: { id },
  });
  revalidatePath("/superadmin/companies");
  return { success: true };
}

// 4. الدخول إلى الشركة (Impersonation)
export async function impersonateCompany(companyId: string) {
  try {
    const companyAdmin = await prisma.user.findFirst({
      where: { companyId, role: "ADMIN" },
    });

    if (!companyAdmin) return { error: "لا يوجد مدير لهذه الشركة" };

    await prisma.user.update({
      where: { id: companyAdmin.id },
      data: { isImpersonating: true, impersonatedBy: "admin@nabd.com" },
    });

    await prisma.auditLog.create({
      data: {
        action: "IMPERSONATE",
        entity: "User",
        entityId: companyAdmin.id,
        details: `السوبر أدمن دخل إلى شركة: ${companyAdmin.name}`,
        userId: companyAdmin.id,
      },
    });

    // إرجاع البريد وكلمة المرور فقط (بدون signIn)
    return { success: true, email: companyAdmin.email, password: "123456" };
  } catch (error: any) {
    return { error: error.message };
  }
}