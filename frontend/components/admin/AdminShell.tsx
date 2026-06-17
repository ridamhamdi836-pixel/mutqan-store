"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, LogOut } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/orders", label: "الطلبات", icon: Package },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen">
      <aside className="admin-sidebar">
        <div className="mb-8 px-1">
          <Link href="/admin" className="block">
            <BrandLogo className="h-12 w-[150px] mb-2" />
          </Link>
          <p className="text-xs text-brand-muted font-medium">عمليات الدفع عند الاستلام</p>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : (pathname?.startsWith(item.href) ?? false);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "admin-nav-link",
                  active && "admin-nav-link-active",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="admin-nav-link mt-4 w-full text-start"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </aside>
      <main className="flex-1 overflow-auto bg-brand-background">{children}</main>
    </div>
  );
}
