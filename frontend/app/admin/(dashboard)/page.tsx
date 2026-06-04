"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DateRangeControls,
  getRangeFromPreset,
  type PresetRange,
} from "@/components/admin/DateRangeControls";
import { MetricCard } from "@/components/admin/MetricCard";

type Metrics = {
  page_views: number;
  product_views: number;
  valid_sessions: number;
  orders_count: number;
  revenue_sar: number;
  avg_order_sar: number;
  conversion_rate_session: number;
  conversion_rate_product_view: number;
  add_to_carts: number;
  checkouts_started: number;
  blocked_events: number;
  by_product: { product_slug: string; orders: number; revenue_sar: number }[];
  by_utm: { source: string; orders: number; revenue_sar: number }[];
  daily: { day: string; product_views: number; orders: number }[];
};

export default function AdminDashboardPage() {
  const [preset, setPreset] = useState<PresetRange>("7d");
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const range = getRangeFromPreset(preset, fromInput, toInput);
    const params = new URLSearchParams({ from: range.from, to: range.to });
    const res = await fetch(`/api/admin/metrics?${params}`);
    if (res.ok) setMetrics(await res.json());
    setLoading(false);
  }, [preset, fromInput, toInput]);

  useEffect(() => {
    const r = getRangeFromPreset(preset, fromInput, toInput);
    setFromInput(r.fromInput);
    setToInput(r.toInput);
  }, [preset]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-espresso">لوحة التحكم</h1>
          <p className="text-sm text-brand-muted mt-1">
            الزيارات تُحسب لعناوين IP سعودية صالحة فقط (بدون VPN/بروكسي/استضافة)
          </p>
        </div>
        <DateRangeControls
          preset={preset}
          fromInput={fromInput}
          toInput={toInput}
          onPresetChange={setPreset}
          onFromChange={(v) => {
            setFromInput(v);
            setPreset("custom");
          }}
          onToChange={(v) => {
            setToInput(v);
            setPreset("custom");
          }}
        />
      </div>

      {loading && !metrics ? (
        <p className="text-brand-muted">جارٍ تحميل المؤشرات…</p>
      ) : metrics ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <MetricCard
              label="مشاهدات منتج (صالحة)"
              value={metrics.product_views.toLocaleString()}
              hint="السعودية، بدون VPN"
              accent="blue"
            />
            <MetricCard
              label="الطلبات"
              value={metrics.orders_count.toLocaleString()}
              accent="green"
            />
            <MetricCard
              label="الإيراد (ر.س)"
              value={metrics.revenue_sar.toLocaleString()}
              accent="green"
            />
            <MetricCard
              label="التحويل (مشاهدة → طلب)"
              value={`${metrics.conversion_rate_product_view}%`}
              hint={`${metrics.orders_count} / ${metrics.product_views} مشاهدة`}
              accent="amber"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <MetricCard label="مشاهدات الصفحات" value={metrics.page_views} />
            <MetricCard label="جلسات صالحة" value={metrics.valid_sessions} />
            <MetricCard
              label="تحويل الجلسة"
              value={`${metrics.conversion_rate_session}%`}
              hint="طلبات / جلسات فريدة"
            />
            <MetricCard label="متوسط الطلب (ر.س)" value={metrics.avg_order_sar} />
            <MetricCard label="إضافة للسلة" value={metrics.add_to_carts} />
            <MetricCard label="بدء الدفع" value={metrics.checkouts_started} />
            <MetricCard
              label="أحداث محجوبة"
              value={metrics.blocked_events}
              hint="خارج السعودية أو VPN"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <section className="admin-panel p-5">
              <h2 className="text-sm font-semibold text-brand-espresso mb-4">
                الطلبات حسب المنتج
              </h2>
              <div className="space-y-2">
                {metrics.by_product.length === 0 ? (
                  <p className="text-sm text-brand-muted">لا طلبات في الفترة</p>
                ) : (
                  metrics.by_product.map((row) => (
                    <div
                      key={row.product_slug}
                      className="flex justify-between text-sm py-2 border-b border-brand-border last:border-0"
                    >
                      <span className="text-brand-espresso">{row.product_slug}</span>
                      <span className="text-brand-bronze font-semibold tabular-nums">
                        {row.orders} · {row.revenue_sar} ر.س
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="admin-panel p-5">
              <h2 className="text-sm font-semibold text-brand-espresso mb-4">
                الطلبات حسب مصدر UTM
              </h2>
              <div className="space-y-2">
                {metrics.by_utm.length === 0 ? (
                  <p className="text-sm text-brand-muted">لا بيانات إسناد</p>
                ) : (
                  metrics.by_utm.map((row) => (
                    <div
                      key={row.source}
                      className="flex justify-between text-sm py-2 border-b border-brand-border last:border-0"
                    >
                      <span className="text-brand-espresso">{row.source}</span>
                      <span className="text-brand-bronze font-semibold tabular-nums">
                        {row.orders} · {row.revenue_sar} ر.س
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {metrics.daily.length > 0 && (
            <section className="mt-6 admin-panel p-5">
              <h2 className="text-sm font-semibold text-brand-espresso mb-4">الاتجاه اليومي</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-brand-muted border-b border-brand-border">
                      <th className="py-2 pr-4">اليوم</th>
                      <th className="py-2 pr-4">مشاهدات المنتج</th>
                      <th className="py-2">الطلبات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.daily.map((d) => (
                      <tr key={d.day} className="border-b border-brand-border/80">
                        <td className="py-2 text-brand-espresso">{d.day}</td>
                        <td className="py-2 tabular-nums text-brand-muted">{d.product_views}</td>
                        <td className="py-2 tabular-nums font-semibold text-brand-bronze">
                          {d.orders}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      ) : (
        <p className="text-brand-error">
          تعذر تحميل المؤشرات. تحقق من DATABASE_URL والترحيل.
        </p>
      )}
    </div>
  );
}
