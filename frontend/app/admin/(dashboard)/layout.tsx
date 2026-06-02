import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminFromCookies } from "@/lib/admin-auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
