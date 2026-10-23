"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { createCompany } from "@/app/(dashboard)/superadmin/actions";
import { useRouter } from "next/navigation";

export function CompanyForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    if (logoPreview) {
      formData.append("logo", logoPreview);
    }

    await createCompany(formData);
    
    setIsOpen(false);
    setIsLoading(false);
    router.refresh();
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#22d3ee', color: '#0f172a', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
        <Plus style={{ width: '1rem', height: '1rem' }} /> إضافة شركة جديدة
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem' }}>إضافة شركة جديدة</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* حقل الشعار (رفع صورة) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8' }}>شعار الشركة (اختياري)</label>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', 
              border: '2px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative'
            }}>
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>شعار</span>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ fontSize: '0.75rem', color: '#94a3b8' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>اسم الشركة</label>
            <Input name="name" required style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>البريد الإلكتروني (للدخول)</label>
            <Input name="email" type="email" required style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>كلمة المرور</label>
            <Input name="password" type="password" required style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>تاريخ انتهاء الاشتراك</label>
            <Input name="expiryDate" type="date" style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Button type="submit" style={{ flex: 1 }} disabled={isLoading}>
              {isLoading ? "جاري الحفظ..." : "حفظ الشركة"}
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