import { useState } from "react";
import { cn } from "@/utils/cn";
import { serviceTypes } from "@/data/content";
import { Enter, Reveal } from "./Reveal";
import { ButtonLink, Icons, SectionHeader } from "./ui";

type Key = keyof typeof serviceTypes;

export function Showcase() {
  const [active, setActive] = useState<Key>("5g");
  const s = serviceTypes[active];

  return (
    <section id="showcase" className="relative scroll-mt-28 bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            tone="light"
            eyebrow="5G أم فايبر"
            title={
              <>
                تقنيتان. <span className="text-brand-600">وإجابة واحدة</span> لمنزلك.
              </>
            }
            description="محتار بين اللاسلكي والسلكي؟ قارن بوضوح — ونؤكد لك أيهما يغطي عنوانك."
          />
        </Reveal>

        <Reveal delay={80} className="mt-10 flex justify-center">
          <div role="tablist" aria-label="نوع الخدمة" className="relative inline-flex rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
            <span
              aria-hidden
              className={cn(
                "absolute inset-y-1.5 start-1.5 w-[calc(50%-6px)] rounded-full bg-brand-500 shadow transition-transform duration-500",
                active === "fiber" ? "-translate-x-full" : "translate-x-0"
              )}
            />
            {(Object.keys(serviceTypes) as Key[]).map((k) => {
              const Icon = k === "5g" ? Icons.Router : Icons.Fiber;
              return (
                <button
                  key={k}
                  role="tab"
                  aria-selected={active === k}
                  aria-controls={`panel-${k}`}
                  id={`tab-${k}`}
                  onClick={() => setActive(k)}
                  className={cn(
                    "relative z-10 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors cursor-pointer sm:px-7",
                    active === k ? "text-ink-950" : "text-slate-500 hover:text-ink-900"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {serviceTypes[k].label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={140} className="mt-10">
          <div
            role="tabpanel"
            id={`panel-${active}`}
            aria-labelledby={`tab-${active}`}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
          >
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[480px]">
                {(Object.keys(serviceTypes) as Key[]).map((k) => (
                  <img
                    key={k}
                    src={serviceTypes[k].image}
                    alt={k === "5g" ? "راوتر 5G منزلي" : "ألياف ضوئية منزلية"}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-all duration-700",
                      active === k ? "scale-100 opacity-100" : "scale-105 opacity-0"
                    )}
                    loading="lazy"
                    width={800}
                    height={700}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                <div className="absolute start-5 top-5 inline-flex items-center gap-2 rounded-full bg-brand-500 px-3.5 py-1.5 text-xs font-extrabold text-ink-950">
                  {s.tagline}
                </div>
              </div>

              <div key={`c-${active}`} className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                <Enter as="h3" delay={40} className="font-display text-2xl font-extrabold leading-[1.4] text-ink-text sm:text-3xl">
                  {s.headline}
                </Enter>
                <Enter as="p" delay={100} className="mt-4 leading-[1.9] text-slate-600">
                  {s.description}
                </Enter>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {s.bullets.map((b, i) => (
                    <Enter as="li" key={b} delay={140 + i * 50} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                        <Icons.Check className="h-3 w-3" />
                      </span>
                      {b}
                    </Enter>
                  ))}
                </ul>
                <Enter delay={320} className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href="#pricing">
                    عرض باقات {active === "5g" ? "5G" : "الفايبر"}
                  </ButtonLink>
                  <ButtonLink href="#contact" variant="secondary" className="!border-slate-200 !bg-slate-50 !text-ink-900">
                    تحقق من تغطيتي
                  </ButtonLink>
                </Enter>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
