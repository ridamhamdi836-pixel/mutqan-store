import { MutqanLogoMark } from "@/components/brand/MutqanLogoMark";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  /** default = dark text (header). light = for dark backgrounds */
  variant?: "default" | "light" | "gold";
  orientation?: "horizontal" | "stacked" | "icon";
  className?: string;
};

/** Consistent store logo — SVG only, fills its box (set h + w on className). */
export function BrandLogo({
  variant = "default",
  orientation = "horizontal",
  className,
}: BrandLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-transparent",
        className,
      )}
    >
      <MutqanLogoMark variant={variant} orientation={orientation} />
    </span>
  );
}
