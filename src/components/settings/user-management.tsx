"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, X } from "lucide-react";
import { updateUser, deleteUser } from "@/app/(dashboard)/settings/actions";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export function UserManagement({ users, currentUserId }: { users: User[], currentUserId: string }) {
  const router = useRouter();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const result = await updateUser(editingUser!.id, formData);
    
    if (result.success) {
      setEditingUser(null);
      router.refresh();
    } else {
      setError("حدث خطأ أثناء التعديل");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (id === currentUserId) {
      alert("لا يمكنك حذف حسابك الحالي!");
      return;
    }
    if (confirm("هل أنت متأكد من حذف هذا المستخدم نهائياً؟")) {
      await deleteUser(id);
      router.refresh();
    }
  };

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th style={{ padding: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>الاسم</th>
            <th style={{ padding: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>البريد الإلكتروني</th>
            <th style={{ padding: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>الصلاحية</th>
            <th style={{ padding: '0.75rem', color: '#94a3b8', fontWeight: '500', textAlign: 'left' }}>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '0.75rem', color: '#f8fafc' }}>{u.name}</td>
              <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{u.email}</td>
              <td style={{ padding: '0.75rem' }}>
                <span style={{ 
                  padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem',
                  backgroundColor: u.role === 'ADMIN' ? 'rgba(16, 185, 129, 0.1)' : u.role === 'CASHIER' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: u.role === 'ADMIN' ? '#10b981' : u.role === 'CASHIER' ? '#3b82f6' : '#f59e0b',
                }}>
                  {u.role === 'ADMIN' ? 'مدير' : u.role === 'CASHIER' ? 'كاشير' : 'أمين مخزن'}
                </span>
              </td>
              <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => setEditingUser(u)}
                  style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(u.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 
        }}>
          <div style={{ 
            backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', 
            width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f8fafc', margin: 0 }}>تعديل المستخدم</h2>
              <button onClick={() => setEditingUser(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X /></button>
            </div>
            
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>الاسم</label>
                <Input name="name" defaultValue={editingUser.name || ""} required style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>البريد الإلكتروني</label>
                <Input name="email" type="email" defaultValue={editingUser.email} required style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>كلمة المرور (اتركها فارغة إذا لم ترد تغييرها)</label>
                <Input name="password" type="password" style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>الصلاحية (الدور)</label>
                <select name="role" defaultValue={editingUser.role} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: 'rgba(15,23,42,0.5)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <option value="CASHIER">كاشير</option>
                  <option value="WAREHOUSE">أمين مخزن</option>
                  <option value="ADMIN">مدير</option>
                </select>
              </div>

              {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

              <Button type="submit" style={{ flex: 1, marginTop: '1rem' }} disabled={isLoading}>
                {isLoading ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}