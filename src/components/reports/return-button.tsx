"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { returnSale } from "@/app/(dashboard)/reports/actions";
import { useRouter } from "next/navigation";

export function ReturnButton({ saleId }: { saleId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleReturn = async () => {
    if (!confirm("هل أنت متأكد من إرجاع هذه الفاتورة؟ سيتم إعادة الكميات إلى المخزون.")) return;
    
    setIsLoading(true);
    const result = await returnSale(saleId);
    
    if (result.success) {
      alert("تم إرجاع الفاتورة بنجاح وإعادة الكميات للمخزون.");
      router.refresh();
    } else {
      alert("حدث خطأ: " + result.error);
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleReturn}
      disabled={isLoading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        backgroundColor: '#ef4444', color: '#fff', padding: '0.5rem 1rem',
        borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer',
        opacity: isLoading ? 0.7 : 1
      }}
    >
      <RotateCcw style={{ width: '1rem', height: '1rem' }} />
      {isLoading ? "جاري الإرجاع..." : "إرجاع الفاتورة"}
    </button>
  );
}