import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { providerNames, providers, type Plan, type Provider } from "@/data/content";
import { useSite, waLink } from "@/store/siteStore";
import { Enter, Reveal } from "./Reveal";
import { ButtonLink, Icons, ProviderMark, SectionHeader } from "./ui";

type Key = "5g" | "fiber";

function PlanCard({ plan, type }: { plan: Plan; type: Key }) {
  const { general } = useSite();
  const link = waLink(
    general.whatsappNumber,
    `مرحبًا مندوب نت، أرغب في باقة ${providerNames[plan.provider]} ${plan.name} (${plan.speed}) ${type === "5g" ? "5G" : "فايبر"}. أرجو التحقق من التغطية على عنواني.`
  );

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-[1.75rem] border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        plan.popular ? "border-brand-500 shadow-[0_20px_50px_-24px_rgba(132,204,22,0.55)]" : "border-slate-200"
      )}
    >
      {plan.badge && (
        <span className="absolute -top-3 start-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-[11px] font-extrabold text-ink-950 shadow-md">
          {plan.badge}
        </span>
      )}

      <div className="flex items-center gap-3">
        <ProviderMark name={plan.provider} />
        <div>
          <p className="text-xs font-medium text-slate-500">{providerNames[plan.provider]}</p>
          <h3 className="font-display text-base font-bold text-ink-text">{plan.name}</h3>
        </div>
      </div>

      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="ltr font-display text-4xl font-extrabold text-brand-600 tabular-nums">{plan.price}</span>
        <span className="text-sm font-semibold text-slate-500">ريال</span>
        <span className="text-sm text-slate-400">{plan.period}</span>
      </div>
      <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-ink-800">
        <Icons.Bolt className="h-4 w-4 text-brand-500" />
        {plan.speed}
      </p>

      <ul className="mt-6 flex-1 space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <Icons.Check className="h-3 w-3" />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <ButtonLink href={link} target="_blank" rel="noopener noreferrer" className="mt-7 w-full">
        طلب الباقة
      </ButtonLink>
    </div>
  );
}

export function Pricing() {
  const [type, setType] = useState<Key>("5g");
  const [provider, setProvider] = useState<Provider | "all">("Zain");
  const { plans, general } = useSite();

  const filtered = useMemo(() => {
    const list = plans[type];
    if (provider === "all") return list;
    return list.filter((p) => p.provider === provider);
  }, [plans, type, provider]);

  const inquireLink = waLink(
    general.whatsappNumber,
    provider === "all"
      ? "مرحبًا مندوب نت، أريد الاستفسار عن العروض والباقات المتاحة."
      : `مرحبًا مندوب نت، أريد الاستفسار عن عروض ${providerNames[provider]}.`
  );

  return (
    <section id="pricing" className="relative scroll-mt-28 bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            tone="light"
            eyebrow="العروض والباقات"
            title="اختر الشركة والباقة المناسبة لك"
            description="قارن باقات 5G والفايبر من زين وموبايلي وSTC وسلام، واطلب الباقة المناسبة لمنزلك بضغطة واحدة."
          />
        </Reveal>

        <Reveal delay={80} className="mt-10 flex flex-wrap justify-center gap-2">
          {(["5g", "fiber"] as Key[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setType(k)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all cursor-pointer",
                type === k ? "bg-ink-900 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-brand-400"
              )}
            >
              {k === "5g" ? <Icons.Router className="h-4 w-4" /> : <Icons.Fiber className="h-4 w-4" />}
              {k === "5g" ? "5G منزلي" : "فايبر منزلي"}
            </button>
          ))}
        </Reveal>

        <Reveal delay={120} className="mt-6 flex flex-wrap justify-center gap-2">
          {providers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProvider(p)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all cursor-pointer",
                provider === p
                  ? "border-brand-500 bg-brand-500 text-ink-950 shadow-md shadow-brand-500/25"
                  : "border-slate-200 bg-white text-slate-700 hover:border-brand-400"
              )}
            >
              <ProviderMark name={p} size="sm" className="!h-6 !w-6 !text-[9px] !shadow-none" />
              {providerNames[p]}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setProvider("all")}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-bold transition-all cursor-pointer",
              provider === "all"
                ? "border-brand-500 bg-brand-500 text-ink-950"
                : "border-slate-200 bg-white text-slate-700 hover:border-brand-400"
            )}
          >
            الكل
          </button>
        </Reveal>

        <Reveal delay={160} className="mt-8">
          <div className="flex flex-col items-center justify-between gap-4 rounded-[1.75rem] bg-brand-500 px-6 py-5 text-ink-950 sm:flex-row sm:px-8">
            <div>
              <p className="font-display text-lg font-extrabold sm:text-xl">
                {provider === "all" ? "عروض الإنترنت المنزلية" : `عروض ${providerNames[provider]} المنزلية`}
              </p>
              <p className="mt-1 text-sm font-medium text-ink-900/70">استفسر الآن وسنتحقق من التغطية على عنوانك مجانًا</p>
            </div>
            <ButtonLink href={inquireLink} target="_blank" rel="noopener noreferrer" className="!bg-white !text-ink-900 hover:!bg-ink-50 shrink-0">
              استفسر عن {provider === "all" ? "العروض" : providerNames[provider]}
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div key={`${type}-${provider}`} className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {filtered.length === 0 ? (
              <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">
                لا توجد باقات لهذا الفلتر حاليًا — جرّب شركة أخرى أو تواصل معنا.
              </p>
            ) : (
              filtered.map((p, i) => (
                <Enter key={`${type}-${p.provider}-${p.name}`} delay={i * 70} className="h-full">
                  <PlanCard plan={p} type={type} />
                </Enter>
              ))
            )}
          </div>
        </Reveal>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-[1.9] text-slate-500">
          * الأسعار تقريبية وغير شاملة ضريبة القيمة المضافة، وقد تختلف حسب عروض المزوّد ومدة العقد والموقع.
        </p>
      </div>
    </section>
  );
}
