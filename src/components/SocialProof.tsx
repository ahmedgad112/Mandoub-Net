import { providerNames, type Provider } from "@/data/content";
import { useSite } from "@/store/siteStore";
import { useCountUp } from "@/hooks/useCountUp";
import { Reveal } from "./Reveal";
import { ProviderMark } from "./ui";

const marqueeItems: { name: Provider; tag: string }[] = [
  { name: "STC", tag: "فايبر و 5G" },
  { name: "Zain", tag: "فايبر و 5G" },
  { name: "Mobily", tag: "فايبر و 5G" },
  { name: "Salam", tag: "فايبر و 5G" },
];

function Stat({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const { value: n, ref } = useCountUp(value, 1800);
  return (
    <Reveal delay={delay} className="text-center">
      <p ref={ref as React.RefObject<HTMLParagraphElement>} className="ltr font-display text-4xl font-extrabold text-ink-text sm:text-5xl tabular-nums">
        {n.toLocaleString("en-US")}
        <span className="text-brand-600">{suffix}</span>
      </p>
      <p className="mt-2 text-sm text-slate-500">{label}</p>
    </Reveal>
  );
}

export function SocialProof() {
  const { stats } = useSite();
  return (
    <section aria-label="المزودون الموثوقون والنتائج" className="relative border-y border-slate-100 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-center text-xs font-bold text-slate-500">
            شريك معتمد لتقديم الاشتراكات لدى أبرز مزودي الخدمة في المملكة
          </p>
        </Reveal>

        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max gap-4 animate-marquee hover:[animation-play-state:paused]">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3"
              >
                <ProviderMark name={p.name} />
                <div>
                  <p className="font-display text-sm font-bold text-ink-text">{providerNames[p.name]}</p>
                  <p className="text-[11px] text-slate-500">{p.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-8 border-t border-slate-100 pt-12 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Stat key={s.label} {...s} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
