"use client";

import { useRouter } from "next/navigation";
import { LogIn, Edit, Trash2 } from "lucide-react";
import { deleteCompany, impersonateCompany } from "@/app/(dashboard)/superadmin/actions";
import { signIn } from "next-auth/react"; // <--- استيراد signIn من next-auth/react

export function CompanyActions({ company }: { company: any }) {
  const router = useRouter();

  const handleLogin = async () => {
    if (confirm(`هل تريد الدخول إلى شركة "${company.name}"؟`)) {
      const result = await impersonateCompany(company.id);
      
      if (result.success) {
        // تسجيل الدخول بحساب الشركة
        await signIn("credentials", {
          email: result.email,
          password: result.password,
          redirect: false,
        });
        router.push("/dashboard");
        router.refresh();
      } else {
        alert(result.error);
      }
    }
  };

  const handleDelete = async () => {
    if (confirm(`هل أنت متأكد من حذف شركة "${company.name}" نهائياً؟`)) {
      await deleteCompany(company.id);
      router.refresh();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
      
      {/* زر الدخول */}
      <button 
        onClick={handleLogin}
        title="دخول النظام"
        style={{ background: 'none', border: 'none', color: '#22d3ee', cursor: 'pointer' }}
      >
        <LogIn size={18} />
      </button>

      {/* زر التعديل */}
      <button 
        onClick={() => router.push(`/superadmin/edit/${company.id}`)} 
        title="تعديل" 
        style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
      >
        <Edit size={18} />
      </button>

      {/* زر الحذف */}
      <button 
        onClick={handleDelete}
        title="حذف"
        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}