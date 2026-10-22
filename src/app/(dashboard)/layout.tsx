import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '100%', overflow: 'hidden' }}>
        <Header />
        <main style={{ flex: 1, padding: '1.5rem', overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}