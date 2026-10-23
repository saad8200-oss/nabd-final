import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/shared/glass-card";
import { Building2, Plus } from "lucide-react";
import { CompanyForm } from "@/components/superadmin/company-form";
import { CompanyActions } from "@/components/superadmin/company-actions"; // <--- استيراد المكون الجديد

export default async function SuperAdminPage() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { users: true } } },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>إدارة الشركات (نبض)</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>لوحة تحكم مالك النظام</p>
        </div>
        <CompanyForm />
      </div>

      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>اسم الشركة</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>البريد الإلكتروني</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>تاريخ الانتهاء</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>الحالة</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>عدد المستخدمين</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500', textAlign: 'left' }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  لا توجد شركات مسجلة حتى الآن.
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#f8fafc' }}>{company.name}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>{company.email}</td>
                  <td style={{ padding: '1rem', color: '#f8fafc' }}>
                    {company.expiryDate ? new Date(company.expiryDate).toLocaleDateString('ar-EG') : 'غير محدد'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem',
                      backgroundColor: company.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: company.isActive ? '#10b981' : '#ef4444',
                    }}>
                      {company.isActive ? 'نشطة' : 'موقوفة'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#22d3ee', fontWeight: 'bold' }}>{company._count.users}</td>
                  <td style={{ padding: '1rem', textAlign: 'left' }}>
                    {/* مكون الأزرار الجديد */}
                    <CompanyActions company={company} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}