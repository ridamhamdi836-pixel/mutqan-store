"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        const msg = data.hint
          ? `${data.error || "Login failed"}. ${data.hint}`
          : data.error || "Login failed";
        setError(msg);
        setLoading(false);
        return;
      }
      const next = searchParams?.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-brand-background">
      <div className="w-full max-w-md admin-panel p-8 shadow-lg">
        <div className="flex flex-col items-center text-center mb-2">
          <BrandLogo className="h-14 w-[170px] mb-3" />
          <h1 className="text-xl font-bold text-brand-espresso">لوحة متقن</h1>
          <p className="text-sm text-brand-muted mt-1">إدارة الطلبات والمؤشرات</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1.5">
              اسم المستخدم
            </label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-input py-3"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1.5">
              كلمة المرور
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input py-3"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-brand-error bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full admin-btn-primary py-3"
          >
            {loading ? "جارٍ الدخول…" : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-background flex items-center justify-center text-brand-muted">
          جارٍ التحميل…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
