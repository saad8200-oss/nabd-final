"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck } from "lucide-react";
import { createSupplier } from "@/app/(dashboard)/suppliers/actions";
import { useRouter } from "next/navigation";

export function SupplierForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    await createSupplier(formData);
    
    setIsOpen(false);
    setIsLoading(false);
    router.refresh();
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#22d3ee', color: '#0f172a', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
        <Plus style={{ width: '1rem', height: '1rem' }} /> إضافة مورد جديد
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem' }}>إضافة مورد جديد</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>اسم المورد</label>
            <Input name="name" required style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>رقم الهاتف</label>
            <Input name="phone" style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>البريد الإلكتروني</label>
            <Input name="email" type="email" style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Button type="submit" style={{ flex: 1 }} disabled={isLoading}>
              {isLoading ? "جاري الحفظ..." : "حفظ المورد"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} style={{ flex: 1 }}>
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}