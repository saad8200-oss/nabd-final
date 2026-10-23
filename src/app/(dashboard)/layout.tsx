import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const currentUser = session?.user as any;

  // جلب شعار الشركة (إذا كان المستخدم ينتمي لشركة)
  let companyLogo = null;
  if (currentUser?.companyId) {
    const company = await prisma.company.findUnique({
      where: { id: currentUser.companyId },
      select: { logo: true },
    });
    companyLogo = company?.logo;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '100%', overflow: 'hidden' }}>
        {/* تمرير الشعار إلى Header */}
        <Header companyLogo={companyLogo} />
        <main style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}