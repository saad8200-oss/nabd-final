"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { createUser } from "@/app/(dashboard)/settings/actions";

export function UserForm({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createUser(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setIsOpen(false);
      alert("تم إنشاء المستخدم بنجاح!");
    }
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', 
          backgroundColor: '#22d3ee', color: '#0f172a', padding: '0.5rem 1rem', 
          borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' 
        }}
      >
        <UserPlus style={{ width: '1rem', height: '1rem' }} /> إضافة مستخدم جديد
      </button>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 
    }}>
      <div style={{ 
        backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', 
        width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem' }}>إضافة مستخدم جديد</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>الاسم</label>
            <Input name="name" required style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>البريد الإلكتروني</label>
            <Input name="email" type="email" required style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>كلمة المرور</label>
            <Input name="password" type="password" required style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>الصلاحية (الدور)</label>
            <select name="role" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: 'rgba(15,23,42,0.5)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)' }}>
              <option value="CASHIER">كاشير</option>
              <option value="WAREHOUSE">أمين مخزن</option>
              {/* إظهار خيار "مدير" فقط للسوبر أدمن */}
              {isSuperAdmin && <option value="ADMIN">مدير</option>}
            </select>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Button type="submit" style={{ flex: 1 }} disabled={isLoading}>
              {isLoading ? "جاري الحفظ..." : "حفظ المستخدم"}
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