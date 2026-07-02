export type StoreNavItem = {
  label: string;
  href: string;
  isPrimary?: boolean;
  match: (pathname: string) => boolean;
};

export const STORE_NAV_ITEMS: StoreNavItem[] = [
  {
    label: "الإشراقة",
    href: "/products/glow",
    isPrimary: true,
    match: (pathname) =>
      pathname === "/" || pathname.startsWith("/products/glow"),
  },
  {
    label: "الإصلاح",
    href: "/products/repair",
    match: (pathname) => pathname.startsWith("/products/repair"),
  },
  {
    label: "الشباب",
    href: "/products/youth",
    match: (pathname) => pathname.startsWith("/products/youth"),
  },
  {
    label: "المجموعة",
    href: "/collections",
    match: (pathname) => pathname.startsWith("/collections"),
  },
  {
    label: "عن متقن",
    href: "/about",
    match: (pathname) => pathname === "/about",
  },
];

export function isNavItemActive(item: StoreNavItem, pathname: string): boolean {
  return item.match(pathname);
}
