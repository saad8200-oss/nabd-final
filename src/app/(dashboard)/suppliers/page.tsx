import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/shared/glass-card";
import { Truck, Plus } from "lucide-react";
import { SupplierForm } from "@/components/suppliers/supplier-form";

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>إدارة الموردين</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>إدارة شركات التوريد والأصناف المرتبطة بها</p>
        </div>
        <SupplierForm />
      </div>

      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>اسم المورد</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>رقم الهاتف</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>البريد الإلكتروني</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>عدد المنتجات</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  لا يوجد موردين مضافين حتى الآن.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr key={supplier.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem', color: '#f8fafc', fontWeight: '500' }}>{supplier.name}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>{supplier.phone || "---"}</td>
                  <td style={{ padding: '1rem', color: '#94a3b8' }}>{supplier.email || "---"}</td>
                  <td style={{ padding: '1rem', color: '#22d3ee', fontWeight: 'bold' }}>{supplier._count.products}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}