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
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Traffic counts only valid KSA IPs (no VPN/proxy/hosting)
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
        <p className="text-slate-500">Loading metrics…</p>
      ) : metrics ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <MetricCard
              label="Valid product views"
              value={metrics.product_views.toLocaleString()}
              hint="KSA, non-VPN"
              accent="blue"
            />
            <MetricCard
              label="Orders"
              value={metrics.orders_count.toLocaleString()}
              accent="green"
            />
            <MetricCard
              label="Revenue (SAR)"
              value={metrics.revenue_sar.toLocaleString()}
              accent="green"
            />
            <MetricCard
              label="Conversion (views → orders)"
              value={`${metrics.conversion_rate_product_view}%`}
              hint={`${metrics.orders_count} / ${metrics.product_views} product views`}
              accent="amber"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <MetricCard label="Page views (valid)" value={metrics.page_views} />
            <MetricCard label="Valid sessions" value={metrics.valid_sessions} />
            <MetricCard
              label="Session conversion"
              value={`${metrics.conversion_rate_session}%`}
              hint="Orders / unique sessions"
            />
            <MetricCard label="Avg order (SAR)" value={metrics.avg_order_sar} />
            <MetricCard label="Add to cart (valid)" value={metrics.add_to_carts} />
            <MetricCard label="Checkout started" value={metrics.checkouts_started} />
            <MetricCard
              label="Blocked events"
              value={metrics.blocked_events}
              hint="Non-KSA or VPN/proxy"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <h2 className="text-sm font-semibold text-slate-300 mb-4">Orders by product</h2>
              <div className="space-y-2">
                {metrics.by_product.length === 0 ? (
                  <p className="text-sm text-slate-500">No orders in range</p>
                ) : (
                  metrics.by_product.map((row) => (
                    <div
                      key={row.product_slug}
                      className="flex justify-between text-sm py-2 border-b border-slate-800 last:border-0"
                    >
                      <span className="text-slate-300">{row.product_slug}</span>
                      <span className="text-white font-medium tabular-nums">
                        {row.orders} · {row.revenue_sar} SAR
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <h2 className="text-sm font-semibold text-slate-300 mb-4">Orders by UTM source</h2>
              <div className="space-y-2">
                {metrics.by_utm.length === 0 ? (
                  <p className="text-sm text-slate-500">No attribution data</p>
                ) : (
                  metrics.by_utm.map((row) => (
                    <div
                      key={row.source}
                      className="flex justify-between text-sm py-2 border-b border-slate-800 last:border-0"
                    >
                      <span className="text-slate-300">{row.source}</span>
                      <span className="text-white font-medium tabular-nums">
                        {row.orders} · {row.revenue_sar} SAR
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {metrics.daily.length > 0 && (
            <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <h2 className="text-sm font-semibold text-slate-300 mb-4">Daily trend</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800">
                      <th className="py-2 pr-4">Day</th>
                      <th className="py-2 pr-4">Product views</th>
                      <th className="py-2">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.daily.map((d) => (
                      <tr key={d.day} className="border-b border-slate-800/60">
                        <td className="py-2 text-slate-300">{d.day}</td>
                        <td className="py-2 tabular-nums">{d.product_views}</td>
                        <td className="py-2 tabular-nums font-medium text-white">{d.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      ) : (
        <p className="text-red-400">Failed to load metrics. Check DATABASE_URL and migration.</p>
      )}
    </div>
  );
}
