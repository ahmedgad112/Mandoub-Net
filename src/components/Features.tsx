import { useSite } from "@/store/siteStore";
import { Reveal } from "./Reveal";
import { Icons, SectionHeader } from "./ui";

export function Features() {
  const { features } = useSite();
  return (
    <section id="features" className="relative scroll-mt-28 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            tone="light"
            eyebrow="خدماتنا"
            title={
              <>
                كل ما تحتاجه من <span className="text-brand-600">أول استفسار</span> حتى الاتصال
              </>
            }
            description="نقارن الباقات، نتحقق من التغطية، نقدّم الطلب، ونتابع التركيب — بدون رسوم خدمة عليك."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = Icons[f.icon as keyof typeof Icons];
            return (
              <Reveal key={f.title} delay={i * 70}>
                <article className="group h-full rounded-[1.5rem] border border-slate-200 bg-slate-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400 hover:bg-white hover:shadow-lg">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink-text">{f.title}</h3>
                  <p className="mt-3 text-sm leading-[1.9] text-slate-600">{f.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
