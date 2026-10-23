import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/shared/glass-card";
import { Settings, User, Shield, Store, Users, Database } from "lucide-react";
import { UserForm } from "@/components/settings/user-form";
import { UserManagement } from "@/components/settings/user-management";
import { StoreForm } from "@/components/settings/store-form";
import { BackupForm } from "@/components/settings/backup-form";

export default async function SettingsPage() {
  const session = await auth();
  const currentUser = session?.user as any;
  const isSuperAdmin = currentUser?.email === "admin@nabd.com";

  // جلب جميع المستخدمين (لعرضهم)
   // جلب المستخدمين بناءً على صلاحية المستخدم الحالي
    // جلب المستخدمين بناءً على صلاحية المستخدم الحالي
    // جلب المستخدمين بناءً على صلاحية المستخدم الحالي
  const users = await prisma.user.findMany({
    where: isSuperAdmin 
      ? {} // السوبر أدمن يرى الجميع
      : { 
          companyId: currentUser?.companyId,
          email: { not: "admin@nabd.com" } // <--- استثناء صريح للسوبر أدمن
        },
    orderBy: { createdAt: "desc" },
  });

  // جلب إعدادات المتجر
  const storeSettings = await prisma.storeSettings.findFirst();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>الإعدادات</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>إدارة النظام والحساب الشخصي</p>
      </div>

      {/* 1. إعدادات المتجر (للسوبر أدمن فقط) */}
      {isSuperAdmin && (
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
            <Store style={{ width: '1.5rem', height: '1.5rem', color: '#22d3ee' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>إعدادات المتجر (الشعار والاسم)</h2>
          </div>
          <StoreForm storeSettings={storeSettings} />
        </GlassCard>
      )}

      {/* 2. النسخ الاحتياطي (للسوبر أدمن فقط) */}
      {isSuperAdmin && (
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
            <Database style={{ width: '1.5rem', height: '1.5rem', color: '#22d3ee' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>النسخ الاحتياطي والاستعادة</h2>
          </div>
          <BackupForm />
        </GlassCard>
      )}

      {/* 3. معلومات النظام (تظهر للجميع) */}
      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <Store style={{ width: '1.5rem', height: '1.5rem', color: '#22d3ee' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>معلومات النظام</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>اسم النظام</p>
            <p style={{ color: '#f8fafc', fontWeight: '500', margin: 0 }}>نبض (Nabd)</p>
          </div>
          <div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>الإصدار</p>
            <p style={{ color: '#f8fafc', fontWeight: '500', margin: 0 }}>v1.4.0</p>
          </div>
        </div>
      </GlassCard>

      {/* 4. معلومات الحساب الحالي (تظهر للجميع) */}
      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <User style={{ width: '1.5rem', height: '1.5rem', color: '#22d3ee' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>الحساب الحالي</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>الاسم</p>
            <p style={{ color: '#f8fafc', fontWeight: '500', margin: 0 }}>{currentUser?.name}</p>
          </div>
          <div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>البريد الإلكتروني</p>
            <p style={{ color: '#f8fafc', fontWeight: '500', margin: 0 }}>{currentUser?.email}</p>
          </div>
          <div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>الصلاحية</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: '500' }}>
              <Shield style={{ width: '1rem', height: '1rem' }} />
              {currentUser?.role === 'ADMIN' ? 'مدير' : currentUser?.role === 'CASHIER' ? 'كاشير' : 'أمين مخزن'}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 5. إدارة المستخدمين (للمدير فقط - سواء سوبر أدمن أو مدير شركة) */}
      {currentUser?.role === 'ADMIN' && (
        <GlassCard>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Users style={{ width: '1.5rem', height: '1.5rem', color: '#22d3ee' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>إدارة المستخدمين</h2>
            </div>
            <UserForm isSuperAdmin={isSuperAdmin} />
          </div>
          
          <UserManagement users={users} currentUserId={currentUser?.id} />
        </GlassCard>
      )}
    </div>
  );
}