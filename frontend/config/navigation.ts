export type StoreNavItem = {
  label: string;
  href: string;
  isPrimary?: boolean;
  match: (pathname: string) => boolean;
};

export const STORE_NAV_ITEMS: StoreNavItem[] = [
  {
    label: "الجمال والعناية",
    href: "/collections/beauty-vanity",
    isPrimary: true,
    match: (pathname) =>
      pathname === "/" || pathname.startsWith("/collections/beauty-vanity"),
  },
  {
    label: "أدوات المكياج",
    href: "/collections/makeup-tools",
    match: (pathname) => pathname.startsWith("/collections/makeup-tools"),
  },
  {
    label: "تنظيم الجمال",
    href: "/collections/beauty-organization",
    match: (pathname) => pathname.startsWith("/collections/beauty-organization"),
  },
  {
    label: "العناية بالفرش",
    href: "/collections/brush-care",
    match: (pathname) => pathname.startsWith("/collections/brush-care"),
  },
  {
    label: "مجموعات متقن",
    href: "/collections",
    match: (pathname) => pathname === "/collections",
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
