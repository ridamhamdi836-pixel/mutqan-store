export type StoreNavItem = {
  label: string;
  href: string;
  isPrimary?: boolean;
  match: (pathname: string) => boolean;
};

export const STORE_NAV_ITEMS: StoreNavItem[] = [
  {
    label: "الرئيسية",
    href: "/",
    isPrimary: true,
    match: (pathname) => pathname === "/",
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

export const STORE_ANNOUNCEMENT_MESSAGES = [
  {
    id: "cod-shipping",
    icon: "truck" as const,
    text: "الدفع عند الاستلام • شحن سريع لجميع مناطق المملكة",
  },
  {
    id: "korean-actives",
    icon: "shield" as const,
    text: "معزّزات كورية مركّزة • مكونات نشطة بجرعات واضحة",
  },
  {
    id: "guarantee",
    icon: "heart" as const,
    text: "ضمان 30 يوم • استرجاع كامل عند عدم الرضا",
  },
] as const;
