import type { Metadata } from "next";
import Link from "next/link";
import { StoreImage } from "@/components/ui/StoreImage";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { ProductCard } from "@/components/commerce/ProductCard";
import { ReviewCard } from "@/components/product/ReviewCard";
import { FAQAccordion } from "@/components/product/FAQAccordion";
import { COLLECTIONS } from "@/config/collections";
import { FEATURED_SLUGS, getProductsBySlugs, toProduct } from "@/config/catalog";
import {
  ArrowLeft,
  Star,
  Package,
  CheckCircle2,
  Truck,
  CreditCard,
  ShieldCheck,
  Users,
  Sparkles,
  Heart,
  Phone,
  Clock,
  BadgeCheck,
  Gift,
  Home,
  ChefHat,
  SprayCan,
  UtensilsCrossed,
} from "lucide-react";

export const metadata: Metadata = {
  title: "متقن | حلول عصرية لراحة البيت السعودي",
  description:
    "تسوق منتجات متقن المختارة بعناية لتنظيم المنزل والمطبخ وتجربة يومية أكثر راحة. الدفع عند الاستلام والتوصيل السريع داخل السعودية بضمان ذهبي 30 يوم.",
};

const FEATURED_PRODUCTS = getProductsBySlugs([...FEATURED_SLUGS]).map(toProduct);

const HOMEPAGE_REVIEWS = [
  { name: "نورة المطيري", city: "الرياض", rating: 5, text: "منتجات تبيض الوجه وتوصيل سريع جدًا. فريق متقن تواصل معي قبل الشحن مباشرة. تجربة ممتازة وخدمة عملاء راقية." },
  { name: "سارة العنزي", city: "جدة", rating: 5, text: "درج الخزانة غيّر شكل مطبخي بالكامل، ارتحت من الحوسة. تركيب بدون أدوات وسهل جدًا. أنصح فيه لكل بيت." },
  { name: "هنوف الشهري", city: "الدمام", rating: 5, text: "سخّان المائدة فك أزمة في العزايم! الطعام يبقى دافئ طول الجلسة. الدفع عند الاستلام خلّى الطلب مريح ومضمون." },
];

const HOMEPAGE_FAQ = [
  { question: "كيف يتم الطلب؟", answer: "الطلب أسهل مما تتخيل! اختر المنتج، أدخل اسمك ورقم جوالك فقط بدون تعقيد، وسيتواصل معك فريق متقن لتأكيد الطلب قبل الشحن." },
  { question: "هل الدفع عند الاستلام متاح؟", answer: "نعم وبكل تأكيد! الدفع عند الاستلام هو طريقتنا الأساسية. لا تدفع ولا ريال حتى تستلم طلبك بيدك." },
  { question: "ما هو الضمان الذهبي 30 يوم؟", answer: "نثق بجودة منتجاتنا، لذا نقدم لك ضمان استرجاع أو استبدال لمدة 30 يوماً إذا لم يعجبك المنتج. رضاك هو غايتنا." },
  { question: "كم مدة التوصيل؟", answer: "نسابق الزمن لخدمتك! عادة التوصيل من 2 إلى 5 أيام عمل لجميع مناطق ومدن المملكة العربية السعودية." },
];

