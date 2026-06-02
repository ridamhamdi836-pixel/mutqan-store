import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mutqan Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root min-h-screen bg-slate-950 text-slate-100">{children}</div>;
}
