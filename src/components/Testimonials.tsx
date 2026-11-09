import { providerNames, type Provider } from "@/data/content";
import { useSite } from "@/store/siteStore";
import { Reveal } from "./Reveal";
import { Icons, ProviderMark, SectionHeader } from "./ui";

export function Testimonials() {
  const { testimonials } = useSite();

  return (
    <section id="testimonials" className="relative scroll-mt-28 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            tone="light"
            eyebrow="آراء العملاء"
            title={
              <>
                آلاف المنازل. <span className="text-brand-600">ونفس الشعور:</span> الراحة.
              </>
            }
            description="عملاء حقيقيون من الرياض وجدة والمنطقة الشرقية اتصلوا بالإنترنت بدون صداع."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 70}>
              <article className="relative flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 transition-all hover:-translate-y-1 hover:border-brand-400 hover:bg-white hover:shadow-lg">
                <div className="flex gap-0.5 text-amber-400" aria-label={`تقييم ${t.rating} من 5`}>
                  {Array.from({ length: t.rating }).map((_, k) => (
                    <Icons.Star key={k} className="h-4 w-4" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[15px] leading-[1.9] text-slate-700">«{t.text}»</blockquote>
                <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-display text-sm font-bold text-ink-950">
                      {t.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink-text">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 ps-1 pe-2.5 text-[11px] font-semibold text-slate-600">
                    <ProviderMark name={t.provider} size="sm" className="h-5 w-5 rounded-md text-[8px]" />
                    {providerNames[t.provider as Provider]}
                  </div>
                </figcaption>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
