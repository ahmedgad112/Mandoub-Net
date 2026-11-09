import { useState } from "react";
import { cn } from "@/utils/cn";
import { useSite, useWhatsApp } from "@/store/siteStore";
import { Reveal } from "./Reveal";
import { ButtonLink, Icons, SectionHeader } from "./ui";

export function FAQ() {
  const { faqs } = useSite();
  const { link: WHATSAPP_LINK } = useWhatsApp();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-28 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal direction="right">
              <SectionHeader
                tone="light"
                align="left"
                eyebrow="الأسئلة الشائعة"
                title={
                  <>
                    أسئلتك، <span className="text-brand-600">بإجابات واضحة</span>
                  </>
                }
                description="لسه متردد؟ مندوبنا يرد خلال دقائق على واتساب."
              />
            </Reveal>
            <Reveal direction="right" delay={120} className="mt-8">
              <ButtonLink href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <Icons.WhatsApp className="h-4 w-4" />
                اسألنا أي شيء
              </ButtonLink>
            </Reveal>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={f.q} delay={i * 50}>
                  <div
                    className={cn(
                      "rounded-2xl border transition-all duration-300",
                      isOpen ? "border-brand-400 bg-brand-50/60 shadow-sm" : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    )}
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-button-${i}`}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start cursor-pointer sm:px-6 sm:py-5"
                      >
                        <span className="font-display text-[15px] font-bold text-ink-text sm:text-base">{f.q}</span>
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                            isOpen ? "rotate-45 bg-brand-500 text-ink-950" : "bg-white text-slate-500 border border-slate-200"
                          )}
                        >
                          <Icons.Plus className="h-4 w-4" />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-button-${i}`}
                      className={cn(
                        "grid transition-all duration-400",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm leading-[1.9] text-slate-600 sm:px-6 sm:pb-6 sm:text-[15px]">{f.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
