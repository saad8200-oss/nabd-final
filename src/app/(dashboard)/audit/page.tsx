import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/shared/glass-card";
import { auth } from "@/auth";

export default async function AuditPage() {
  const session = await auth();
  const currentUser = session?.user as any;
  const isSuperAdmin = currentUser?.email === "admin@nabd.com";

  const logs = await prisma.auditLog.findMany({
    where: isSuperAdmin ? {} : { companyId: currentUser?.companyId },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: true },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>سجل العمليات (Audit Log)</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>تتبع كل حركة داخل النظام</p>
      </div>

      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem', color: '#94a3b8' }}>التاريخ</th>
              <th style={{ padding: '1rem', color: '#94a3b8' }}>المستخدم</th>
              <th style={{ padding: '1rem', color: '#94a3b8' }}>العملية</th>
              <th style={{ padding: '1rem', color: '#94a3b8' }}>التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                  {new Date(log.createdAt).toLocaleString('ar-EG')}
                </td>
                <td style={{ padding: '1rem', color: '#f8fafc' }}>{log.user?.name || 'غير معروف'}</td>
                <td style={{ padding: '1rem', color: '#22d3ee', fontWeight: 'bold' }}>{log.action}</td>
                <td style={{ padding: '1rem', color: '#f8fafc' }}>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}