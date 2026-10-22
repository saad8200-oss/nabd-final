import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/shared/glass-card";
import { DollarSign, TrendingUp, Package, AlertTriangle } from "lucide-react";
import { SalesChart } from "@/components/dashboard/sales-chart";

export default async function DashboardPage() {
  const [salesAgg, productsCount, lowStockProducts, recentSales] = await Promise.all([
    prisma.sale.aggregate({
      _sum: { total: true },
    }),
    prisma.product.count(),
    prisma.product.findMany({
      where: {
        isActive: true,
        stock: { lte: prisma.product.fields.lowStockThreshold },
      },
      take: 5,
      orderBy: { stock: "asc" },
    }),
    // جلب المبيعات لتغذية الرسم البياني (آخر 7 عمليات بيع)
    prisma.sale.findMany({
      take: 7,
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  const totalSales = salesAgg._sum.total || 0;

  // تنسيق البيانات للرسم البياني
  const chartData = recentSales.map((sale) => ({
    date: new Date(sale.createdAt).toLocaleDateString("ar-EG", { weekday: "short" }),
    total: sale.total || 0,
  }));

  // إذا كانت قاعدة البيانات فارغة، نضع بيانات تجريبية للرسم البياني
  if (chartData.length === 0) {
    chartData.push(
      { date: "السبت", total: 0 },
      { date: "الأحد", total: 0 },
      { date: "الاثنين", total: 0 }
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        <p className="text-muted-foreground mt-1">نظرة عامة على أداء المبيعات والمخزون</p>
      </div>

      {/* بطاقات الإحصائيات */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <GlassCard glow>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">إجمالي المبيعات</h3>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold mt-2">{totalSales} ج.م</p>
        </GlassCard>

        <GlassCard glow>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">الأرباح (تقديري)</h3>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold mt-2">0.00 ج.م</p>
          <p className="text-xs text-muted-foreground mt-1">سيتم حسابه لاحقاً</p>
        </GlassCard>

        <GlassCard glow>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">المنتجات</h3>
            <Package className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{productsCount}</p>
        </GlassCard>

        <GlassCard glow>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">تنبيهات المخزون</h3>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold mt-2 text-amber-500">{lowStockProducts.length}</p>
        </GlassCard>
      </div>

      {/* الرسم البياني */}
      <div style={{ marginTop: '1.5rem' }}>
        <SalesChart data={chartData} />
      </div>
    </div>
  );
}