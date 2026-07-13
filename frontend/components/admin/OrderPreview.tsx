"use client";

import Link from "next/link";
import { getProductPath } from "@/config/catalog";
import { adminCurrencySymbol } from "@/lib/currency";
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
  pending: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  confirmed: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200",
  shipped: "bg-sky-50 text-sky-800 ring-1 ring-sky-200",
  delivered: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200",
};

function StatusBadge({ label }: { label: string }) {
  const key = label?.toLowerCase() || "pending";
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
        STATUS_STYLES[key] || "bg-brand-beige text-brand-muted ring-1 ring-brand-border"
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
  const currencySymbol = adminCurrencySymbol(order.currency);
  const created = new Date(order.created_at).toLocaleString("ar-SA", {
    timeZone: "Asia/Riyadh",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const mainItems = items.filter((i) => i.item_type === "main");
  const upsellItems = items.filter((i) => i.item_type !== "main");

  return (
    <div
      className={`admin-panel overflow-hidden ${compact ? "" : "shadow-lg"}`}
    >
      <div className="border-b border-brand-border px-6 py-5 flex flex-wrap items-start justify-between gap-4 bg-gradient-to-b from-brand-beige/40 to-white">
        <div>
          <p className="text-xs text-brand-muted uppercase tracking-widest">الطلب</p>
          <h1 className="text-2xl font-bold text-brand-bronze mt-1">{order.order_number}</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-brand-muted">
            <Calendar className="w-3.5 h-3.5" />
            {created}
          </div>
          <p className="text-xs text-brand-muted mt-1">
            {order.currency === "AED" ? "الإمارات" : "السعودية"}
          </p>
        </div>
        <div className="text-end">
          <p className="text-3xl font-black text-brand-espresso tabular-nums">
            {order.total_sar}{" "}
            <span className="text-lg font-semibold text-brand-muted">{currencySymbol}</span>
          </p>
          <p className="text-xs text-brand-muted mt-1">دفع عند الاستلام</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-0 md:divide-x md:divide-brand-border">
        <div className="p-6 space-y-4">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wide">
            العميل
          </h2>
          <p className="text-xl font-bold text-brand-espresso">{order.customer_name}</p>
          <a
            href={`tel:${order.customer_phone_e164}`}
            className="inline-flex items-center gap-2 admin-link text-sm"
          >
            <Phone className="w-4 h-4" />
            {order.customer_phone_national || order.customer_phone_e164}
          </a>
          {(order.customer_city || order.customer_address) && (
            <p className="text-sm text-brand-muted leading-relaxed">
              {[order.customer_city, order.customer_address].filter(Boolean).join(" · ")}
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            <StatusBadge label={order.confirmation_status} />
            <StatusBadge label={order.delivery_status} />
          </div>
        </div>

        <div className="p-6 space-y-3">
          <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wide">
            الإسناد
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <Tag className="w-4 h-4 text-brand-muted shrink-0 mt-0.5" />
              <div>
                <p className="text-brand-espresso">
                  {order.utm_source || "direct"}
                  {order.utm_medium ? ` / ${order.utm_medium}` : ""}
                </p>
                {order.utm_campaign && (
                  <p className="text-brand-muted text-xs">{order.utm_campaign}</p>
                )}
              </div>
            </div>
            {order.landing_page && (
              <p className="text-xs text-brand-muted break-all">{order.landing_page}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <h2 className="text-sm font-semibold text-brand-muted uppercase tracking-wide mb-3">
          المنتجات
        </h2>
        <ul className="space-y-2">
          {mainItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-xl bg-brand-beige/50 px-4 py-3 border border-brand-border/60"
            >
              <div className="min-w-0">
                <p className="font-semibold text-brand-espresso truncate">{item.name_ar}</p>
                <p className="text-xs text-brand-muted">
                  {item.product_slug}
                  {item.bundle_id ? ` · ${item.bundle_id}` : ""} × {item.quantity}
                </p>
              </div>
              <p className="font-bold text-brand-espresso tabular-nums shrink-0">
                {item.total_price_sar} {currencySymbol}
              </p>
            </li>
          ))}
          {upsellItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-brand-bronze/40 bg-brand-bronze/5 px-4 py-3"
            >
              <div>
                <p className="font-medium text-brand-espresso">{item.name_ar}</p>
                <p className="text-xs text-brand-bronze font-semibold">إضافة upsell</p>
              </div>
              <p className="font-bold text-brand-bronze tabular-nums">
                {item.total_price_sar} {currencySymbol}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {!compact && order.internal_notes && (
        <div className="mx-6 mb-6 rounded-xl bg-amber-50/80 border border-amber-200 px-4 py-3">
          <p className="text-xs text-amber-800 uppercase mb-1 font-semibold">ملاحظات داخلية</p>
          <p className="text-sm text-brand-espresso whitespace-pre-wrap">{order.internal_notes}</p>
        </div>
      )}

      {!compact && (
        <div className="px-6 pb-6 flex flex-wrap gap-2">
          {mainItems[0]?.product_slug && (
            <Link
              href={getProductPath(mainItems[0].product_slug)}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs admin-link hover:underline"
            >
              صفحة المنتج <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
