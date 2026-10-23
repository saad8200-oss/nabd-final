import { GlassCard } from "@/components/shared/glass-card";
import { Settings } from "lucide-react";
import { SuperAdminPasswordForm } from "@/components/superadmin/password-form";

export default function SuperAdminSettingsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>إعدادات المنصة</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>إدارة حساب مالك النظام</p>
      </div>

      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <Settings style={{ width: '1.5rem', height: '1.5rem', color: '#22d3ee' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>تغيير كلمة المرور</h2>
        </div>
        <SuperAdminPasswordForm />
      </GlassCard>
    </div>
  );
}