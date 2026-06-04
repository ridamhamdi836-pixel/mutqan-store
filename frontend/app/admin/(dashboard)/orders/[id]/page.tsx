"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Save } from "lucide-react";
import { OrderPreview, type AdminOrderItem, type AdminOrderRow } from "@/components/admin/OrderPreview";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId =
    params && typeof params.id === "string" ? params.id : null;
  const [order, setOrder] = useState<AdminOrderRow | null>(null);
  const [items, setItems] = useState<AdminOrderItem[]>([]);
  const [confirmation, setConfirmation] = useState("");
  const [delivery, setDelivery] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    if (!orderId) return;
    const res = await fetch(`/api/admin/orders/${orderId}`);
    if (!res.ok) return;
    const data = await res.json();
    setOrder(data.order);
    setItems(data.items);
    setConfirmation(data.order.confirmation_status || "pending");
    setDelivery(data.order.delivery_status || "pending");
    setNotes(data.order.internal_notes || "");
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!orderId) return;
    setSaving(true);
    setMessage("");
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        confirmation_status: confirmation,
        delivery_status: delivery,
        internal_notes: notes,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("تم الحفظ");
      load();
    } else {
      setMessage("فشل الحفظ");
    }
  };

  if (!order) {
    return (
      <div className="p-8 text-brand-muted">
        <Link
          href="/admin/orders"
          className="admin-link text-sm inline-flex items-center gap-1 mb-4"
        >
          <ArrowRight className="w-4 h-4" /> العودة للطلبات
        </Link>
        جارٍ تحميل الطلب…
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <Link
        href="/admin/orders"
        className="admin-link text-sm inline-flex items-center gap-1 mb-6 hover:underline"
      >
        <ArrowRight className="w-4 h-4" /> العودة للطلبات
      </Link>

      <OrderPreview order={order} items={items} />

      <section className="mt-8 admin-panel p-6 space-y-4">
        <h2 className="text-sm font-semibold text-brand-espresso uppercase tracking-wide">
          تحديث الطلب
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-brand-muted mb-1">التأكيد</label>
            <select
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="admin-input"
            >
              {["pending", "confirmed", "cancelled", "no_answer"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-brand-muted mb-1">التوصيل</label>
            <select
              value={delivery}
              onChange={(e) => setDelivery(e.target.value)}
              className="admin-input"
            >
              {["pending", "packed", "shipped", "out_for_delivery", "delivered", "returned"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-brand-muted mb-1">ملاحظات داخلية</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="admin-input resize-y"
            placeholder="سجل المكالمة، رقم المندوب، سبب الإلغاء…"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="admin-btn-primary inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "جارٍ الحفظ…" : "حفظ التغييرات"}
          </button>
          {message && (
            <span className="text-sm text-emerald-600 font-medium">{message}</span>
          )}
        </div>
      </section>
    </div>
  );
}
