"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/types";

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-brand-border rounded-card overflow-hidden border border-brand-border">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-start bg-brand-surface hover:bg-brand-beige/40 transition-colors"
            >
              <span className="font-semibold text-sm md:text-base text-brand-espresso leading-snug">
                {item.question}
              </span>
              <ChevronDown className={cn(
                "w-5 h-5 text-brand-muted flex-shrink-0 transition-transform duration-200",
                isOpen && "rotate-180"
              )} />
            </button>
            {isOpen && (
              <div className="px-4 md:px-5 pb-4 md:pb-5 bg-brand-surface">
                <p className="text-sm text-brand-muted leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
