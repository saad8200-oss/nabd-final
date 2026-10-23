import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/shared/glass-card";
import { Building2, Users, Activity, Settings, FileText } from "lucide-react";
import Link from "next/link";

export default async function SuperAdminDashboard() {
  const totalCompanies = await prisma.company.count();
  const totalUsers = await prisma.user.count();
  const activeCompanies = await prisma.company.count({ where: { isActive: true } });
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>لوحة تحكم مالك النظام</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>مرحباً بك، إليك نظرة عامة على أداء المنصة</p>
      </div>

      {/* روابط سريعة */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/superadmin/companies" style={{ textDecoration: 'none' }}>
          <GlassCard glow style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.5rem', cursor: 'pointer' }}>
            <Building2 style={{ color: '#22d3ee' }} />
            <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>إدارة الشركات</span>
          </GlassCard>
        </Link>
        
        <Link href="/superadmin/audit" style={{ textDecoration: 'none' }}>
          <GlassCard glow style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.5rem', cursor: 'pointer' }}>
            <FileText style={{ color: '#22d3ee' }} />
            <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>سجل النظام</span>
          </GlassCard>
        </Link>

        <Link href="/superadmin/settings" style={{ textDecoration: 'none' }}>
          <GlassCard glow style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.5rem', cursor: 'pointer' }}>
            <Settings style={{ color: '#22d3ee' }} />
            <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>الإعدادات</span>
          </GlassCard>
        </Link>
      </div>

      {/* البطاقات الإحصائية */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <GlassCard glow>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem' }}>إجمالي الشركات</h3>
            <Building2 style={{ color: '#22d3ee', width: '1.25rem', height: '1.25rem' }} />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f8fafc', marginTop: '0.5rem' }}>{totalCompanies}</p>
        </GlassCard>

        <GlassCard glow>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem' }}>الشركات النشطة</h3>
            <Activity style={{ color: '#10b981', width: '1.25rem', height: '1.25rem' }} />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.5rem' }}>{activeCompanies}</p>
        </GlassCard>

        <GlassCard glow>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '0.875rem' }}>إجمالي المستخدمين</h3>
            <Users style={{ color: '#3b82f6', width: '1.25rem', height: '1.25rem' }} />
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f8fafc', marginTop: '0.5rem' }}>{totalUsers}</p>
        </GlassCard>
      </div>
    </div>
  );
}