"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ProductBundle } from "@/types";
import type { ProductOverride, StorefrontProduct } from "@/types/store-dashboard";
import type { ProductPageConfig } from "@/config/products";
import type { CroProductPageConfig } from "@/types/cro-product-page";

type ProductApiResponse = {
  product: StorefrontProduct;
  config: ProductPageConfig;
  croPage: CroProductPageConfig;
  override: ProductOverride;
};

type MediaKey = "cardImage" | "heroImage" | "painImage" | "solutionImage" | "lifestyleImage";
type MediaAspectKey = "heroAspect" | "painAspect" | "solutionAspect" | "lifestyleAspect";

const MEDIA_ASPECT_KEY: Partial<Record<MediaKey, MediaAspectKey>> = {
  heroImage: "heroAspect",
  painImage: "painAspect",
  solutionImage: "solutionAspect",
  lifestyleImage: "lifestyleAspect",
};

const MEDIA_FIELDS: Array<{ key: MediaKey; label: string; help: string }> = [
  {
    key: "cardImage",
    label: "صورة البطاقة",
    help: "تظهر في الصفحة الرئيسية والمجموعات.",
  },
  {
    key: "heroImage",
    label: "صورة الهيرو",
    help: "تظهر أعلى صفحة المنتج.",
  },
  {
    key: "painImage",
    label: "صورة المشكلة",
    help: "تظهر في قسم قبل متقن.",
  },
  {
    key: "solutionImage",
    label: "صورة الحل",
    help: "تظهر في قسم بعد متقن.",
  },
  {
    key: "lifestyleImage",
    label: "صورة اللايفستايل",
    help: "تظهر في قسم أسلوب الحياة/الفوائد.",
  },
];

const COPY_FIELDS: Array<{ key: keyof NonNullable<ProductOverride["copy"]>; label: string }> = [
  { key: "homepageSubtitle", label: "وصف بطاقة الصفحة الرئيسية" },
  { key: "heroHeadline", label: "عنوان الهيرو" },
  { key: "heroSubheadline", label: "وصف الهيرو" },
  { key: "problemTitle", label: "عنوان المشكلة" },
  { key: "problemCopy", label: "نص المشكلة" },
  { key: "solutionTitle", label: "عنوان الحل" },
  { key: "solutionCopy", label: "نص الحل" },
  { key: "highlightCopy", label: "النص البارز" },
  { key: "finalCtaTitle", label: "عنوان CTA النهائي" },
];

