import { useSite, useWhatsApp } from "@/store/siteStore";
import { Enter } from "./Reveal";
import { ButtonLink, Icons } from "./ui";

export function Hero() {
  const { hero } = useSite();
  const { link: WHATSAPP_LINK } = useWhatsApp();

  return (
    <section id="top" className="relative overflow-hidden hero-surface">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
        <div className="absolute -top-24 left-1/3 h-[420px] w-[420px] rounded-full bg-brand-500/20 blur-[120px] animate-blob" />
        <div className="absolute bottom-0 -right-20 h-[360px] w-[360px] rounded-full bg-brand-400/10 blur-[100px] animate-blob [animation-delay:-8s]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <Enter delay={0}>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/15 px-3.5 py-1.5 text-xs font-bold text-brand-300">
              <Icons.Wifi className="h-3.5 w-3.5" />
              {hero.badge}
            </div>
          </Enter>

          <Enter delay={80} as="h1" className="mt-6 font-display text-[2.35rem] font-extrabold leading-[1.25] text-white sm:text-5xl lg:text-[3.4rem]">
            {hero.titleA}{" "}
            <span className="text-brand-400">{hero.titleHighlight}</span>
            {hero.titleB ? <> {hero.titleB}</> : null}
          </Enter>

          <Enter delay={160} as="p" className="mt-5 max-w-xl text-base leading-[1.9] text-slate-300 sm:text-lg">
            {hero.description}
          </Enter>

          <Enter delay={240} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="#pricing" size="lg" className="group">
              <Icons.Sparkle className="h-5 w-5" />
              {hero.primaryCta}
            </ButtonLink>
            <ButtonLink href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
              <Icons.WhatsApp className="h-5 w-5 text-brand-300" />
              {hero.secondaryCta}
            </ButtonLink>
          </Enter>

          <Enter delay={320} className="mt-10 grid grid-cols-3 gap-3 sm:max-w-md">
            {hero.bullets.filter(Boolean).map((t) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center backdrop-blur">
                <p className="text-xs font-bold text-white sm:text-sm">{t}</p>
              </div>
            ))}
          </Enter>
        </div>

        <Enter delay={180} direction="scale" className="relative mx-auto w-full max-w-[420px]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-ink-800 to-ink-950 p-8 shadow-[0_40px_100px_-30px_rgba(132,204,22,0.35)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(132,204,22,0.25),transparent_55%)]" />
            <div className="relative flex flex-col items-center text-center">
              <span className="rounded-full bg-brand-500 px-4 py-1.5 text-xs font-extrabold text-ink-950">
                عروض الإنترنت المنزلية
              </span>
              <div className="mt-8 flex h-28 w-28 items-center justify-center rounded-full border border-brand-400/30 bg-brand-500/15 text-brand-300 shadow-[0_0_60px_-10px_rgba(132,204,22,0.8)]">
                <Icons.Wifi className="h-14 w-14" />
              </div>
              <p className="mt-8 font-display text-2xl font-extrabold text-white sm:text-3xl">
                أسرع اتصال
                <br />
                لمنزلك
              </p>
              <ButtonLink href="#pricing" size="md" className="mt-8 w-full">
                استعرض الباقات
              </ButtonLink>
            </div>
          </div>
        </Enter>
      </div>
    </section>
  );
}
