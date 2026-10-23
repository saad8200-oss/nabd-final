import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/shared/glass-card";
import { ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import { CompanyEditForm } from "@/components/superadmin/company-edit-form";

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const company = await prisma.company.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!company) {
    notFound();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/superadmin" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <ArrowRight style={{ width: '1rem', height: '1rem' }} /> العودة للشركات
        </Link>
      </div>

      <GlassCard style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <Building2 style={{ width: '1.5rem', height: '1.5rem', color: '#22d3ee' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f8fafc', margin: 0 }}>تعديل شركة {company.name}</h1>
        </div>

        <CompanyEditForm company={company} />
      </GlassCard>
    </div>
  );
}