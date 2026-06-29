"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ProductBundle } from "@/types";
import type { ProductOverride, StorefrontProduct } from "@/types/store-dashboard";

type ProductApiResponse = {
  product: StorefrontProduct;
  override: ProductOverride;
};

const toNumber = (value: unknown, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export default function AdminProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = String(params?.slug ?? "");
  const [product, setProduct] = useState<StorefrontProduct | null>(null);
  const [override, setOverride] = useState<ProductOverride>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/products/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as ProductApiResponse;
      setProduct(data.product);
      setOverride({
        ...(data.override ?? {}),
        visibility: data.product.visibility,
        catalog: {
          ...(data.override?.catalog ?? {}),
          name_ar: data.product.name_ar,
          short_description_ar: data.product.short_description_ar,
          sku: data.product.sku,
          category_slug: data.product.category_slug,
          imageFile: data.product.imageFile,
          storeCardImageFile: data.product.storeCardImageFile,
        },
        copy: {
          ...(data.override?.copy ?? {}),
          nameAr: data.product.name_ar,
          shortDescriptionAr: data.product.short_description_ar,
        },
        bundles: data.product.bundles,
      });
    } else {
      setMessage("تعذر تحميل المنتج.");
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const bundles = useMemo(() => override.bundles ?? product?.bundles ?? [], [
    override.bundles,
    product?.bundles,
  ]);

  function updateOverride(next: ProductOverride) {
    setOverride(next);
  }

  function updateBundle(index: number, patch: Partial<ProductBundle>) {
    const nextBundles = bundles.map((bundle, currentIndex) =>
      currentIndex === index ? { ...bundle, ...patch } : bundle,
    );
    updateOverride({ ...override, bundles: nextBundles });
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const res = await fetch(`/api/admin/products/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(override),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("تم حفظ المنتج بنجاح.");
      await load();
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "تعذر حفظ المنتج.");
    }
  }

  if (loading) {
    return <div className="p-6 md:p-8 text-brand-muted">جارٍ تحميل المنتج…</div>;
  }

  if (!product) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-brand-muted">لم يتم العثور على المنتج.</p>
        <Link href="/admin/products" className="admin-link">
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  const visibility = override.visibility ?? product.visibility;
  const catalog = override.catalog ?? {};
  const copy = override.copy ?? {};
  const media = override.media ?? {};

  return (
    <div className="max-w-5xl p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/admin/products" className="admin-link mb-2 inline-flex">
            العودة للمنتجات
          </Link>
          <h1 className="text-2xl font-bold text-brand-espresso">{product.name_ar}</h1>
          <p className="text-sm text-brand-muted">{product.slug}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="rounded-lg border border-brand-border px-4 py-2.5 text-sm font-semibold text-brand-espresso hover:bg-brand-beige"
          >
            معاينة
          </Link>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="admin-btn-primary"
          >
            {saving ? "جارٍ الحفظ…" : "حفظ التغييرات"}
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-brand-gold/25 bg-brand-gold/10 px-4 py-3 text-sm font-semibold text-brand-espresso">
          {message}
        </div>
      )}

      <section className="admin-panel mb-6 p-5">
        <h2 className="mb-4 text-lg font-bold text-brand-espresso">الظهور في المتجر</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["enabled", "المنتج مفعّل"],
            ["showOnHome", "يظهر في الرئيسية"],
            ["showInCollections", "يظهر في المجموعات"],
            ["showPdp", "صفحة المنتج مفعلة"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={Boolean(visibility[key as keyof typeof visibility])}
                onChange={(event) =>
                  updateOverride({
                    ...override,
                    visibility: {
                      ...visibility,
                      [key]: event.target.checked,
                    },
                  })
                }
              />
              {label}
            </label>
          ))}
          <label className="text-sm font-semibold text-brand-espresso">
            ترتيب العرض
            <input
              type="number"
              className="admin-input mt-1"
              value={visibility.sortOrder}
              onChange={(event) =>
                updateOverride({
                  ...override,
                  visibility: {
                    ...visibility,
                    sortOrder: toNumber(event.target.value, visibility.sortOrder),
                  },
                })
              }
            />
          </label>
        </div>
      </section>

      <section className="admin-panel mb-6 p-5">
        <h2 className="mb-4 text-lg font-bold text-brand-espresso">بيانات المنتج الأساسية</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-brand-espresso">
            اسم المنتج
            <input
              className="admin-input mt-1"
              value={catalog.name_ar ?? product.name_ar}
              onChange={(event) =>
                updateOverride({
                  ...override,
                  catalog: { ...catalog, name_ar: event.target.value },
                  copy: { ...copy, nameAr: event.target.value },
                })
              }
            />
          </label>
          <label className="text-sm font-semibold text-brand-espresso">
            SKU
            <input
              className="admin-input mt-1"
              value={catalog.sku ?? product.sku}
              onChange={(event) =>
                updateOverride({
                  ...override,
                  catalog: { ...catalog, sku: event.target.value },
                })
              }
            />
          </label>
          <label className="md:col-span-2 text-sm font-semibold text-brand-espresso">
            الوصف المختصر
            <textarea
              className="admin-input mt-1 min-h-24"
              value={catalog.short_description_ar ?? product.short_description_ar}
              onChange={(event) =>
                updateOverride({
                  ...override,
                  catalog: { ...catalog, short_description_ar: event.target.value },
                  copy: { ...copy, shortDescriptionAr: event.target.value },
                })
              }
            />
          </label>
        </div>
      </section>

      <section className="admin-panel mb-6 p-5">
        <h2 className="mb-4 text-lg font-bold text-brand-espresso">النصوص المقنعة داخل صفحة المنتج</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["homepageSubtitle", "وصف بطاقة الصفحة الرئيسية"],
            ["heroHeadline", "عنوان الهيرو"],
            ["heroSubheadline", "وصف الهيرو"],
            ["problemTitle", "عنوان المشكلة"],
            ["problemCopy", "نص المشكلة"],
            ["solutionTitle", "عنوان الحل"],
            ["solutionCopy", "نص الحل"],
            ["highlightCopy", "النص البارز"],
            ["finalCtaTitle", "عنوان CTA النهائي"],
          ].map(([key, label]) => (
            <label key={key} className="text-sm font-semibold text-brand-espresso">
              {label}
              <textarea
                className="admin-input mt-1 min-h-20"
                value={(copy[key as keyof typeof copy] as string | undefined) ?? ""}
                onChange={(event) =>
                  updateOverride({
                    ...override,
                    copy: { ...copy, [key]: event.target.value },
                  })
                }
              />
            </label>
          ))}
        </div>
      </section>

      <section className="admin-panel mb-6 p-5">
        <h2 className="mb-4 text-lg font-bold text-brand-espresso">الصور الأساسية</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["cardImage", "صورة البطاقة"],
            ["heroImage", "صورة الهيرو"],
            ["painImage", "صورة المشكلة"],
            ["solutionImage", "صورة الحل"],
            ["lifestyleImage", "صورة اللايفستايل"],
          ].map(([key, label]) => (
            <label key={key} className="text-sm font-semibold text-brand-espresso">
              {label}
              <input
                className="admin-input mt-1"
                placeholder="/images/products/example.png"
                value={(media[key as keyof typeof media] as string | undefined) ?? ""}
                onChange={(event) =>
                  updateOverride({
                    ...override,
                    media: { ...media, [key]: event.target.value },
                  })
                }
              />
            </label>
          ))}
        </div>
      </section>

      <section className="admin-panel mb-6 p-5">
        <h2 className="mb-4 text-lg font-bold text-brand-espresso">العروض والأسعار</h2>
        <div className="space-y-4">
          {bundles.map((bundle, index) => (
            <div key={bundle.id} className="rounded-xl border border-brand-border p-4">
              <div className="grid gap-3 md:grid-cols-5">
                <label className="text-sm font-semibold text-brand-espresso">
                  ID
                  <input
                    className="admin-input mt-1"
                    value={bundle.id}
                    onChange={(event) => updateBundle(index, { id: event.target.value })}
                  />
                </label>
                <label className="md:col-span-2 text-sm font-semibold text-brand-espresso">
                  اسم العرض
                  <input
                    className="admin-input mt-1"
                    value={bundle.label_ar}
                    onChange={(event) => updateBundle(index, { label_ar: event.target.value })}
                  />
                </label>
                <label className="text-sm font-semibold text-brand-espresso">
                  الكمية
                  <input
                    type="number"
                    className="admin-input mt-1"
                    value={bundle.quantity}
                    onChange={(event) =>
                      updateBundle(index, { quantity: toNumber(event.target.value, 1) })
                    }
                  />
                </label>
                <label className="text-sm font-semibold text-brand-espresso">
                  السعر
                  <input
                    type="number"
                    className="admin-input mt-1"
                    value={bundle.price_sar}
                    onChange={(event) =>
                      updateBundle(index, { price_sar: toNumber(event.target.value, 0) })
                    }
                  />
                </label>
              </div>
              <div className="mt-3 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={Boolean(bundle.is_default)}
                    onChange={(event) =>
                      updateOverride({
                        ...override,
                        bundles: bundles.map((item, currentIndex) => ({
                          ...item,
                          is_default:
                            currentIndex === index ? event.target.checked : false,
                        })),
                      })
                    }
                  />
                  العرض الافتراضي
                </label>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-brand-espresso hover:bg-brand-beige"
            onClick={() =>
              updateOverride({
                ...override,
                bundles: [
                  ...bundles,
                  {
                    id: `${product.slug}-${bundles.length + 1}`,
                    label_ar: "عرض جديد",
                    quantity: 1,
                    price_sar: bundles[0]?.price_sar ?? 199,
                    is_default: false,
                    sort_order: bundles.length + 1,
                  },
                ],
              })
            }
          >
            إضافة عرض
          </button>
        </div>
      </section>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <button type="button" onClick={save} disabled={saving} className="admin-btn-primary shadow-xl">
          {saving ? "جارٍ الحفظ…" : "حفظ كل التغييرات"}
        </button>
      </div>
    </div>
  );
}
