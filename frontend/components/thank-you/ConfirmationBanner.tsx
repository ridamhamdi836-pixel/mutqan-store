"use client";

import { Phone, PhoneIncoming } from "lucide-react";
import type { CallExpectation } from "@/lib/call-window";
import { cn } from "@/lib/utils";

type ConfirmationBannerProps = {
  expectation: CallExpectation;
};

export function ConfirmationBanner({ expectation }: ConfirmationBannerProps) {
  const urgent = expectation.variant === "within_minutes";

  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-4 md:p-5 text-start shadow-lg",
        urgent
          ? "border-amber-400 bg-gradient-to-l from-amber-50 via-amber-50/90 to-white"
          : "border-brand-trust/40 bg-gradient-to-l from-brand-trust/10 to-white",
      )}
      role="status"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
            urgent ? "bg-amber-500 text-white" : "bg-brand-trust text-white",
          )}
        >
          {urgent ? (
            <PhoneIncoming className="w-6 h-6 animate-pulse" />
          ) : (
            <Phone className="w-6 h-6" />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-wide",
              urgent ? "text-amber-800" : "text-brand-trust",
            )}
          >
            خطوة مهمة — لا تغلق الصفحة
          </p>
          <h2 className="text-lg md:text-xl font-black text-brand-espresso leading-snug">
            {expectation.bannerHeadline}
          </h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            {expectation.bannerSubline}
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 mt-2 text-xs font-bold px-3 py-1 rounded-pill",
              urgent ? "bg-amber-200/80 text-amber-900" : "bg-brand-trust/15 text-brand-trust",
            )}
          >
            <Phone className="w-3.5 h-3.5" />
            {expectation.etaLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
