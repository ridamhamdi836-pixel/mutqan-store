import type { MarketId } from "@/config/markets";
import { getMarketConfig } from "@/config/markets";
import { formatWesternNumber } from "@/lib/format-number";

export type StoreLocale = "ar" | "en";

type MarketStrings = Record<MarketId, { ar: string; en: string }>;

const M = (saAr: string, saEn: string, aeAr: string, aeEn: string): MarketStrings => ({
  SA: { ar: saAr, en: saEn },
  AE: { ar: aeAr, en: aeEn },
});

const UI = {
  navHome: { ar: "الرئيسية", en: "Home" },
  navCollections: { ar: "المجموعة", en: "Collection" },
  navAbout: { ar: "عن متقن", en: "About" },
  openCart: { ar: "فتح السلة", en: "Open cart" },
  openMenu: { ar: "فتح القائمة", en: "Open menu" },
  closeMenu: { ar: "إغلاق القائمة", en: "Close menu" },
  langSwitchToEn: { ar: "EN", en: "ع" },
  langSwitchAria: { ar: "التبديل إلى الإنجليزية", en: "Switch to Arabic" },
  faq: { ar: "الأسئلة الشائعة", en: "FAQ" },
  trackOrder: { ar: "تتبع الطلب", en: "Track order" },
  checkoutTitle: { ar: "إتمام الطلب", en: "Checkout" },
  checkoutClose: { ar: "إغلاق", en: "Close" },
  checkoutUrgency: { ar: "آخر 48 ساعة على عرض الشحن المجاني", en: "Last 48 hours of free shipping" },
  checkoutSocialProof: { ar: "+1,200 عميل طلبوا هذا الأسبوع", en: "+1,200 customers ordered this week" },
  checkoutContinueShopping: { ar: "الاستمرار في التسوق — اختر منتجات أخرى", en: "Continue shopping — add more items" },
  checkoutYourOrder: { ar: "طلبك", en: "Your order" },
  checkoutTotal: { ar: "الإجمالي", en: "Total" },
  checkoutFreeCod: { ar: "شحن مجاني · الدفع عند الاستلام فقط", en: "Free shipping · Cash on delivery only" },
  checkoutFullName: { ar: "الاسم الكامل", en: "Full name" },
  checkoutNamePlaceholder: { ar: "مثال: سارة محمد", en: "e.g. Sara Mohammed" },
  checkoutPhone: { ar: "رقم الجوال", en: "Mobile number" },
  checkoutPhoneHint: {
    ar: "أدخل رقم جوال أو هاتف صحيح للتواصل وتأكيد الطلب",
    en: "Enter a valid mobile number for confirmation",
  },
  checkoutSubmit: { ar: "تأكيد الطلب بالدفع عند الاستلام", en: "Confirm order — cash on delivery" },
  checkoutSubmitting: { ar: "جارٍ تأكيد الطلب...", en: "Confirming your order..." },
  checkoutTrustNoPay: { ar: "بدون دفع الآن", en: "No payment now" },
  checkoutTrustCall: { ar: "نتصل للتأكيد", en: "We call to confirm" },
  checkoutTrustRefuse: { ar: "ارفض بدون تكلفة", en: "Refuse at no cost" },
  checkoutTerms: {
    ar: "بالمتابعة أنت توافق على الشروط والأحكام وسياسة الخصوصية",
    en: "By continuing you agree to our terms and privacy policy",
  },
  checkoutNameError: { ar: "فضلاً أدخل الاسم الكامل.", en: "Please enter your full name." },
  checkoutPhoneError: { ar: "فضلاً أدخل رقم جوال صحيح.", en: "Please enter a valid mobile number." },
  checkoutNetworkError: {
    ar: "تعذر الاتصال بالخادم. فضلاً تحقق من اتصالك بالإنترنت وحاول مرة أخرى.",
    en: "Could not reach the server. Check your connection and try again.",
  },
  checkoutGenericError: {
    ar: "تعذر تأكيد الطلب الآن. فضلاً حاول مرة أخرى أو تواصل معنا عبر واتساب.",
    en: "Could not confirm your order. Please try again or contact us on WhatsApp.",
  },
  checkoutVerifyError: {
    ar: "تعذر التحقق من موقعك حالياً. فضلاً حاول مرة أخرى بعد قليل.",
    en: "Could not verify your location. Please try again shortly.",
  },
  checkoutVpnError: M(
    "يرجى إيقاف الـ VPN أو البروكسي للمتابعة. نقبل الطلبات فقط من داخل السعودية.",
    "Please turn off VPN or proxy to continue. We only accept orders from within Saudi Arabia.",
    "يرجى إيقاف الـ VPN أو البروكسي للمتابعة. نقبل الطلبات فقط من داخل الإمارات.",
    "Please turn off VPN or proxy to continue. We only accept orders from within the UAE.",
  ),
  checkoutGeoError: M(
    "عذراً، هذه الخدمة متاحة فقط داخل المملكة العربية السعودية.",
    "Sorry, this service is only available within Saudi Arabia.",
    "عذراً، هذه الخدمة متاحة فقط داخل دولة الإمارات العربية المتحدة.",
    "Sorry, this service is only available within the United Arab Emirates.",
  ),
  cartTitle: { ar: "سلة التسوق", en: "Your cart" },
  cartEmpty: { ar: "سلتك فارغة", en: "Your cart is empty" },
  cartEmptyCta: { ar: "تسوقي الآن", en: "Shop now" },
  cartCheckout: { ar: "إتمام الطلب", en: "Checkout" },
  cartSubtotal: { ar: "المجموع", en: "Subtotal" },
  cartCodNote: { ar: "الدفع عند الاستلام · شحن مجاني", en: "Cash on delivery · Free shipping" },
  cartCrossSell: { ar: "قد يعجبك أيضاً", en: "You may also like" },
  trustCodShipping: M(
    "الدفع عند الاستلام • شحن سريع لجميع مناطق المملكة",
    "Cash on delivery • Fast shipping across Saudi Arabia",
    "الدفع عند الاستلام • شحن سريع لجميع إمارات الدولة",
    "Cash on delivery • Fast shipping across the UAE",
  ),
  trustActives: {
    ar: "سيرومات كورية مركّزة • مكونات نشطة بجرعات واضحة",
    en: "Concentrated Korean boosters • Clear active ingredients",
  },
  trustGuarantee: {
    ar: "ضمان 30 يوم • استرجاع كامل عند عدم الرضا",
    en: "30-day guarantee • Full refund if not satisfied",
  },
  footerDescription: M(
    "متجر سعودي متخصص في العناية الكورية الفاخرة — سيرومات مركّزة بمكونات نشطة واضحة، للدفع عند الاستلام داخل المملكة.",
    "A Saudi store for premium Korean skincare — concentrated boosters with clear actives, cash on delivery across Saudi Arabia.",
    "متجر إماراتي متخصص في العناية الكورية الفاخرة — سيرومات مركّزة بمكونات نشطة واضحة، للدفع عند الاستلام داخل الإمارات.",
    "A UAE store for premium Korean skincare — concentrated boosters with clear actives, cash on delivery across the UAE.",
  ),
  footerShippingNote: M(
    "الشحن داخل السعودية فقط",
    "Shipping within Saudi Arabia only",
    "الشحن داخل الإمارات فقط",
    "Shipping within the UAE only",
  ),
  footerCod: { ar: "الدفع عند الاستلام", en: "Cash on delivery" },
  footerProducts: { ar: "السيرومات", en: "Boosters" },
  footerLegal: { ar: "قانوني", en: "Legal" },
  footerSupport: { ar: "الدعم", en: "Support" },
  footerContact: { ar: "تواصل معنا", en: "Contact us" },
  footerWhatsapp: { ar: "واتساب", en: "WhatsApp" },
  footerCopyright: { ar: "جميع الحقوق محفوظة.", en: "All rights reserved." },
  deliveryBadge: M(
    "توصيل داخل السعودية",
    "Delivery in Saudi Arabia",
    "توصيل داخل الإمارات",
    "Delivery in the UAE",
  ),
  homeOrderStep3Desc: M(
    "نوصل الطلب لباب بيتك خلال 2–5 أيام داخل المملكة، ودفعك يكون نقداً أو مدى وقت الاستلام.",
    "We deliver to your door in 2–5 days across Saudi Arabia. Pay cash or card on delivery.",
    "نوصل الطلب لباب بيتك خلال 2–5 أيام داخل الإمارات، ودفعك يكون نقداً أو بطاقة وقت الاستلام.",
    "We deliver to your door in 2–5 days across the UAE. Pay cash or card on delivery.",
  ),
  homeFaqCodAnswer: M(
    "نعم، الدفع عند الاستلام متاح لمعظم مدن المملكة. نؤكد العنوان في مكالمة قبل الشحن.",
    "Yes, cash on delivery is available in most Saudi cities. We confirm your address by phone before shipping.",
    "نعم، الدفع عند الاستلام متاح لمعظم مدن الإمارات. نؤكد العنوان في مكالمة قبل الشحن.",
    "Yes, cash on delivery is available in most UAE cities. We confirm your address by phone before shipping.",
  ),
  homeFaqDeliveryQuestion: M(
    "كم مدة التوصيل داخل السعودية؟",
    "How long is delivery within Saudi Arabia?",
    "كم مدة التوصيل داخل الإمارات؟",
    "How long is delivery within the UAE?",
  ),
  homeFinalCtaDesc: M(
    "ابدئي روتينكِ الكوري اليوم. الدفع عند الاستلام، شحن داخل المملكة، وضمان استرجاع 30 يوم — تجربة بدون مخاطرة.",
    "Start your Korean routine today. Cash on delivery, shipping across Saudi Arabia, and a 30-day guarantee — risk-free.",
    "ابدئي روتينكِ الكوري اليوم. الدفع عند الاستلام، شحن داخل الإمارات، وضمان استرجاع 30 يوم — تجربة بدون مخاطرة.",
    "Start your Korean routine today. Cash on delivery, shipping across the UAE, and a 30-day guarantee — risk-free.",
  ),
  homeTrustShippingBadge: M(
    "شحن داخل المملكة",
    "Shipping in Saudi Arabia",
    "شحن داخل الإمارات",
    "Shipping in the UAE",
  ),
  homeTrustShippingTitle: M(
    "شحن سريع داخل السعودية",
    "Fast shipping in Saudi Arabia",
    "شحن سريع داخل الإمارات",
    "Fast shipping in the UAE",
  ),
  pdpShippingSubtitle: {
    ar: "توصيل سريع لباب بيتك — بدون دفع مقدّم",
    en: "Fast delivery to your door — no upfront payment",
  },
  pdpShippingCitiesLabel: {
    ar: "مدن نخدمها حالياً",
    en: "Cities we currently serve",
  },
  pdpShippingDaysBadge: {
    ar: "2–5 أيام عمل",
    en: "2–5 business days",
  },
  thankYouDeliveryFaqAnswer: M(
    "بعد التأكيد: تجهيز 1–2 يوم عمل، ثم توصيل 2–5 أيام داخل المدن الرئيسية في السعودية.",
    "After confirmation: 1–2 business days to prepare, then 2–5 days delivery in major Saudi cities.",
    "بعد التأكيد: تجهيز 1–2 يوم عمل، ثم توصيل 2–5 أيام داخل المدن الرئيسية في الإمارات.",
    "After confirmation: 1–2 business days to prepare, then 2–5 days delivery in major UAE cities.",
  ),
  thankYouLiveOrderFrom: { ar: "طلب من", en: "Order from" },
  thankYouMinute: { ar: "دقيقة", en: "minute" },
  thankYouMinutes: { ar: "دقائق", en: "minutes" },
  thankYouMinutesAgo: { ar: "قبل", en: "" },
  faqFreeShippingAnswer: M(
    "الشحن مجاني لجميع الطلبات داخل المملكة العربية السعودية.",
    "Free shipping on all orders within Saudi Arabia.",
    "الشحن مجاني لجميع الطلبات داخل الإمارات.",
    "Free shipping on all orders within the UAE.",
  ),
  reviewsLabel: { ar: "تقييم", en: "reviews" },
  reviewsVerified: { ar: "موثّق", en: "verified" },
  verifiedBuyer: { ar: "مشتري مؤكد", en: "verified buyer" },
  yearsOld: { ar: "سنة", en: "y/o" },
  viewProduct: { ar: "عرض المنتج", en: "View product" },
  bundleChooseOffer: { ar: "اختر العرض", en: "Choose offer" },
  bundleChooseOfferHeading: { ar: "اختاري العرض:", en: "Choose your offer:" },
  bundleMostPopular: { ar: "الأكثر اختياراً", en: "Most popular" },
  bundleBestValue: { ar: "الأكثر توفيراً", en: "Best value" },
  bundleFirstBottleNote: { ar: "نتيجة من العبوة الأولى", en: "Results from the first bottle" },
  bundleDetail1: { ar: "30 يوم · عبوة كاملة", en: "30 days · full bottle" },
  bundleDetail2: { ar: "60 يوم · شهر النتيجة + شهر التثبيت", en: "60 days · results + maintenance" },
  bundleDetail3: { ar: "90 يوم · نتيجة + تثبيت + هدية", en: "90 days · results + maintenance + gift" },
  priceFrom: { ar: "من", en: "From" },
  priceWas: { ar: "بدل", en: "Was" },
  codShort: { ar: "دفع عند الاستلام", en: "cash on delivery" },
  perBottle: { ar: "عبوة", en: "bottle" },
  collectionsBadge: { ar: "مجموعة متقن للعناية", en: "Mutqan skincare collection" },
  collectionsTitle: { ar: "اختاري هدف بشرتكِ", en: "Choose your skin goal" },
  collectionsSubtitle: {
    ar: "ثلاثة سيرومات كورية — لإشراقة تلمع، حاجز يُصلَح، وبشرة تشعرين أنها أكثر شباباً.",
    en: "Three Korean boosters — for glow, barrier repair, and skin that feels younger.",
  },
  thankYouHeroTitle: { ar: "تم حجز طلبك بنجاح ✅", en: "Your order is reserved ✅" },
  thankYouHeroDesc: {
    ar: "تبقى خطوة واحدة مهمة: الرد على مكالمة فريق متقن لتأكيد طلبك.",
    en: "One important step left: answer Mutqan's confirmation call.",
  },
  thankYouHeroNoShip: {
    ar: "بدون الرد لا يُشحن الطلب.",
    en: "Without answering, your order won't ship.",
  },
  thankYouCallBadge: {
    ar: "سنتصل بك لتأكيد الطلب — الرد ضروري للشحن",
    en: "We'll call to confirm — answering is required to ship",
  },
  thankYouCallNote: {
    ar: "قد يظهر الرقم «غير معروف» — هذا فريق متقن. أبقِ جوالك متاحاً وأجب المكالمة لنثبت العنوان والكمية ونبدأ التجهيز. لا نطلب أي دفع الآن.",
    en: "The number may show as «unknown» — that's our team. Keep your phone available to confirm address and quantity. No payment is required now.",
  },
  thankYouOrderSummary: { ar: "ملخص الطلب", en: "Order summary" },
  thankYouNoPaymentNow: {
    ar: "الدفع عند الاستلام — لا تدفع شيئًا الآن",
    en: "Cash on delivery — no payment now",
  },
  thankYouPendingDetails: {
    ar: "تم تسجيل طلبك. التفاصيل ستُراجع معك في مكالمة التأكيد.",
    en: "Your order is registered. Details will be confirmed on our call.",
  },
  thankYouTrackLater: { ar: "تتبع الطلب لاحقًا", en: "Track order later" },
  thankYouWhatsappHelp: { ar: "مساعدة عبر واتساب", en: "Help on WhatsApp" },
  thankYouFaqTitle: {
    ar: "أسئلة سريعة قبل الاتصال",
    en: "Quick questions before we call",
  },
  thankYouLiveTitle: {
    ar: "آخر الطلبات المؤكدة اليوم",
    en: "Latest confirmed orders today",
  },
  trackOrderTitle: { ar: "تتبع الطلب", en: "Track order" },
  trackOrderSubtitle: {
    ar: "أدخل رقم الطلب ورقم جوالك لمعرفة حالة طلبك.",
    en: "Enter your order number and mobile to see your order status.",
  },
  trackOrderNumber: { ar: "رقم الطلب", en: "Order number" },
  trackOrderPhone: { ar: "رقم الجوال", en: "Mobile number" },
  trackOrderSubmit: { ar: "تتبع الطلب", en: "Track order" },
  trackOrderLoading: { ar: "جارٍ البحث...", en: "Searching..." },
  trackOrderStatus: { ar: "حالة الطلب", en: "Order status" },
  trackOrderTotal: { ar: "الإجمالي", en: "Total" },
  trackOrderProducts: { ar: "المنتجات", en: "Products" },
  trackOrderSupport: { ar: "تواصل مع الدعم", en: "Contact support" },
  trackOrderPageTitle: { ar: "تتبع طلبك", en: "Track your order" },
  trackOrderFormDesc: {
    ar: "أدخل رقم الطلب ورقم الجوال للتحقق من حالة طلبك.",
    en: "Enter your order number and mobile to check your order status.",
  },
  trackOrderErrorEmpty: { ar: "فضلاً أدخل رقم الطلب.", en: "Please enter your order number." },
  trackOrderErrorPhone: { ar: "فضلاً أدخل رقم جوال صحيح.", en: "Please enter a valid mobile number." },
  trackOrderNotFound: {
    ar: "لم نتمكن من العثور على الطلب. تأكد من رقم الطلب ورقم الجوال.",
    en: "We couldn't find your order. Check the order number and mobile.",
  },
  shippingPolicyTitle: { ar: "سياسة الشحن والتوصيل", en: "Shipping & delivery policy" },
  shippingPolicySubtitle: {
    ar: "نسابق الزمن لنوصل راحتك إلى باب بيتك بأسرع وقت ممكن.",
    en: "We work fast to bring your order to your door.",
  },
  shippingMajorCities: { ar: "المدن الرئيسية", en: "Major cities" },
  shippingDays12: { ar: "يوم إلى يومين عمل", en: "1 to 2 business days" },
  shippingDays25: { ar: "2 إلى 5 أيام عمل", en: "2 to 5 business days" },
  shippingConfirmTitle: { ar: "تأكيد الطلب", en: "Order confirmation" },
  shippingConfirmDesc: {
    ar: "لضمان تقديم أفضل خدمة لك، سيقوم فريق مُتقن بالتواصل معك هاتفياً أو عبر الواتساب لتأكيد طلبك وعنوانك قبل شحنه. لا يتم شحن أي طلب قبل تأكيده.",
    en: "Our team will call or WhatsApp you to confirm your order and address before shipping. No order ships without confirmation.",
  },
  shippingCostTitle: { ar: "تكلفة الشحن", en: "Shipping cost" },
  shippingCostDesc: {
    ar: "نتكفل بكامل مصاريف الشحن لجميع طلباتك. يتم دفع قيمة المنتج فقط عند الاستلام.",
    en: "We cover shipping on all orders. You only pay for the product on delivery.",
  },
  faqPageTitle: { ar: "الأسئلة الشائعة", en: "Frequently asked questions" },
  faqPageSubtitle: {
    ar: "إجابات على أكثر الأسئلة شيوعًا. لم تجد ما تبحث عنه؟ تواصل معنا.",
    en: "Answers to common questions. Can't find what you need? Contact us.",
  },
  faqContactCta: { ar: "لم تجد إجابة على سؤالك؟", en: "Didn't find your answer?" },
  faqWhatsapp: { ar: "تواصل معنا عبر واتساب", en: "Contact us on WhatsApp" },
  termsPageTitle: { ar: "الشروط والأحكام", en: "Terms & conditions" },
  orderSectionTitle: { ar: "الطلب والشراء", en: "Ordering" },
  paymentSectionTitle: { ar: "الدفع", en: "Payment" },
  deliverySectionTitle: { ar: "التوصيل", en: "Delivery" },
  returnsSectionTitle: { ar: "الإرجاع والاستبدال", en: "Returns & exchanges" },
  otherRegionsSa: { ar: "باقي مدن المملكة", en: "Other Saudi cities" },
  otherRegionsAe: { ar: "باقي إمارات الدولة", en: "Other emirates" },
} as const;

