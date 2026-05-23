import type { Metadata } from "next";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { WhatsAppButton } from "@/components/trust/WhatsAppButton";

export const metadata: Metadata = {
  title: "عن متقن",
  description: "تعرف على متقن - علامة تجارية خليجية متخصصة في حلول تنظيم المنزل العملية والأنيقة.",
};

export default function AboutPage() {
  return (
    <div className="bg-brand-background">
      <section className="bg-brand-espresso py-16 page-x">
        <div className="max-w-content mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-surface mb-4">عن متقن</h1>
          <p className="text-brand-sand/80 max-w-xl mx-auto text-lg">
            تفاصيل عملية ومتقنة تجعل البيت أكثر ترتيبًا وراحة وأناقة.
          </p>
        </div>
      </section>

      <section className="section-pad page-x">
        <div className="max-w-content mx-auto max-w-3xl space-y-8">
          <div className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-brand-espresso mb-4">قصتنا</h2>
            <div className="space-y-4 text-brand-muted leading-relaxed">
              <p>
                متقن علامة تجارية خليجية تأسست بفكرة بسيطة: البيت يستحق منتجات مختارة بعناية تحل مشاكل يومية حقيقية بشكل عملي وأنيق.
              </p>
              <p>
                نحن نؤمن أن كل تفصيلة في البيت تؤثر على راحة أهله. لهذا نختار منتجاتنا بعناية، مع التركيز على الجودة والعملية والتصميم الذي يليق بالبيوت الخليجية الحديثة.
              </p>
              <p>
                من درج الخزانة المنزلق إلى سخّان المائدة الذكي، كل منتج في متقن يحل مشكلة يومية تعيشها أنت وعائلتك.
              </p>
            </div>
          </div>

          <div className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-brand-espresso mb-4">قيمنا</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "الجودة أولًا", desc: "نختار كل منتج بعناية لنضمن أنه يلبي توقعاتك ويدوم معك." },
                { title: "البساطة الذكية", desc: "منتجات عملية وسهلة الاستخدام تُحدث فرقًا ملموسًا في يومك." },
                { title: "الأمانة في التقديم", desc: "نصف منتجاتنا بصدق ووضوح، دون مبالغة أو ادعاءات غير صحيحة." },
                { title: "راحة المشتري", desc: "الدفع عند الاستلام، التأكيد قبل الشحن، ودعم مستمر عبر واتساب." },
              ].map((item) => (
                <div key={item.title} className="bg-brand-background rounded-card-lg p-4">
                  <h3 className="font-bold text-brand-espresso mb-1">{item.title}</h3>
                  <p className="text-sm text-brand-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <TrustBadges />

          <div className="text-center">
            <WhatsAppButton label="تواصل مع فريق متقن" className="text-base px-8 py-3" />
          </div>
        </div>
      </section>
    </div>
  );
}
