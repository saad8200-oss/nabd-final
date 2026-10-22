"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ invoiceDetails, phone }: { invoiceDetails: string, phone?: string }) {
  const handleSend = () => {
    // إذا لم يتم توفير رقم هاتف، سيتم فتح واتساب لاختيار جهة اتصال
    const url = phone 
      ? `https://wa.me/${phone}?text=${encodeURIComponent(invoiceDetails)}`
      : `https://wa.me/?text=${encodeURIComponent(invoiceDetails)}`;
      
    window.open(url, "_blank");
  };

  return (
    <button 
      onClick={handleSend}
      style={{ 
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
        backgroundColor: '#25D366', color: '#fff', padding: '0.5rem 1rem', 
        borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' 
      }}
    >
      <MessageCircle style={{ width: '1rem', height: '1rem' }} /> إرسال عبر واتساب
    </button>
  );
}