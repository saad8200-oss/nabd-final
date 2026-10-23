"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState(searchParams.get("password") || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل الدخول التلقائي إذا كانت البيانات موجودة في الرابط
  useEffect(() => {
    if (searchParams.get("email") && searchParams.get("password")) {
      handleSubmit(); 
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>البريد الإلكتروني</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ 
            width: '100%', padding: '0.75rem', borderRadius: '0.5rem', 
            backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.1)', 
            color: '#f8fafc', outline: 'none' 
          }} 
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>كلمة المرور</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ 
            width: '100%', padding: '0.75rem', borderRadius: '0.5rem', 
            backgroundColor: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.1)', 
            color: '#f8fafc', outline: 'none' 
          }} 
        />
      </div>
      
      {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', textAlign: 'center', margin: 0 }}>{error}</p>}
      
      <button 
        type="submit" 
        disabled={isLoading} 
        style={{ 
          width: '100%', padding: '0.75rem', borderRadius: '0.5rem', 
          backgroundColor: '#22d3ee', color: '#0f172a', fontWeight: 'bold', 
          border: 'none', cursor: 'pointer', marginTop: '0.5rem',
          opacity: isLoading ? 0.7 : 1
        }}
      >
        {isLoading ? "جاري الدخول..." : "دخول"}
      </button>
    </form>
  );
}