export type UiKey = keyof typeof UI;

export function tUi(key: UiKey, locale: StoreLocale, market: MarketId): string {
  const entry = UI[key];
  if ("SA" in entry) {
    return entry[market][locale];
  }
  return entry[locale];
}

export function formatStoreMoney(
  amount: number,
  locale: StoreLocale,
  market: MarketId,
): string {
  const cfg = getMarketConfig(market);
  if (locale === "en") {
    return `${cfg.currencySymbolEn} ${formatWesternNumber(amount)}`;
  }
  return `${formatWesternNumber(amount)} ${cfg.currencySymbolAr}`;
}

export function shippingCities(locale: StoreLocale, market: MarketId): string[] {
  const cfg = getMarketConfig(market);
  return [...(locale === "en" ? cfg.shippingCitiesEn : cfg.shippingCitiesAr)];
}

export function shippingTitle(locale: StoreLocale, market: MarketId): string {
  const cfg = getMarketConfig(market);
  return locale === "en" ? cfg.shippingTitleEn : cfg.shippingTitleAr;
}

export function shippingNote(locale: StoreLocale, market: MarketId): string {
  const cfg = getMarketConfig(market);
  return locale === "en" ? cfg.shippingNoteEn : cfg.shippingNoteAr;
}

export function shippingAllRegions(locale: StoreLocale, market: MarketId): string {
  const cfg = getMarketConfig(market);
  return locale === "en" ? cfg.shippingAllRegionsEn : cfg.shippingAllRegionsAr;
}

export function deliveryPartners(locale: StoreLocale, market: MarketId): string[] {
  const cfg = getMarketConfig(market);
  return [...(locale === "en" ? cfg.deliveryPartnersEn : cfg.deliveryPartnersAr)];
}

export function formatSavings(
  amount: number,
  locale: StoreLocale,
  market: MarketId,
): string {
  const money = formatStoreMoney(amount, locale, market);
  return locale === "en" ? `Save ${money}` : `وفّري ${money}`;
}
