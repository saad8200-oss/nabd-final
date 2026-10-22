import Link from "next/link";

export default function OfflinePage() {
  return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#f8fafc' 
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>أنت غير متصل بالإنترنت</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>يرجى التحقق من اتصالك بالشبكة والمحاولة مرة أخرى.</p>
      <Link href="/dashboard" style={{ 
        backgroundColor: '#22d3ee', color: '#0f172a', padding: '0.75rem 1.5rem', 
        borderRadius: '0.5rem', fontWeight: 'bold', textDecoration: 'none' 
      }}>
        إعادة المحاولة
      </Link>
    </div>
  );
}