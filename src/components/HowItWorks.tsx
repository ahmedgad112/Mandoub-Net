import { useSite, useWhatsApp } from "@/store/siteStore";
import { Reveal } from "./Reveal";
import { ButtonLink, Icons, SectionHeader } from "./ui";

export function HowItWorks() {
  const { steps } = useSite();
  const { link: WHATSAPP_LINK } = useWhatsApp();
  return (
    <section id="how-it-works" className="relative scroll-mt-28 overflow-hidden bg-ink-900 py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-brand-500/15 blur-[120px]" />
        <div className="bg-grid absolute inset-0 opacity-30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            tone="dark"
            eyebrow="طريقة الطلب"
            title={
              <>
                من أول رسالة حتى أول اختبار سرعة في <span className="text-brand-400">أربع خطوات</span>
              </>
            }
            description="ترسل رسالة واتساب واحدة. ونحن نتولى المقارنة والتقديم والمتابعة."
          />
        </Reveal>

        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = Icons[s.icon as keyof typeof Icons];
            return (
              <Reveal key={s.number} as="li" delay={i * 90}>
                <div className="h-full rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:border-brand-400/40 hover:bg-white/[0.08]">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="ltr font-display text-2xl font-extrabold text-white/20">{s.number}</span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-[1.9] text-slate-400">{s.description}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>

        <Reveal delay={200} className="mt-10 flex justify-center">
          <ButtonLink href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" size="lg">
            <Icons.WhatsApp className="h-5 w-5" />
            ابدأ الخطوة الأولى الآن
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
