"use client";

import { useRouter } from "next/navigation";
import { LogIn, Edit, Trash2 } from "lucide-react";
import { deleteCompany } from "@/app/(dashboard)/superadmin/actions";

export function CompanyActions({ company }: { company: any }) {
  const router = useRouter();

  const handleLogin = () => {
    window.open("/login", "_blank");
  };

  const handleDelete = async () => {
    if (confirm(`هل أنت متأكد من حذف شركة "${company.name}" نهائياً؟`)) {
      await deleteCompany(company.id);
      router.refresh();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
      
      <button onClick={handleLogin} title="دخول النظام" style={{ background: 'none', border: 'none', color: '#22d3ee', cursor: 'pointer' }}>
        <LogIn size={18} />
      </button>

      {/* زر التعديل يوجه إلى الصفحة الجديدة */}
      <button 
        onClick={() => router.push(`/superadmin/edit/${company.id}`)} 
        title="تعديل" 
        style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
      >
        <Edit size={18} />
      </button>

      <button onClick={handleDelete} title="حذف" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
        <Trash2 size={18} />
      </button>
    </div>
  );
}