"use client";

import { useMemo } from "react";
import { Phone, PhoneIncoming } from "lucide-react";
import { getCallExpectation } from "@/lib/call-window";
import { cn } from "@/lib/utils";

export function ProductCodStrip() {
  const expectation = useMemo(() => getCallExpectation(), []);
  const urgent = expectation.variant === "within_minutes";

  return (
    <div
      className={cn(
        "rounded-xl border p-3.5 md:p-4 text-start",
        urgent
          ? "border-amber-300 bg-amber-50/90"
          : "border-brand-trust/30 bg-brand-trust/5",
      )}
    >
      <div className="flex gap-3 items-start">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
            urgent ? "bg-amber-500 text-white" : "bg-brand-trust text-white",
          )}
        >
          {urgent ? (
            <PhoneIncoming className="w-5 h-5" />
          ) : (
            <Phone className="w-5 h-5" />
          )}
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-bold text-brand-espresso">
            {expectation.bannerHeadline}
          </p>
          <p className="text-xs text-brand-muted leading-relaxed">
            {expectation.bannerSubline}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-trust mt-1">
            <Phone className="w-3 h-3" />
            {expectation.etaLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
