"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSuperAdminPassword } from "@/app/(dashboard)/superadmin/actions";

export function SuperAdminPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await updateSuperAdminPassword(formData);

    if (result.success) {
      setMessage("تم تغيير كلمة المرور بنجاح!");
      (e.target as HTMLFormElement).reset();
    } else {
      setMessage(result.error || "حدث خطأ");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>كلمة المرور الحالية</label>
        <Input name="currentPassword" type="password" required style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>كلمة المرور الجديدة</label>
        <Input name="newPassword" type="password" required style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>تأكيد كلمة المرور الجديدة</label>
        <Input name="confirmPassword" type="password" required style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
      </div>

      {message && <p style={{ color: message.includes("بنجاح") ? '#10b981' : '#ef4444', fontSize: '0.875rem' }}>{message}</p>}

      <Button type="submit" disabled={isLoading} style={{ marginTop: '1rem' }}>
        {isLoading ? "جاري الحفظ..." : "حفظ كلمة المرور"}
      </Button>
    </form>
  );
}