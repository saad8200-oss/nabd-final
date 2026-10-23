"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, FileText, Settings, Activity, Truck, Building2 } from "lucide-react";
import { useSession } from "next-auth/react";

const navItems = [
  { name: "إدارة الشركات", href: "/superadmin", icon: Building2, roles: ["ADMIN"], superAdminOnly: true }, // <--- تمت إضافة superAdminOnly
  { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard, roles: ["ADMIN", "CASHIER", "WAREHOUSE"] },
  { name: "المخازن", href: "/inventory", icon: Package, roles: ["ADMIN", "WAREHOUSE"] },
  { name: "الموردين", href: "/suppliers", icon: Truck, roles: ["ADMIN", "WAREHOUSE"] },
  { name: "نقطة البيع", href: "/pos", icon: ShoppingCart, roles: ["ADMIN", "CASHIER"] },
  { name: "الفواتير والتقارير", href: "/reports", icon: FileText, roles: ["ADMIN"] },
    { name: "الإعدادات", href: "/settings", icon: Settings, roles: ["ADMIN"] },
];

function SidebarContent() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "";
  const userEmail = (session?.user as any)?.email || "";
  const isSuperAdmin = userEmail === "admin@nabd.com"; // <--- تمت الإضافة

  return (
    <aside style={{ width: '16rem', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, right: 0 }}>
      <div style={{ height: '4rem', display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Activity style={{ width: '1.5rem', height: '1.5rem', color: '#22d3ee', marginLeft: '0.5rem' }} />
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>نبض (Nabd)</span>
      </div>
      
      <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => {
          if (!item.roles.includes(userRole)) return null;
          
          // إخفاء الصفحات المخصصة للسوبر أدمن فقط
          if (item.superAdminOnly && !isSuperAdmin) return null;

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                textDecoration: 'none',
                color: isActive ? '#22d3ee' : '#94a3b8',
                backgroundColor: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              <item.icon style={{ width: '1.25rem', height: '1.25rem', color: isActive ? '#22d3ee' : '#94a3b8' }} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function Sidebar() {
  return (
    <Suspense fallback={<div style={{ width: '16rem', borderLeft: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 23, 42, 0.8)', height: '100vh' }} />}>
      <SidebarContent />
    </Suspense>
  );
}