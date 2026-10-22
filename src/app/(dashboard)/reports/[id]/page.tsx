import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/shared/glass-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PrintButton } from "@/components/shared/print-button";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { ReturnButton } from "@/components/reports/return-button"; // <--- استيراد زر الإرجاع

export default async function InvoiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const sale = await prisma.sale.findUnique({
    where: { id: resolvedParams.id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!sale) {
    notFound();
  }

  // تجهيز نص الفاتورة للواتساب
  const invoiceText = `
فاتورة رقم: ${sale.invoiceNumber}
التاريخ: ${new Date(sale.createdAt).toLocaleString("ar-EG")}

المنتجات:
${sale.items.map(item => `- ${item.product.name} (عدد ${item.quantity}) = ${item.quantity * item.unitPrice} ج.م`).join('\n')}

الإجمالي: ${sale.total} ج.م
شكراً لتعاملكم معنا!
  `;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '48rem', margin: '0 auto' }}>
      
      {/* أزرار العودة والطباعة والواتساب والإرجاع */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }} className="print:hidden">
        <Link 
          href="/reports" 
          style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
        >
          <ArrowRight style={{ width: '1rem', height: '1rem' }} /> العودة للفواتير
        </Link>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* زر الإرجاع يظهر فقط إذا لم تكن الفاتورة مرتجعة */}
          {!sale.isReturned && <ReturnButton saleId={sale.id} />}
          
          <WhatsAppButton invoiceDetails={invoiceText} />
          <PrintButton />
        </div>
      </div>

      {/* بطاقة الفاتورة */}
      <GlassCard style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* علامة "مرتجعة" */}
        {sale.isReturned && (
          <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', backgroundColor: '#ef4444', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            مرتجعة
          </div>
        )}

        {/* ترويسة الفاتورة */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22d3ee', margin: 0 }}>نبض (Nabd)</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>فاتورة مبيعات</p>
        </div>

        {/* معلومات الفاتورة */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <p style={{ margin: 0, color: '#f8fafc' }}>
              <span style={{ color: '#94a3b8' }}>رقم الفاتورة:</span> <span style={{ fontFamily: 'monospace' }}>{sale.invoiceNumber}</span>
            </p>
            <p style={{ margin: 0, color: '#f8fafc' }}>
              <span style={{ color: '#94a3b8' }}>التاريخ:</span> {new Date(sale.createdAt).toLocaleString("ar-EG")}
            </p>
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, color: '#f8fafc' }}>
              <span style={{ color: '#94a3b8' }}>الكاشير:</span> {sale.user.name}
            </p>
          </div>
        </div>

        {/* جدول المنتجات */}
        <table style={{ width: '100%', fontSize: '0.875rem', marginBottom: '2rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#94a3b8', fontWeight: '500' }}>المنتج</th>
              <th style={{ textAlign: 'center', padding: '0.5rem 0', color: '#94a3b8', fontWeight: '500' }}>الكمية</th>
              <th style={{ textAlign: 'left', padding: '0.5rem 0', color: '#94a3b8', fontWeight: '500' }}>السعر</th>
              <th style={{ textAlign: 'left', padding: '0.5rem 0', color: '#94a3b8', fontWeight: '500' }}>المجموع</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ textAlign: 'right', padding: '0.75rem 0', color: '#f8fafc' }}>{item.product.name}</td>
                <td style={{ textAlign: 'center', padding: '0.75rem 0', color: '#f8fafc' }}>{item.quantity}</td>
                <td style={{ textAlign: 'left', padding: '0.75rem 0', color: '#f8fafc' }}>{item.unitPrice} ج.م</td>
                <td style={{ textAlign: 'left', padding: '0.75rem 0', fontWeight: 'bold', color: '#f8fafc' }}>{item.quantity * item.unitPrice} ج.م</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* الإجمالي */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.125rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
              <span style={{ color: '#f8fafc' }}>الإجمالي:</span>
              <span style={{ color: sale.isReturned ? '#ef4444' : '#22d3ee', textDecoration: sale.isReturned ? 'line-through' : 'none' }}>
                {sale.total} ج.م
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.75rem', color: '#94a3b8' }}>
          شكراً لتعاملكم معنا!
        </div>
      </GlassCard>
    </div>
  );
}