"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      style={{ 
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
        backgroundColor: '#22d3ee', color: '#0f172a', padding: '0.5rem 1rem', 
        borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' 
      }}
    >
      <Printer style={{ width: '1rem', height: '1rem' }} /> طباعة الفاتورة
    </button>
  );
}