export default function HomePage() {
  return (
    <div className="bg-brand-background overflow-x-clip">
      {/* ════════════════════════════════════════════
          1. HERO — Emotional, full-width
      ════════════════════════════════════════════ */}
      <section className="relative pt-8 pb-16 md:pt-16 md:pb-28 page-x">
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-bronze/5 rounded-full -z-10 pointer-events-none" aria-hidden />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-beige/40 rounded-full -z-10 pointer-events-none" aria-hidden />

        <div className="max-w-content mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Text Column */}
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2.5 bg-gradient-to-l from-brand-bronze/15 to-brand-bronze/5 text-brand-bronze rounded-pill px-5 py-2 text-sm font-bold mb-8 border border-brand-bronze/20 shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>الخيار الأول لأكثر من 50,000 عائلة سعودية</span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-brand-espresso leading-[1.35] md:leading-[1.25] mb-6">
                بيت يبيّض الوجه،
                <br />
                <span className="text-brand-bronze">
                  وراحة بال لا تقدر بثمن
                </span>
              </h1>

              <p className="text-base md:text-xl text-brand-muted leading-relaxed mb-8 max-w-lg font-medium">
                نعلم إن الفوضى تسرق وقتك وتخلي يومك أطول مما
                يجب. في مُتقن، صممنا حلول ذكية تخلّيك تنجز
                أقل وتستمتع أكثر.
              </p>

              <Link
                href="/collections"
                className="btn-primary inline-flex items-center justify-center gap-3 w-full sm:w-auto py-4 px-8 text-base md:text-lg font-extrabold shadow-lg mb-8"
              >
                <span>تسوق الآن · الدفع عند الاستلام</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>

              {/* Trust Chips */}
              <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-3">
                {[
                  { icon: ShieldCheck, label: "ضمان 30 يوم" },
                  { icon: CreditCard, label: "الدفع عند الاستلام" },
                  { icon: Phone, label: "تأكيد هاتفي" },
                  { icon: Truck, label: "توصيل سريع" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 text-xs md:text-sm text-brand-espresso font-bold bg-white px-4 py-2.5 rounded-xl shadow-sm border border-brand-border/60"
                  >
                    <item.icon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Column */}
            <div className="order-1 md:order-2 relative mb-8 md:mb-0 isolate pb-14 md:pb-0">
              <div className="aspect-[4/3] md:aspect-square relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <StoreImage
                  src="/images/hero/saudi-family.png"
                  alt="عائلة سعودية سعيدة في بيت مرتب — حلول مُتقن لراحة الجميع"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* no overlay */}
              </div>

              {/* Floating Social Proof */}
              <div className="absolute bottom-0 start-2 md:-bottom-5 md:-start-6 bg-white p-3 md:p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 md:animate-float">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {[1, 2, 3, 4].map((id) => (
                    <div key={id} className="w-9 h-9 rounded-full bg-brand-beige border-2 border-white overflow-hidden relative">
                      <StoreImage src={`/images/customers/customer-${id}.png`} alt="عميل سعيد" fill sizes="36px" className="object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-amber-400 gap-0.5">
                    {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="text-xs font-bold text-brand-espresso mt-1">+50,000 عميل سعيد</p>
                </div>
              </div>

              {/* Floating Guarantee Badge */}
              <div className="absolute top-3 end-3 md:-top-3 md:-end-4 bg-emerald-500 text-white p-2.5 md:p-3 rounded-xl shadow-lg">
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 mx-auto" />
                <p className="text-[9px] md:text-[10px] font-bold mt-0.5 text-center leading-tight">ضمان 30 يوم</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          2. STATS BAR — Dark authority strip
      ════════════════════════════════════════════ */}
      <section className="cv-section py-10 md:py-12 bg-brand-espresso text-white border-y-4 border-brand-bronze/40">
        <div className="max-w-content mx-auto page-x">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 text-center">
            {[
              { value: "+50,000", label: "عائلة سعودية تثق بنا", icon: Users },
              { value: "30 يوم", label: "ضمان ذهبي للاسترجاع", icon: ShieldCheck },
              { value: "100%", label: "دفع آمن عند الاستلام", icon: BadgeCheck },
              { value: "24/7", label: "دعم لخدمتك في أي وقت", icon: Clock },
            ].map((stat) => (
              <div key={stat.value} className="flex flex-col items-center gap-3">
                <stat.icon className="w-6 h-6 text-brand-bronze/70" />
                <div className="text-3xl md:text-4xl font-extrabold text-brand-bronze tracking-tight">
                  {stat.value}
                </div>
                <p className="text-sm font-medium text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          3. TRUST BADGES
      ════════════════════════════════════════════ */}
      <section className="cv-section pt-16 md:pt-20 pb-8 page-x">
        <div className="max-w-content mx-auto">
          <TrustBadges />
        </div>
      </section>

      {/* ════════════════════════════════════════════
          4. FEATURED PRODUCTS
      ════════════════════════════════════════════ */}
      <section className="cv-section section-pad page-x bg-white">
        <div className="max-w-content mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-brand-bronze font-bold text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              <span>حلول مُختارة بعناية</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-brand-espresso mb-5 leading-snug">
              المنتجات الأكثر طلباً هذا الأسبوع
            </h2>
            <p className="text-brand-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              حلول عملية صُممت خصيصاً لتنهي أكثر المشاكل اليومية شيوعاً في
              بيوتنا — جرّبها وشوف الفرق بنفسك.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/collections"
              className="btn-secondary inline-flex items-center gap-3 px-10 py-4.5 font-extrabold text-lg hover:bg-brand-espresso hover:text-white transition-all duration-300 border-2 shadow-sm hover:shadow-lg"
            >
              <span>تصفح جميع الحلول</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          5. WHY MUTQAN — Value propositions
      ════════════════════════════════════════════ */}
      <section className="cv-section section-pad page-x bg-brand-surface relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-brand-bronze/5 rounded-full -z-10 pointer-events-none" aria-hidden />
        <div className="max-w-content mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-brand-bronze font-bold text-sm mb-4">
              <Heart className="w-4 h-4" />
              <span>ليش عائلات كثيرة تختارنا؟</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-brand-espresso mb-5 leading-snug">
              لماذا مُتقن هو اختيارك الأول؟
            </h2>
            <p className="text-brand-muted text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              لأننا نفهم بيتك ونحس بتعبك — كل خطوة مصممة لراحتك.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
            {[
              {
                icon: Package,
                title: "مختار بعناية لبيوتنا",
                desc: "كل منتج في مُتقن تم اختياره وتجربته مسبقاً — لا نعرض إلا ما يحل مشكلة حقيقية في حياتك اليومية.",
                accent: "from-brand-bronze/20 to-brand-bronze/5",
              },
              {
                icon: ShieldCheck,
                title: "الضمان الذهبي 30 يوم",
                desc: "حقك محفوظ بالكامل! استرجاع واستبدال مجاني إذا لم يحقق المنتج توقعاتك. بدون أسئلة.",
                accent: "from-emerald-500/20 to-emerald-500/5",
              },
              {
                icon: Star,
                title: "طلب في 10 ثوانٍ فقط",
                desc: "لا تسجيل، لا بطاقات بنكية، ولا أي تعقيد. اسمك وجوالك فقط، ونحن نتولى كل شيء.",
                accent: "from-amber-400/20 to-amber-400/5",
              },
              {
                icon: Users,
                title: "معك خطوة بخطوة",
                desc: "فريق سعودي يتواصل معك قبل الشحن، يتابع الطلب معك، ويتأكد إنك راضٍ تماماً.",
                accent: "from-brand-bronze/20 to-brand-bronze/5",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card card-lift bg-white rounded-2xl p-8 md:p-9 text-center group"
              >
                <div
                  className={`w-18 h-18 rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center mx-auto mb-7 group-hover:scale-110 transition-transform duration-300`}
                >
                  <item.icon className="w-9 h-9 text-brand-bronze" />
                </div>
                <h3 className="font-extrabold text-brand-espresso mb-3.5 text-xl leading-snug">
                  {item.title}
                </h3>
                <p className="text-base text-brand-muted leading-[1.8]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          6. COLLECTIONS — Browse by category
      ════════════════════════════════════════════ */}
      <section className="cv-section section-pad page-x bg-white">
        <div className="max-w-content mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-brand-bronze font-bold text-sm mb-4">
              <Gift className="w-4 h-4" />
              <span>تصفح حسب احتياجك</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-brand-espresso mb-5 leading-snug">
              تصفح حسب ما يحتاجه بيتك
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { slug: "home-organization", nameAr: "تنظيم المنزل", icon: Home, color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
              { slug: "modern-kitchen", nameAr: "المطبخ العصري", icon: ChefHat, color: "from-amber-500 to-orange-500", bg: "bg-amber-50" },
              { slug: "cleaning-care", nameAr: "العناية والنظافة", icon: SprayCan, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50" },
              { slug: "dining-hosting", nameAr: "جلسات وضيافة", icon: UtensilsCrossed, color: "from-purple-500 to-violet-500", bg: "bg-purple-50" },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/collections/${cat.slug}`}
                className="group card-lift bg-white rounded-2xl p-5 md:p-7 text-center border border-gray-100 relative overflow-hidden"
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="font-bold text-sm md:text-base text-gray-900 group-hover:text-[#1B4DDB] transition-colors">
                  {cat.nameAr}
                </h3>
                <div className="mt-2 text-[#1B4DDB] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <span>تصفح</span>
                  <ArrowLeft className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          7. HOW COD WORKS — Dark, 4 steps
      ════════════════════════════════════════════ */}
      <section className="cv-section section-pad page-x bg-brand-espresso text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(27,77,219,0.08),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(27,77,219,0.06),transparent_60%)]" />

        <div className="max-w-content mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-brand-bronze font-bold text-sm mb-4">
              <CreditCard className="w-4 h-4" />
              <span>بدون مجازفة مالية</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-white mb-5 leading-snug">
              كيف تطلب من مُتقن؟
            </h2>
            <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              4 خطوات بسيطة وعملية — لا تدفع ولا ريال إلا وطلبك بيدك!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {[
              {
                num: "١",
                step: "اختر ما يناسبك",
                desc: "تصفح المنتجات واختر الباقة الأنسب لبيتك وميزانيتك",
              },
              {
                num: "٢",
                step: "اسمك وجوالك فقط",
                desc: "بدون بطاقة بنكية ولا حساب — اطلب في ثوانٍ معدودة",
              },
              {
                num: "٣",
                step: "نتواصل معك للتأكيد",
                desc: "فريقنا يتصل بك لتأكيد الطلب والتفاصيل قبل الشحن",
              },
              {
                num: "٤",
                step: "استلم ثم ادفع",
                desc: "المندوب يسلمك الطلب ليدك، وعندها فقط تدفع",
              },
            ].map((item, index) => (
              <div key={item.num} className="text-center group relative">
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-0 w-full h-[2px] bg-gradient-to-l from-brand-bronze/30 to-transparent -z-10" />
                )}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-brand-bronze to-brand-bronze/80 text-white font-extrabold text-2xl md:text-3xl flex items-center justify-center mx-auto mb-7 shadow-xl shadow-brand-bronze/20 group-hover:scale-110 transition-transform duration-300">
                  {item.num}
                </div>
                <h3 className="font-extrabold text-white text-lg md:text-xl mb-3">
                  {item.step}
                </h3>
                <p className="text-sm md:text-base text-white/60 leading-[1.8] font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/collections"
              className="btn-primary inline-flex items-center gap-3 px-10 py-4.5 text-lg font-extrabold"
            >
              <span>ابدأ تجربتك الآن</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          8. REVIEWS — Social proof
      ════════════════════════════════════════════ */}
      <section className="cv-section section-pad page-x bg-brand-surface relative overflow-hidden">
        <div className="absolute top-10 right-10 w-[200px] h-[200px] bg-amber-400/5 rounded-full -z-10 pointer-events-none" aria-hidden />
        <div className="max-w-content mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-amber-500 font-bold text-sm mb-4">
              <Star className="w-4 h-4 fill-current" />
              <span>تجارب حقيقية</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-brand-espresso mb-5 leading-snug">
              تجارب حقيقية من قلوب سعودية
            </h2>
            <p className="text-brand-muted text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              آراء عملائنا هي أكبر فخر لنا — وأصدق دليل على أن مُتقن خيار يستاهل ثقتك.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {HOMEPAGE_REVIEWS.map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-brand-muted font-bold text-base">
              +50,000 عائلة سعودية اختارت مُتقن — انضم لهم اليوم
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          9. FAQ
      ════════════════════════════════════════════ */}
      <section className="cv-section section-pad page-x bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-brand-bronze font-bold text-sm mb-4">
              <CheckCircle2 className="w-4 h-4" />
              <span>نجاوب بكل شفافية</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-espresso mb-5 leading-snug">
              أسئلتك المتكررة
            </h2>
            <p className="text-brand-muted text-lg max-w-xl mx-auto leading-relaxed">
              كل ما تحتاج معرفته قبل أول طلب — بدون تعقيد.
            </p>
          </div>
          <FAQAccordion items={HOMEPAGE_FAQ} />
        </div>
      </section>

      {/* ════════════════════════════════════════════
          10. FINAL CTA — Urgency + reassurance
      ════════════════════════════════════════════ */}
      <section className="cv-section section-pad page-x bg-gradient-to-b from-brand-beige to-brand-background">
        <div className="max-w-content mx-auto text-center bg-white rounded-[2rem] p-10 md:p-16 lg:p-20 shadow-2xl border border-brand-bronze/15 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-l from-brand-bronze via-brand-bronze/60 to-transparent" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-bronze/5 rounded-full pointer-events-none" aria-hidden />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/5 rounded-full pointer-events-none" aria-hidden />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-full bg-brand-bronze/10 flex items-center justify-center mx-auto mb-8">
              <Heart className="w-8 h-8 text-brand-bronze" />
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-espresso mb-6 leading-snug">
              لا تؤجل راحة بيتك للغد!
            </h2>

            <p className="text-brand-muted text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-[1.8]">
              انضم لعشرات الآلاف من العائلات السعودية التي حوّلت بيوتها
              للأفضل مع مُتقن. اطلب اليوم بدون أي مجازفة — الدفع عند
              الاستلام مع ضمان ذهبي 30 يوم.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                href="/collections"
                className="btn-primary inline-flex items-center justify-center gap-3 px-12 py-5 text-lg font-extrabold shadow-xl"
              >
                <span>تسوق وابدأ الترتيب</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 mt-10 text-sm text-brand-muted font-bold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                ضمان 30 يوم
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                الدفع عند الاستلام
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-500" />
                توصيل سريع
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