const toNumber = (value: unknown, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

function productImagePath(file?: string) {
  if (!file) return "";
  return file.startsWith("/") ? file : `/images/products/${file}`;
}

export default function AdminProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = String(params?.slug ?? "");
  const [product, setProduct] = useState<StorefrontProduct | null>(null);
  const [override, setOverride] = useState<ProductOverride>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<MediaKey | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/products/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as ProductApiResponse;
      const defaultCardImage = productImagePath(
        data.product.storeCardImageFile ?? data.product.imageFile,
      );
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
          homepageSubtitle: data.product.short_description_ar,
          heroHeadline: data.croPage.hero.headline,
          heroSubheadline: data.croPage.hero.subheadline,
          problemTitle: data.croPage.problem.title,
          problemCopy: data.croPage.problem.copy,
          solutionTitle: data.croPage.solution.title,
          solutionCopy: data.croPage.solution.copy,
          highlightCopy: data.croPage.highlight.copy,
          finalCtaTitle: data.croPage.finalCta.title,
          nameAr: data.product.name_ar,
          shortDescriptionAr: data.product.short_description_ar,
          ...(data.override?.copy ?? {}),
        },
        media: {
          cardImage: defaultCardImage,
          heroImage: data.config.heroSectionImage ?? defaultCardImage,
          heroAspect: data.config.heroSectionAspect,
          heroImageAlt: data.config.heroSectionImageAlt ?? data.product.name_ar,
          painImage: data.config.painSectionImage ?? "",
          painAspect: data.config.painSectionAspect,
          solutionImage: data.config.solutionSectionImage ?? "",
          solutionAspect: data.config.solutionSectionAspect,
          lifestyleImage: data.config.lifestyleSectionImage ?? "",
          lifestyleAspect: data.config.lifestyleSectionAspect,
          ...(data.override?.media ?? {}),
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

  async function uploadImage(key: MediaKey, file: File | null) {
    if (!file || !product) return;

    setUploadingKey(key);
    setMessage("");
    const form = new FormData();
    form.set("file", file);
    form.set("slug", product.slug);
    form.set("slot", key);
    form.set("alt", product.name_ar);

    const res = await fetch("/api/admin/media", {
      method: "POST",
      body: form,
    });
    setUploadingKey(null);

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMessage(data.error || "تعذر رفع الصورة.");
      return;
    }

    const aspectKey = MEDIA_ASPECT_KEY[key];
    const nextMedia = {
      ...(override.media ?? {}),
      [key]: data.url as string,
      ...(aspectKey && data.aspectRatio ? { [aspectKey]: data.aspectRatio as string } : {}),
      ...(key === "heroImage" ? { heroImageAlt: product.name_ar } : {}),
    };

    updateOverride({
      ...override,
      media: nextMedia,
      catalog:
        key === "cardImage"
          ? {
              ...(override.catalog ?? {}),
              imageFile: data.url as string,
              storeCardImageFile: data.url as string,
            }
          : override.catalog,
    });
    setMessage("تم رفع الصورة. اضغطي حفظ التغييرات لتطبيقها في المتجر.");
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
          {COPY_FIELDS.map(({ key, label }) => (
            <label key={key} className="text-sm font-semibold text-brand-espresso">
              {label}
              <textarea
                className="admin-input mt-1 min-h-20"
                value={(copy[key] as string | undefined) ?? ""}
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
        <p className="mb-4 text-sm text-brand-muted">
          ارفعي الصورة من جهازك، وسيتم ضبط إطارها حسب أبعادها حتى تظهر كاملة بدون قص.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {MEDIA_FIELDS.map((field) => (
            <ImageUploadField
              key={field.key}
              field={field}
              value={(media[field.key] as string | undefined) ?? ""}
              uploading={uploadingKey === field.key}
              onUpload={(file) => uploadImage(field.key, file)}
              onClear={() =>
                updateOverride({
                  ...override,
                  media: { ...media, [field.key]: "" },
                })
              }
            />
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

function ImageUploadField({
  field,
  value,
  uploading,
  onUpload,
  onClear,
}: {
  field: { key: MediaKey; label: string; help: string };
  value: string;
  uploading: boolean;
  onUpload: (file: File | null) => void;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-brand-espresso">{field.label}</h3>
          <p className="mt-1 text-xs leading-relaxed text-brand-muted">{field.help}</p>
        </div>
        {value ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-brand-border px-3 py-1.5 text-xs font-bold text-brand-muted hover:bg-brand-beige"
          >
            إزالة
          </button>
        ) : null}
      </div>

      <div className="mb-3 overflow-hidden rounded-xl border border-brand-border bg-brand-background">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={field.label} className="h-auto w-full object-contain" />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center px-4 text-center text-xs font-bold text-brand-muted">
            لم يتم رفع صورة بعد
          </div>
        )}
      </div>

      <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-brand-gold/40 bg-brand-gold/10 px-4 py-3 text-sm font-extrabold text-brand-espresso transition hover:bg-brand-gold/15">
        {uploading ? "جارٍ رفع الصورة…" : "تحميل صورة"}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          disabled={uploading}
          onChange={(event) => {
            onUpload(event.target.files?.[0] ?? null);
            event.target.value = "";
          }}
        />
      </label>

      {value ? (
        <p className="mt-2 break-all text-[11px] text-brand-muted">{value}</p>
      ) : null}
    </div>
  );
}
