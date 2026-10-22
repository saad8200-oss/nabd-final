"use client";

import { Bell, User, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();
  
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const userName = session?.user?.name || "مستخدم";
  const userEmail = session?.user?.email || "";

  return (
    <header style={{ height: '4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 10 }}>
      <div>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#e2e8f0' }}>مرحباً بك في نظام نبض</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', position: 'relative' }}>
          <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
          <span style={{ position: 'absolute', top: '0', right: '0', width: '0.5rem', height: '0.5rem', backgroundColor: '#ef4444', borderRadius: '50%' }} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '1rem' }}>
          <div style={{ textAlign: 'left' }}>
            {/* عرض اسم المستخدم الحقيقي */}
            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#fff', margin: 0 }}>{userName}</p>
            {/* عرض البريد الإلكتروني الحقيقي */}
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>{userEmail}</p>
          </div>
          <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', backgroundColor: 'rgba(34, 211, 238, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(34, 211, 238, 0.3)', color: '#22d3ee' }}>
            <User style={{ width: '1.25rem', height: '1.25rem' }} />
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