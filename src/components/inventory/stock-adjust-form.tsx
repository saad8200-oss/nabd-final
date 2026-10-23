"use client";

import { useState } from "react";
import { createPortal } from "react-dom"; // <--- استيراد Portal
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PackageMinus } from "lucide-react";
import { adjustStock } from "@/app/(dashboard)/inventory/actions";
import { useRouter } from "next/navigation";

export function StockAdjustForm({ product }: { product: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const quantity = Number(formData.get("quantity"));
    const type = formData.get("type") as "ADD" | "REMOVE";
    const reason = formData.get("reason") as string;

    const result = await adjustStock(product.id, quantity, type, reason);

    if (result.success) {
      setIsOpen(false);
      router.refresh();
    } else {
      setError(result.error || "حدث خطأ");
    }
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        title="سحب/إضافة كمية"
        style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer' }}
      >
        <PackageMinus size={18} />
      </button>
    );
  }

  // استخدام createPortal لنقل النافذة إلى نهاية <body>
  return createPortal(
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0, 0, 0, 0.9)', // خلفية سوداء معتمة جداً
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      zIndex: 999999 // أعلى قيمة ممكنة لضمان الظهور فوق كل شيء
    }}>
      <div style={{ 
        backgroundColor: '#1e293b', // لون داكن صلب
        padding: '2rem', 
        borderRadius: '12px', 
        width: '100%', 
        maxWidth: '400px', 
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.9)', // ظل قوي جداً
        position: 'relative'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '1.5rem' }}>
          حركة مخزون: {product.name}
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>نوع الحركة</label>
            <select name="type" style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: 'rgba(15,23,42,0.5)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)' }}>
              <option value="REMOVE">سحب (صادر)</option>
              <option value="ADD">إضافة (وارد)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>الكمية</label>
            <Input name="quantity" type="number" min="1" required style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>سبب الحركة</label>
            <Input name="reason" required placeholder="مثال: تلف، جرد، استخدام داخلي..." style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Button type="submit" style={{ flex: 1 }} disabled={isLoading}>
              {isLoading ? "جاري الحفظ..." : "تأكيد الحركة"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} style={{ flex: 1 }}>
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body // <--- نقل النافذة إلى body
  );
}