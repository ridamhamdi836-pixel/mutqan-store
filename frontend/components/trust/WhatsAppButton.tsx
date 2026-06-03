"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/config/brand";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  message?: string;
  label?: string;
  className?: string;
  floating?: boolean;
}

export function WhatsAppButton({
  message,
  label = "تواصل عبر واتساب",
  className,
  floating = false,
}: WhatsAppButtonProps) {
  if (floating) {
    return (
      <a
        href={WHATSAPP_URL(message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className={cn(
          "fixed bottom-24 start-6 z-30 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center max-lg:hidden",
          className,
        )}
      >
        <MessageCircle className="w-6 h-6 fill-white" />
      </a>
    );
  }

  return (
    <a
      href={WHATSAPP_URL(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-pill border border-[#25D366] text-[#25D366] font-medium px-5 py-2.5 text-sm hover:bg-[#25D366] hover:text-white transition-colors duration-150",
        className,
      )}
    >
      <MessageCircle className="w-4 h-4" />
      <span>{label}</span>
    </a>
  );
}
