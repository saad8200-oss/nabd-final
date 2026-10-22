import { prisma } from "@/lib/prisma";
import LoginForm from "./login-form";

export default async function LoginPage() {
  // جلب إعدادات المتجر من قاعدة البيانات
  const settings = await prisma.storeSettings.findFirst();
  
  const storeName = settings?.storeName || "نبض (Nabd)";
  const logoUrl = settings?.logoUrl;

  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
      backgroundColor: '#0f172a', position: 'relative', overflow: 'hidden' 
    }}>
      <div style={{ 
        position: 'absolute', inset: 0, 
        background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.1) 0%, #0f172a 70%)' 
      }} />
      
      <div style={{ 
        position: 'relative', zIndex: 10, width: '100%', maxWidth: '400px', padding: '2rem', 
        borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', 
        backgroundColor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(24px)', 
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Logo" 
              style={{ width: '4rem', height: '4rem', objectFit: 'contain', marginBottom: '1rem' }} 
            />
          ) : (
            <div style={{ 
              width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'rgba(34, 211, 238, 0.2)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' 
            }}>
              <span style={{ color: '#22d3ee', fontSize: '1.5rem', fontWeight: 'bold' }}>ن</span>
            </div>
          )}
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', margin: 0 }}>{storeName}</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>تسجيل الدخول للنظام</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}