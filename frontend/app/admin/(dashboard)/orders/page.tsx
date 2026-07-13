"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  DateRangeControls,
  getRangeFromPreset,
  type PresetRange,
} from "@/components/admin/DateRangeControls";
import { adminCurrencySymbol } from "@/lib/currency";

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone_e164: string;
  confirmation_status: string;
  delivery_status: string;
  total_sar: number;
  currency?: string;
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
  const [currency, setCurrency] = useState("");
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
    if (currency) params.set("currency", currency);
    const res = await fetch(`/api/admin/orders?${params}`);
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
      setTotal(data.total);
    }
    setLoading(false);
  }, [preset, fromInput, toInput, q, status, currency]);

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
      <h1 className="text-2xl font-bold text-brand-espresso mb-2">الطلبات</h1>
      <p className="text-sm text-brand-muted mb-6">{total} طلب في الفترة المحددة</p>

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
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
          <input
            type="search"
            placeholder="رقم الطلب، الاسم، الجوال…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            className="admin-input ps-10"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="admin-input w-auto min-w-[10rem]"
        >
          <option value="">كل الحالات</option>
          <option value="pending">بانتظار التأكيد</option>
          <option value="confirmed">مؤكد</option>
          <option value="shipped">شُحن</option>
          <option value="delivered">تم التسليم</option>
          <option value="cancelled">ملغى</option>
        </select>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="admin-input w-auto min-w-[10rem]"
        >
          <option value="">كل الدول</option>
          <option value="SAR">السعودية</option>
          <option value="AED">الإمارات</option>
        </select>
        <button type="button" onClick={load} className="admin-btn-primary">
          تطبيق
        </button>
      </div>

      <div className="admin-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="admin-table-head">
            <tr>
              <th className="px-4 py-3 font-medium">الطلب</th>
              <th className="px-4 py-3 font-medium">العميل</th>
              <th className="px-4 py-3 font-medium">الدولة</th>
              <th className="px-4 py-3 font-medium">المجموع</th>
              <th className="px-4 py-3 font-medium">الحالة</th>
              <th className="px-4 py-3 font-medium">المصدر</th>
              <th className="px-4 py-3 font-medium">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-brand-muted text-center">
                  جارٍ التحميل…
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-brand-muted text-center">
                  لا توجد طلبات
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="admin-table-row">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-semibold admin-link hover:underline"
                    >
                      {o.order_number}
                    </Link>
                    <p className="text-xs text-brand-muted">{o.items_count} منتج</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-brand-espresso font-medium">{o.customer_name}</p>
                    <p className="text-xs text-brand-muted">{o.customer_phone_e164}</p>
                  </td>
                  <td className="px-4 py-3 text-brand-muted whitespace-nowrap">
                    {o.currency === "AED" ? "الإمارات" : "السعودية"}
                  </td>
                  <td className="px-4 py-3 font-bold text-brand-espresso tabular-nums">
                    {o.total_sar} {adminCurrencySymbol(o.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-brand-espresso capitalize">{o.confirmation_status}</p>
                    <p className="text-xs text-brand-muted capitalize">{o.delivery_status}</p>
                  </td>
                  <td className="px-4 py-3 text-brand-muted">{o.utm_source || "—"}</td>
                  <td className="px-4 py-3 text-brand-muted whitespace-nowrap">
                    {new Date(o.created_at).toLocaleString("ar-SA", {
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
