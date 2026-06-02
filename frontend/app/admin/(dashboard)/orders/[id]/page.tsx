"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
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
      setMessage("Saved");
      load();
    } else {
      setMessage("Save failed");
    }
  };

  if (!order) {
    return (
      <div className="p-8 text-slate-500">
        <Link href="/admin/orders" className="text-sky-400 text-sm inline-flex items-center gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to orders
        </Link>
        Loading order…
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <Link
        href="/admin/orders"
        className="text-sky-400 text-sm inline-flex items-center gap-1 mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </Link>

      <OrderPreview order={order} items={items} />

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
          Update order
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Confirmation</label>
            <select
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white text-sm"
            >
              {["pending", "confirmed", "cancelled", "no_answer"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Delivery</label>
            <select
              value={delivery}
              onChange={(e) => setDelivery(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white text-sm"
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
          <label className="block text-xs text-slate-500 mb-1">Internal notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white text-sm resize-y"
            placeholder="Call log, courier ref, cancellation reason…"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : "Save changes"}
          </button>
          {message && <span className="text-sm text-emerald-400">{message}</span>}
        </div>
      </section>
    </div>
  );
}
