export interface ProductBundle {
  id: string;
  label_ar: string;
  quantity: number;
  price_sar: number;
  compare_at_price_sar?: number;
  savings_label_ar?: string;
  is_default: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  slug: string;
  name_ar: string;
  name_en?: string;
  short_description_ar: string;
  positioning?: string;
  category_slug: string;
  bundles: ProductBundle[];
}

export interface CartItem {
  productSlug: string;
  productNameAr: string;
  bundleId: string;
  bundleLabelAr: string;
  quantity: number;
  priceSar: number;
  itemType: "main" | "cross_sell";
}

export interface TrackingData {
  client_event_id?: string;
  landing_page?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  meta_fbp?: string;
  meta_fbc?: string;
  tiktok_click_id?: string;
  snapchat_click_id?: string;
  user_agent?: string;
}

export interface OrderSummary {
  id: string;
  public_order_number: string;
  status: string;
  subtotal_sar: number;
  discount_sar: number;
  shipping_sar: number;
  total_sar: number;
  currency: string;
}

export interface UpsellOffer {
  offer_id: string;
  product_slug: string;
  name_ar: string;
  offered_price_sar: number;
  expires_in_seconds: number;
}

export interface CreateOrderResponse {
  order: OrderSummary;
  customer: { phone_e164: string };
  order_slugs?: string[];
  upsell?: UpsellOffer;
}

export interface Review {
  name: string;
  city: string;
  rating: number;
  text: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface MutqanAnalyticsEvent {
  eventId: string;
  eventName: string;
  value?: number;
  currency?: "SAR" | "AED";
  productSlug?: string;
  productName?: string;
  bundleId?: string;
  quantity?: number;
  orderNumber?: string;
  contents?: Array<{ id: string; quantity: number; item_price: number }>;
}
