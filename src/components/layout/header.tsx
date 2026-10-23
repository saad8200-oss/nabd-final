"use client";

import { Bell, User, LogOut, ArrowRight } from "lucide-react";
import { signOut, signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Header({ companyLogo }: { companyLogo?: string | null }) {
  const { data: session } = useSession();
  const currentUser = session?.user as any;
  const router = useRouter(); // <--- تعريف الراوتر

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const handleReturnToSuperAdmin = async () => {
    // 1. تسجيل الخروج من الحساب الحالي (الشركة)
    await signOut({ redirect: false });
    
    // 2. تسجيل الدخول بحساب السوبر أدمن
    const res = await signIn("credentials", {
      email: "admin@nabd.com",
      password: "123456", // تأكد أن هذه هي كلمة مرور السوبر أدمن
      redirect: false,
    });

    // 3. التوجيه إلى لوحة تحكم السوبر أدمن
    if (res?.ok) {
      router.push("/superadmin");
      router.refresh();
    }
  };

  const userName = currentUser?.name || "مستخدم";
  const userEmail = currentUser?.email || "";
  const isImpersonating = currentUser?.isImpersonating === true;

  return (
    <header style={{ height: '4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 10 }}>
      <div>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#e2e8f0' }}>مرحباً بك في نظام نبض</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        
        {/* زر العودة إلى المنصة (يظهر فقط إذا كان السوبر أدمن متنكراً) */}
        {isImpersonating && (
          <button 
            onClick={handleReturnToSuperAdmin}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', 
              padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.75rem',
              border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            <ArrowRight style={{ width: '1rem', height: '1rem' }} /> العودة إلى المنصة
          </button>
        )}

        <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', position: 'relative' }}>
          <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
          <span style={{ position: 'absolute', top: '0', right: '0', width: '0.5rem', height: '0.5rem', backgroundColor: '#ef4444', borderRadius: '50%' }} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '1rem' }}>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#fff', margin: 0 }}>{userName}</p>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>{userEmail}</p>
          </div>
          
          <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', backgroundColor: 'rgba(34, 211, 238, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(34, 211, 238, 0.3)', color: '#22d3ee', overflow: 'hidden', position: 'relative' }}>
            {companyLogo ? (
              <Image src={companyLogo} alt="Logo" fill style={{ objectFit: 'cover' }} unoptimized />
            ) : (
              <User style={{ width: '1.25rem', height: '1.25rem' }} />
            )}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
          title="تسجيل الخروج"
        >
          <LogOut style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
      </div>
    </header>
  );
}