import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/shared/glass-card";
import { AlertTriangle, Box, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProductForm } from "@/components/inventory/product-form";
import Image from "next/image";
import { auth } from "@/auth"; // <--- استيراد auth

export default async function InventoryPage() {
  // جلب جلسة المستخدم لمعرفة صلاحياته
  const session = await auth();
  const userRole = (session?.user as any)?.role || "";
  
  // تحديد ما إذا كان المستخدم يملك صلاحية التعديل
  const canEdit = userRole === "ADMIN" || userRole === "WAREHOUSE";

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* العنوان والأزرار */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>إدارة المخازن</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>متابعة الأصناف والكميات المتوفرة</p>
        </div>
        
        {/* إظهار زر الإضافة فقط للمدير أو أمين المخزن */}
        {canEdit && <ProductForm triggerType="add" />}
      </div>

      {/* شريط البحث */}
      <GlassCard style={{ padding: '1rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', width: '1rem', height: '1rem', color: '#94a3b8' }} />
          <Input placeholder="ابحث بالاسم أو الباركود..." style={{ paddingRight: '2.5rem', backgroundColor: 'rgba(15, 23, 42, 0.5)' }} />
        </div>
      </GlassCard>

      {/* جدول المنتجات */}
      <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500', width: '5rem' }}>الصورة</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>المنتج</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>الباركود</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>السعر</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>الكمية</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>الحالة</th>
              
              {/* عمود الإجراءات يظهر فقط لمن يملك صلاحية */}
              {canEdit && (
                <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500', textAlign: 'left' }}>إجراءات</th>
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isLowStock = product.stock <= product.lowStockThreshold;
              
              return (
                <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ height: '2.5rem', width: '2.5rem', borderRadius: '0.375rem', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover' }} unoptimized />
                      ) : (
                        <Box style={{ width: '1.25rem', height: '1.25rem', color: '#94a3b8' }} />
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '500', color: '#f8fafc' }}>{product.name}</td>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#94a3b8' }}>
                    {product.barcode || "---"}
                  </td>
                  <td style={{ padding: '1rem', color: '#f8fafc' }}>{product.price} ج.م</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: isLowStock ? '#f59e0b' : '#f8fafc', fontWeight: isLowStock ? 'bold' : 'normal' }}>
                      {product.stock}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {isLowStock ? (
                      <Badge variant="outline" style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)', backgroundColor: 'rgba(245, 158, 11, 0.1)', display: 'inline-flex', gap: '0.25rem' }}>
                        <AlertTriangle style={{ width: '0.75rem', height: '0.75rem' }} /> منخفض
                      </Badge>
                    ) : (
                      <Badge variant="outline" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'inline-flex', gap: '0.25rem' }}>
                        <Box style={{ width: '0.75rem', height: '0.75rem' }} /> متوفر
                      </Badge>
                    )}
                  </td>
                  
                  {/* عمود الإجراءات يظهر فقط لمن يملك صلاحية */}
                  {canEdit && (
                    <td style={{ padding: '1rem', textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <ProductForm product={product} triggerType="edit" />
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}