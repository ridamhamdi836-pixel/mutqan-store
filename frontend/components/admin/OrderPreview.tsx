"use client";

import Link from "next/link";
import { Phone, ExternalLink, Calendar, Tag } from "lucide-react";

export type AdminOrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone_e164: string;
  customer_phone_national?: string;
  confirmation_status: string;
  delivery_status: string;
  subtotal_sar: number;
  upsell_total_sar: number;
  total_sar: number;
  currency: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_page?: string;
  referrer?: string;
  internal_notes?: string;
  customer_city?: string;
  customer_address?: string;
  created_at: string;
};

export type AdminOrderItem = {
  id: string;
  product_slug: string;
  bundle_id?: string;
  name_ar: string;
  quantity: number;
  unit_price_sar: number;
  total_price_sar: number;
  item_type: string;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-300",
  confirmed: "bg-emerald-500/20 text-emerald-300",
  cancelled: "bg-red-500/20 text-red-300",
  shipped: "bg-sky-500/20 text-sky-300",
  delivered: "bg-emerald-500/20 text-emerald-300",
};

function StatusBadge({ label }: { label: string }) {
  const key = label?.toLowerCase() || "pending";
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
        STATUS_STYLES[key] || "bg-slate-700 text-slate-300"
      }`}
    >
      {label}
    </span>
  );
}

interface OrderPreviewProps {
  order: AdminOrderRow;
  items: AdminOrderItem[];
  compact?: boolean;
}

export function OrderPreview({ order, items, compact }: OrderPreviewProps) {
  const created = new Date(order.created_at).toLocaleString("en-GB", {
    timeZone: "Asia/Riyadh",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const mainItems = items.filter((i) => i.item_type === "main");
  const upsellItems = items.filter((i) => i.item_type !== "main");

  return (
    <div
      className={`rounded-2xl border border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden ${
        compact ? "" : "shadow-2xl"
      }`}
    >
      <div className="border-b border-slate-700/80 px-6 py-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Order</p>
          <h1 className="text-2xl font-bold text-white mt-1">{order.order_number}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            {created}
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white tabular-nums">
            {order.total_sar}{" "}
            <span className="text-lg font-semibold text-slate-400">{order.currency}</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">COD · Pay on delivery</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-0 md:divide-x divide-slate-700/80">
        <div className="p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Customer</h2>
          <p className="text-xl font-bold text-white">{order.customer_name}</p>
          <a
            href={`tel:${order.customer_phone_e164}`}
            className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm font-medium"
          >
            <Phone className="w-4 h-4" />
            {order.customer_phone_national || order.customer_phone_e164}
          </a>
          {(order.customer_city || order.customer_address) && (
            <p className="text-sm text-slate-400 leading-relaxed">
              {[order.customer_city, order.customer_address].filter(Boolean).join(" · ")}
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            <StatusBadge label={order.confirmation_status} />
            <StatusBadge label={order.delivery_status} />
          </div>
        </div>

        <div className="p-6 space-y-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Attribution</h2>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <Tag className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-300">
                  {order.utm_source || "direct"}
                  {order.utm_medium ? ` / ${order.utm_medium}` : ""}
                </p>
                {order.utm_campaign && (
                  <p className="text-slate-500 text-xs">{order.utm_campaign}</p>
                )}
              </div>
            </div>
            {order.landing_page && (
              <p className="text-xs text-slate-500 break-all">{order.landing_page}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Items</h2>
        <ul className="space-y-2">
          {mainItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-xl bg-slate-800/50 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-semibold text-white truncate">{item.name_ar}</p>
                <p className="text-xs text-slate-500">
                  {item.product_slug}
                  {item.bundle_id ? ` · ${item.bundle_id}` : ""} × {item.quantity}
                </p>
              </div>
              <p className="font-bold text-white tabular-nums shrink-0">{item.total_price_sar} SAR</p>
            </li>
          ))}
          {upsellItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-slate-600 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-200">{item.name_ar}</p>
                <p className="text-xs text-amber-500/90">Upsell</p>
              </div>
              <p className="font-bold text-amber-200 tabular-nums">{item.total_price_sar} SAR</p>
            </li>
          ))}
        </ul>
      </div>

      {!compact && order.internal_notes && (
        <div className="mx-6 mb-6 rounded-xl bg-slate-800/40 border border-slate-700 px-4 py-3">
          <p className="text-xs text-slate-500 uppercase mb-1">Internal notes</p>
          <p className="text-sm text-slate-300 whitespace-pre-wrap">{order.internal_notes}</p>
        </div>
      )}

      {!compact && (
        <div className="px-6 pb-6 flex flex-wrap gap-2">
          {mainItems[0]?.product_slug && (
            <Link
              href={`/products/${mainItems[0].product_slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:underline"
            >
              View product page <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
