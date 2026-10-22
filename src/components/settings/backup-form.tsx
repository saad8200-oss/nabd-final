"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { restoreBackup } from "@/app/(dashboard)/settings/actions";

export function BackupForm() {
  const [isRestoring, setIsRestoring] = useState(false);
  const [message, setMessage] = useState("");

  const handleRestore = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirm("تحذير: استعادة النسخة الاحتياطية ستقوم بمسح جميع البيانات الحالية واستبدالها. هل أنت متأكد؟")) return;

    setIsRestoring(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await restoreBackup(formData);

    if (result.success) {
      setMessage("تمت استعادة النسخة الاحتياطية بنجاح! سيتم إعادة تحميل الصفحة.");
      setTimeout(() => window.location.reload(), 2000);
    } else {
      setMessage(result.error || "حدث خطأ");
    }
    setIsRestoring(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* قسم التنزيل */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
        <div>
          <p style={{ color: '#f8fafc', fontWeight: '500', margin: 0 }}>تنزيل نسخة احتياطية</p>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>احفظ نسخة من جميع بياناتك (المنتجات، الفواتير، المستخدمين).</p>
        </div>
        <a 
          href="/api/backup" 
          download
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#22d3ee', color: '#0f172a', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', textDecoration: 'none' }}
        >
          <Download style={{ width: '1rem', height: '1rem' }} /> تنزيل
        </a>
      </div>

      {/* قسم الاستعادة */}
      <form onSubmit={handleRestore} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}>
        <div>
          <p style={{ color: '#f8fafc', fontWeight: '500', margin: 0 }}>استعادة نسخة احتياطية</p>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>ارفع ملف (.db) لاستعادة بياناتك السابقة.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="file" 
            name="backupFile" 
            accept=".db" 
            required 
            style={{ flex: 1, padding: '0.5rem', backgroundColor: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.375rem', color: '#f8fafc' }}
          />
          <Button type="submit" disabled={isRestoring} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload style={{ width: '1rem', height: '1rem' }} /> {isRestoring ? "جاري الاستعادة..." : "استعادة"}
          </Button>
        </div>
        {message && <p style={{ color: message.includes("بنجاح") ? '#10b981' : '#ef4444', fontSize: '0.875rem', margin: 0 }}>{message}</p>}
      </form>
    </div>
  );
}