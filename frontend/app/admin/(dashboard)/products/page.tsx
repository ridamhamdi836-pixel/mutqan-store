"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import type { StorefrontProduct } from "@/types/store-dashboard";

type NewProductForm = {
  slug: string;
  nameAr: string;
  shortDescriptionAr: string;
  priceSar: string;
  image: string;
};

const emptyNewProduct: NewProductForm = {
  slug: "",
  nameAr: "",
  shortDescriptionAr: "",
  priceSar: "199",
  image: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<NewProductForm>(emptyNewProduct);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/products", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = products.filter((product) => {
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    return (
      product.slug.toLowerCase().includes(needle) ||
      product.name_ar.toLowerCase().includes(needle)
    );
  });

  async function toggleProduct(product: StorefrontProduct, enabled: boolean) {
    setSavingSlug(product.slug);
    setMessage("");
    const override = {
      ...(product.dashboardOverride ?? {}),
      visibility: {
        ...product.visibility,
        enabled,
        showOnHome: enabled,
        showInCollections: enabled,
        showPdp: enabled,
      },
      catalog: {
        ...(product.dashboardOverride?.catalog ?? {}),
        name_ar: product.name_ar,
        short_description_ar: product.short_description_ar,
        sku: product.sku,
        category_slug: product.category_slug,
        imageFile: product.imageFile,
        storeCardImageFile: product.storeCardImageFile,
      },
      bundles: product.bundles,
    };

    const res = await fetch(`/api/admin/products/${product.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(override),
    });
    setSavingSlug(null);
    if (res.ok) {
      setMessage(enabled ? "تم إظهار المنتج." : "تم إخفاء المنتج.");
      await load();
    } else {
      setMessage("تعذر حفظ التغيير.");
    }
  }

  async function createProduct() {
    setMessage("");
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newProduct,
        priceSar: Number(newProduct.priceSar),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setNewProduct(emptyNewProduct);
      setMessage("تم إنشاء المنتج. يمكنك تعديل تفاصيله الآن.");
      await load();
      window.location.href = `/admin/products/${data.slug}`;
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "تعذر إنشاء المنتج.");
    }
  }

  return (
    <div className="max-w-7xl p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-brand-espresso">إدارة المنتجات</h1>
          <p className="text-sm text-brand-muted">
            تحكمي في الظهور، الأسعار، النصوص الأساسية، وترتيب منتجات المتجر.
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            className="admin-input ps-10"
            placeholder="ابحثي بالاسم أو slug"
            type="search"
          />
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-brand-gold/25 bg-brand-gold/10 px-4 py-3 text-sm font-semibold text-brand-espresso">
          {message}
        </div>
      )}

      <section className="admin-panel mb-8 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-brand-gold" />
          <h2 className="text-lg font-bold text-brand-espresso">إضافة منتج سريع</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          <input
            className="admin-input"
            placeholder="slug بالإنجليزية"
            value={newProduct.slug}
            onChange={(event) =>
              setNewProduct((current) => ({ ...current, slug: event.target.value }))
            }
          />
          <input
            className="admin-input"
            placeholder="اسم المنتج"
            value={newProduct.nameAr}
            onChange={(event) =>
              setNewProduct((current) => ({ ...current, nameAr: event.target.value }))
            }
          />
          <input
            className="admin-input md:col-span-2"
            placeholder="الوصف المختصر"
            value={newProduct.shortDescriptionAr}
            onChange={(event) =>
              setNewProduct((current) => ({
                ...current,
                shortDescriptionAr: event.target.value,
              }))
            }
          />
          <input
            className="admin-input"
            placeholder="السعر"
            type="number"
            value={newProduct.priceSar}
            onChange={(event) =>
              setNewProduct((current) => ({ ...current, priceSar: event.target.value }))
            }
          />
          <input
            className="admin-input md:col-span-4"
            placeholder="رابط الصورة أو مسار /images/products/..."
            value={newProduct.image}
            onChange={(event) =>
              setNewProduct((current) => ({ ...current, image: event.target.value }))
            }
          />
          <button type="button" onClick={createProduct} className="admin-btn-primary">
            إضافة المنتج
          </button>
        </div>
      </section>

      <div className="admin-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="admin-table-head">
            <tr>
              <th className="px-4 py-3 font-medium">المنتج</th>
              <th className="px-4 py-3 font-medium">السعر يبدأ من</th>
              <th className="px-4 py-3 font-medium">الظهور</th>
              <th className="px-4 py-3 font-medium">الترتيب</th>
              <th className="px-4 py-3 font-medium">الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-brand-muted">
                  جارٍ التحميل…
                </td>
              </tr>
            ) : (
              filtered.map((product) => {
                const minPrice = [...product.bundles].sort(
                  (a, b) => a.price_sar - b.price_sar,
                )[0]?.price_sar;

                return (
                  <tr key={product.slug} className="admin-table-row">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${product.slug}`}
                        className="font-bold admin-link"
                      >
                        {product.name_ar}
                      </Link>
                      <p className="text-xs text-brand-muted">{product.slug}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-brand-espresso">
                      {minPrice ? `${minPrice} ر.س` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={product.visibility.enabled ? "text-emerald-600" : "text-rose-600"}>
                        {product.visibility.enabled ? "ظاهر" : "مخفي"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {product.visibility.sortOrder}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/products/${product.slug}`}
                          className="rounded-lg border border-brand-border px-3 py-2 font-semibold text-brand-espresso hover:bg-brand-beige"
                        >
                          تعديل
                        </Link>
                        <button
                          type="button"
                          disabled={savingSlug === product.slug}
                          onClick={() => toggleProduct(product, !product.visibility.enabled)}
                          className="rounded-lg border border-brand-border px-3 py-2 font-semibold text-brand-muted hover:bg-brand-beige disabled:opacity-50"
                        >
                          {product.visibility.enabled ? "إخفاء" : "إظهار"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
