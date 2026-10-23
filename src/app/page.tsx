import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const currentUser = session?.user as any;

  // إذا لم يكن هناك مستخدم مسجل، وجهه إلى صفحة تسجيل الدخول
  if (!currentUser) {
    redirect("/login");
  }

  // إذا كان المستخدم سوبر أدمن (ليس لديه companyId)، وجهه إلى لوحة تحكم المنصة
  if (!currentUser.companyId) {
    redirect("/superadmin");
  }

  // إذا كان مدير شركة أو موظف (لديه companyId)، وجهه إلى لوحة تحكم الشركة
  redirect("/dashboard");
}