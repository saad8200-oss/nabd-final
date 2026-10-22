"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateStoreSettings } from "@/app/(dashboard)/settings/actions";
import { useRouter } from "next/navigation";

export function StoreForm({ storeSettings }: { storeSettings: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    const result = await updateStoreSettings(formData);
    
    if (result.success) {
      setMessage("تم حفظ إعدادات المتجر بنجاح!");
      router.refresh();
    } else {
      setMessage("حدث خطأ أثناء الحفظ.");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>اسم المتجر / الشركة</label>
        <Input name="storeName" defaultValue={storeSettings?.storeName || ""} required style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>رابط صورة الشعار (URL)</label>
        <Input name="logoUrl" defaultValue={storeSettings?.logoUrl || ""} placeholder="https://example.com/logo.png" style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>يمكنك رفع الصورة على موقع مثل Imgur ووضع الرابط هنا.</p>
      </div>
      
      {message && <p style={{ color: message.includes("بنجاح") ? '#10b981' : '#ef4444', fontSize: '0.875rem' }}>{message}</p>}
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "جاري الحفظ..." : "حفظ الإعدادات"}
      </Button>
    </form>
  );
}