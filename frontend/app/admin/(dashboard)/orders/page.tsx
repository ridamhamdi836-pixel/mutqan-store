"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  DateRangeControls,
  getRangeFromPreset,
  type PresetRange,
} from "@/components/admin/DateRangeControls";

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone_e164: string;
  confirmation_status: string;
  delivery_status: string;
  total_sar: number;
  utm_source?: string;
  created_at: string;
  items_count: number;
};

export default function AdminOrdersPage() {
  const [preset, setPreset] = useState<PresetRange>("30d");
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const range = getRangeFromPreset(preset, fromInput, toInput);
    const params = new URLSearchParams({
      from: range.from,
      to: range.to,
      limit: "100",
    });
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const res = await fetch(`/api/admin/orders?${params}`);
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
      setTotal(data.total);
    }
    setLoading(false);
  }, [preset, fromInput, toInput, q, status]);

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
      <h1 className="text-2xl font-bold text-white mb-2">Orders</h1>
      <p className="text-sm text-slate-400 mb-6">{total} orders in selected range</p>

      <div className="flex flex-wrap gap-4 mb-6">
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

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="search"
            placeholder="Order #, name, phone…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 pl-10 pr-4 py-2.5 text-sm text-white"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending confirmation</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          type="button"
          onClick={load}
          className="rounded-lg bg-sky-600 hover:bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Apply
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-slate-400 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-slate-500 text-center">
                  Loading…
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-slate-500 text-center">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-slate-800 hover:bg-slate-900/80 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-semibold text-sky-400 hover:underline"
                    >
                      {o.order_number}
                    </Link>
                    <p className="text-xs text-slate-500">{o.items_count} items</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-white">{o.customer_name}</p>
                    <p className="text-xs text-slate-500">{o.customer_phone_e164}</p>
                  </td>
                  <td className="px-4 py-3 font-bold text-white tabular-nums">
                    {o.total_sar} SAR
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-300 capitalize">{o.confirmation_status}</p>
                    <p className="text-xs text-slate-500 capitalize">{o.delivery_status}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{o.utm_source || "—"}</td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    {new Date(o.created_at).toLocaleString("en-GB", {
                      timeZone: "Asia/Riyadh",
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
