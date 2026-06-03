import { Check, X } from "lucide-react";
import { PRODUCT_COMPARISON_ROWS } from "@/config/product-comparison";
import { cn } from "@/lib/utils";

export function ProductComparisonTable() {
  return (
    <section className="cv-section product-section-pad page-x bg-white">
      <div className="max-w-content mx-auto">
        <div className="text-center mb-8 md:mb-10 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso mb-3">
            لماذا يختار العملاء منتجنا؟
          </h2>
          <p className="text-sm md:text-base text-brand-muted leading-relaxed">
            مقارنة سريعة بين تجربة متقن والبدائل التقليدية في السوق.
          </p>
        </div>

        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full min-w-[320px] border-collapse text-sm md:text-base">
            <thead>
              <tr className="border-b-2 border-brand-border">
                <th className="text-start py-3 px-2 md:px-4 font-bold text-brand-muted w-[40%]">
                  الميزة
                </th>
                <th className="py-3 px-2 md:px-4 font-black text-brand-bronze text-center w-[30%]">
                  متقن
                </th>
                <th className="py-3 px-2 md:px-4 font-bold text-brand-muted text-center w-[30%]">
                  البدائل التقليدية
                </th>
              </tr>
            </thead>
            <tbody>
              {PRODUCT_COMPARISON_ROWS.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-brand-border/60 hover:bg-brand-beige/30"
                >
                  <td className="py-3.5 px-2 md:px-4 text-brand-espresso font-medium leading-snug">
                    {row.label}
                  </td>
                  <td className="py-3.5 px-2 md:px-4 text-center">
                    <CellIcon ok={row.us} variant="us" />
                  </td>
                  <td className="py-3.5 px-2 md:px-4 text-center">
                    <CellIcon ok={row.alternative} variant="alt" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function CellIcon({
  ok,
  variant,
}: {
  ok: boolean;
  variant: "us" | "alt";
}) {
  return (
    <span
      className={cn(
        "inline-flex w-8 h-8 md:w-9 md:h-9 rounded-full items-center justify-center mx-auto",
        ok
          ? variant === "us"
            ? "bg-brand-trust/15 text-brand-trust"
            : "bg-brand-trust/10 text-brand-trust"
          : "bg-red-50 text-red-500",
      )}
      aria-label={ok ? "متاح" : "غير متاح"}
    >
      {ok ? <Check className="w-5 h-5" strokeWidth={2.5} /> : <X className="w-5 h-5" strokeWidth={2.5} />}
    </span>
  );
}
