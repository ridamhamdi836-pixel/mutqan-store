import { CheckCircle2 } from "lucide-react";
import type { ProductSpecItem } from "@/config/product-specs";

type ProductSpecsSectionProps = {
  title: string;
  lead: string;
  items: ProductSpecItem[];
};

export function ProductSpecsSection({ title, lead, items }: ProductSpecsSectionProps) {
  return (
    <section className="page-x py-10 md:py-14 bg-white">
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso mb-3">
            {title}
          </h2>
          <p className="text-brand-muted leading-relaxed">{lead}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {items.map((item) => (
            <div
              key={item.label}
              className="card p-4 md:p-5 flex gap-3 items-start border-brand-border/60"
            >
              <CheckCircle2 className="w-6 h-6 text-brand-trust shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-brand-espresso">{item.label}</p>
                <p className="text-sm text-brand-muted mt-1 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
