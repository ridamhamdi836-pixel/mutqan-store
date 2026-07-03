"use client";

import { useEffect, useState } from "react";
import type { StoreSettingsOverride } from "@/types/store-dashboard";

const defaultSettings: StoreSettingsOverride = {
  brand: {
    nameAr: "متقن",
    nameEn: "Mutqan",
    taglineAr: "تفاصيل أجمل… لأنك تستحقين الأفضل",
    logoSrc: "/images/brand/mutqan-beauty-logo.png?v=1",
    logoSrcLight: "/images/brand/mutqan-beauty-logo.png?v=1",
    whatsappNumber: "212717783042",
    supportEmail: "support@mutqan.online",
  },
  theme: {
    background: "#FAF8F6",
    surface: "#FFFFFF",
    beige: "#EADBC8",
    espresso: "#0F172A",
    gold: "#D4AF37",
    secondary: "#EADBC8",
    text: "#0F172A",
    muted: "#64748B",
    border: "#E8E0D8",
    trust: "#0F172A",
  },
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettingsOverride>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/store-settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSettings({
          brand: { ...defaultSettings.brand, ...(data.settings?.brand ?? {}) },
          theme: { ...defaultSettings.theme, ...(data.settings?.theme ?? {}) },
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  async function save() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/store-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setMessage(res.ok ? "تم حفظ إعدادات المتجر." : "تعذر حفظ الإعدادات.");
  }

  const brand = settings.brand ?? {};
  const theme = settings.theme ?? {};

  if (loading) {
    return <div className="p-6 md:p-8 text-brand-muted">جارٍ تحميل الإعدادات…</div>;
  }

  return (
    <div className="max-w-5xl p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-brand-espresso">إعدادات المتجر</h1>
          <p className="text-sm text-brand-muted">
            تحكمي في هوية متقن: الاسم، الشعار، الألوان، وبيانات التواصل.
          </p>
        </div>
        <button type="button" onClick={save} disabled={saving} className="admin-btn-primary">
          {saving ? "جارٍ الحفظ…" : "حفظ الإعدادات"}
        </button>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-brand-gold/25 bg-brand-gold/10 px-4 py-3 text-sm font-semibold text-brand-espresso">
          {message}
        </div>
      )}

      <section className="admin-panel mb-6 p-5">
        <h2 className="mb-4 text-lg font-bold text-brand-espresso">الهوية والتواصل</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["nameAr", "اسم المتجر بالعربية"],
            ["nameEn", "اسم المتجر بالإنجليزية"],
            ["taglineAr", "التاغلاين"],
            ["whatsappNumber", "رقم واتساب"],
            ["supportEmail", "البريد الإلكتروني"],
            ["logoSrc", "رابط اللوغو الأساسي"],
            ["logoSrcLight", "رابط اللوغو الفاتح"],
          ].map(([key, label]) => (
            <label key={key} className="text-sm font-semibold text-brand-espresso">
              {label}
              <input
                className="admin-input mt-1"
                value={(brand[key as keyof typeof brand] as string | undefined) ?? ""}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    brand: { ...(current.brand ?? {}), [key]: event.target.value },
                  }))
                }
              />
            </label>
          ))}
        </div>
      </section>

      <section className="admin-panel mb-6 p-5">
        <h2 className="mb-4 text-lg font-bold text-brand-espresso">ألوان المتجر</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            ["background", "الخلفية"],
            ["surface", "البطاقات"],
            ["beige", "العاجي"],
            ["espresso", "الكحلي الداكن"],
            ["gold", "الذهبي"],
            ["secondary", "الثانوي"],
            ["text", "النص الأساسي"],
            ["muted", "النص الهادئ"],
            ["border", "الحدود"],
            ["trust", "ألوان الثقة"],
          ].map(([key, label]) => (
            <label key={key} className="text-sm font-semibold text-brand-espresso">
              {label}
              <div className="mt-1 flex gap-2">
                <input
                  type="color"
                  className="h-11 w-14 rounded-lg border border-brand-border bg-white p-1"
                  value={(theme[key as keyof typeof theme] as string | undefined) ?? "#000000"}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      theme: { ...(current.theme ?? {}), [key]: event.target.value },
                    }))
                  }
                />
                <input
                  className="admin-input"
                  value={(theme[key as keyof typeof theme] as string | undefined) ?? ""}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      theme: { ...(current.theme ?? {}), [key]: event.target.value },
                    }))
                  }
                />
              </div>
            </label>
          ))}
        </div>
      </section>

      <section
        className="rounded-2xl border border-brand-border p-6 shadow-card"
        style={{
          background: theme.background,
          color: theme.text,
          borderColor: theme.border,
        }}
      >
        <p className="text-sm font-semibold" style={{ color: theme.gold }}>
          معاينة سريعة
        </p>
        <h3 className="mt-2 text-2xl font-extrabold">{brand.nameAr}</h3>
        <p className="mt-2 text-sm" style={{ color: theme.muted }}>
          {brand.taglineAr}
        </p>
        <button
          type="button"
          className="mt-5 rounded-xl px-5 py-3 text-sm font-bold text-white"
          style={{ background: theme.espresso }}
        >
          زر الطلب الرئيسي
        </button>
      </section>
    </div>
  );
}
