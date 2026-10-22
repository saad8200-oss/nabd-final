import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/shared/glass-card";
import { Eye, DollarSign, TrendingUp, FileText } from "lucide-react";
import Link from "next/link";

export default async function ReportsPage() {
  // جلب الفواتير غير المرتجعة فقط
  const sales = await prisma.sale.findMany({
    where: { isReturned: false },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  // حساب إجمالي المبيعات (للفواتير غير المرتجعة)
  const totalSales = sales.reduce((acc, sale) => acc + sale.total, 0);

  // حساب إجمالي الأرباح
  const salesWithItems = await prisma.sale.findMany({
    where: { isReturned: false },
    include: { items: { include: { product: true } } }
  });

  const totalProfit = salesWithItems.reduce((acc, sale) => {
    const saleProfit = sale.items.reduce((itemAcc, item) => {
      const profitPerItem = (item.unitPrice - item.product.cost) * item.quantity;
      return itemAcc + profitPerItem;
    }, 0);
    return acc + saleProfit;
  }, 0);

  const totalInvoices = sales.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>الفواتير والتقارير</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>سجل كامل لعمليات المبيعات والأرباح</p>
      </div>

      {/* البطاقات الإحصائية */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <GlassCard glow>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#94a3b8' }}>إجمالي المبيعات</h3>
            <DollarSign style={{ width: '1.25rem', height: '1.25rem', color: '#22d3ee' }} />
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#f8fafc' }}>{totalSales} ج.م</p>
        </GlassCard>

        <GlassCard glow>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#94a3b8' }}>إجمالي الأرباح</h3>
            <TrendingUp style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#10b981' }}>{totalProfit} ج.م</p>
        </GlassCard>

        <GlassCard glow>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#94a3b8' }}>عدد الفواتير</h3>
            <FileText style={{ width: '1.25rem', height: '1.25rem', color: '#3b82f6' }} />
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#f8fafc' }}>{totalInvoices}</p>
        </GlassCard>
      </div>

      {/* جدول الفواتير */}
      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>رقم الفاتورة</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>التاريخ</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>الكاشير</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>الإجمالي</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500', textAlign: 'left' }}>التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  لا توجد فواتير مسجلة حتى الآن.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#94a3b8' }}>
                    {sale.invoiceNumber}
                  </td>
                  <td style={{ padding: '1rem', color: '#f8fafc' }}>
                    {new Date(sale.createdAt).toLocaleDateString("ar-EG", {
                      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                  <td style={{ padding: '1rem', color: '#f8fafc' }}>{sale.user.name || "غير معروف"}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: '#22d3ee' }}>
                    {sale.total} ج.م
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'left' }}>
                    <Link 
                      href={`/reports/${sale.id}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#22d3ee', textDecoration: 'none' }}
                    >
                      <Eye style={{ width: '1rem', height: '1rem' }} /> عرض
                    </Link>
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