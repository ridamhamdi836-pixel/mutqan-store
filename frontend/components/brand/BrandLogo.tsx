import { BRAND } from "@/config/brand";
import { StoreImage } from "@/components/ui/StoreImage";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  /** default = dark text on transparent (header). light = for dark backgrounds */
  variant?: "default" | "light";
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function BrandLogo({
  variant = "default",
  className,
  imageClassName,
  priority,
  sizes = "68px",
}: BrandLogoProps) {
  const src =
    variant === "light" ? BRAND.logoSrcLight : BRAND.logoSrc;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden bg-transparent",
        className,
      )}
    >
      <StoreImage
        src={src}
        alt={`شعار ${BRAND.nameAr}`}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-contain object-center bg-transparent",
          imageClassName,
        )}
      />
    </div>
  );
}
