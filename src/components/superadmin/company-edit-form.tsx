"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateCompany } from "@/app/(dashboard)/superadmin/actions";

export function CompanyEditForm({ company }: { company: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    const result = await updateCompany(company.id, formData);
    
    if (result.success) {
      setMessage("تم حفظ التعديلات بنجاح! سيتم إعادتك للصفحة السابقة.");
      setTimeout(() => router.push("/superadmin"), 2000);
    } else {
      setMessage("حدث خطأ أثناء الحفظ.");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>اسم الشركة</label>
        <Input name="name" defaultValue={company.name} required style={{ backgroundColor: 'rgba(15,23,42,0.5)', color: '#fff' }} />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>تاريخ انتهاء الاشتراك</label>
        <Input 
          name="expiryDate" 
          type="date" 
          defaultValue={company.expiryDate ? new Date(company.expiryDate).toISOString().split('T')[0] : ''} 
          style={{ backgroundColor: 'rgba(15,23,42,0.5)', color: '#fff' }} 
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input 
          type="checkbox" 
          name="isActive" 
          defaultChecked={company.isActive} 
          id={`active-${company.id}`}
          style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
        />
        <label htmlFor={`active-${company.id}`} style={{ color: '#f8fafc', fontSize: '0.875rem', cursor: 'pointer' }}>الشركة نشطة (مفعلة)</label>
      </div>

      {message && <p style={{ color: '#10b981', fontSize: '0.875rem' }}>{message}</p>}

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <Button type="submit" style={{ flex: 1 }} disabled={isLoading}>
          {isLoading ? "جاري الحفظ..." : "حفظ التعديلات"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/superadmin")} style={{ flex: 1 }}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}