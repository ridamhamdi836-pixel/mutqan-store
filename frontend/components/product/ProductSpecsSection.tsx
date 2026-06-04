import type { ProductSpecRow } from "@/config/product-specs";

type ProductSpecsSectionProps = {
  specs: ProductSpecRow[];
};

export function ProductSpecsSection({ specs }: ProductSpecsSectionProps) {
  if (specs.length === 0) return null;

  return (
    <section className="cv-section product-section-pad page-x bg-white">
      <div className="max-w-content mx-auto max-w-2xl">
        <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso text-center mb-2">
          تفاصيل المنتج
        </h2>
        <p className="text-sm text-brand-muted text-center mb-6">
          معلومات واضحة قبل الطلب — بدون مفاجآت.
        </p>
        <dl className="card divide-y divide-brand-border/60 overflow-hidden">
          {specs.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 px-4 py-3.5 text-sm"
            >
              <dt className="font-bold text-brand-muted shrink-0">{row.label}</dt>
              <dd className="font-semibold text-brand-espresso text-end leading-snug">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
