import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { patch, useSite } from "@/store/siteStore";
import { buildSchema } from "@/components/SEOHead";
import { Btn, Card, Field, Grid, Input, Textarea, Toggle } from "../ui";

type Check = { ok: boolean; warn?: boolean; label: string; tip?: string };

function useSeoChecks() {
  const s = useSite();
  const { seo, faqs } = s;
  return useMemo<Check[]>(() => {
    const t = seo.title.length;
    const d = seo.description.length;
    return [
      { ok: t >= 30 && t <= 65, warn: t > 0 && (t < 30 || t > 65), label: "طول عنوان الصفحة (30–65 حرفًا)", tip: `الحالي: ${t}` },
      { ok: d >= 100 && d <= 165, warn: d > 0 && (d < 100 || d > 165), label: "طول الوصف (100–165 حرفًا)", tip: `الحالي: ${d}` },
      { ok: /5G|فايبر|إنترنت|انترنت/i.test(seo.title), label: "العنوان يحتوي كلمة مفتاحية رئيسية" },
      { ok: seo.keywords.split(",").filter(Boolean).length >= 5, label: "5 كلمات مفتاحية على الأقل" },
      { ok: /^https:\/\//.test(seo.canonical), label: "رابط canonical صحيح يبدأ بـ https" },
      { ok: /^https:\/\//.test(seo.siteUrl), label: "رابط الموقع الأساسي محدد" },
      { ok: !!seo.ogImage, label: "صورة المشاركة الاجتماعية (OG Image) محددة" },
      { ok: !!seo.ogTitle && !!seo.ogDescription, label: "عنوان ووصف المشاركة الاجتماعية" },
      { ok: seo.robotsIndex, label: "الصفحة قابلة للفهرسة (index)", tip: !seo.robotsIndex ? "⚠️ الموقع مخفي عن جوجل!" : undefined },
      { ok: seo.schemaEnabled, label: "بيانات LocalBusiness المنظّمة مفعّلة" },
      { ok: seo.faqSchemaEnabled && faqs.length >= 3, label: "FAQ Schema مفعّل مع 3 أسئلة على الأقل" },
      { ok: !!seo.gaId || !!seo.gtmId, warn: true, label: "تتبّع التحليلات (GA4 أو GTM)", tip: "اختياري لكنه مهم لقياس التحويلات" },
      { ok: !!seo.googleVerification, warn: true, label: "التحقق من Google Search Console", tip: "اختياري" },
    ];
  }, [seo, faqs]);
}

export function seoScore(checks: Check[]) {
  const weighted = checks.filter((c) => !(c.warn && !c.ok && c.tip?.includes("اختياري")));
  const total = weighted.length;
  const passed = weighted.filter((c) => c.ok).length;
  return Math.round((passed / total) * 100);
}

export function SEOScoreRing({ score, size = 112 }: { score: number; size?: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const color = score >= 80 ? "#84cc16" : score >= 55 ? "#fbbf24" : "#fb7185";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="ltr h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} className="transition-[stroke-dashoffset] duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="ltr font-display text-2xl font-extrabold text-ink-text">{score}</span>
        <span className="text-[10px] text-slate-500">من 100</span>
      </div>
    </div>
  );
}

export function SEOPanel() {
  const s = useSite();
  const { seo } = s;
  const set = (p: Partial<typeof seo>) => patch("seo", p);
  const checks = useSeoChecks();
  const score = seoScore(checks);
  const [tab, setTab] = useState<"google" | "social">("google");
  const [copied, setCopied] = useState("");

  const schema = buildSchema(s);
  const host = seo.siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const robotsTxt = `User-agent: *\n${seo.robotsIndex ? "Allow: /" : "Disallow: /"}\nDisallow: /#/admin\n\nSitemap: ${seo.siteUrl.replace(/\/$/, "")}/sitemap.xml`;
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${seo.canonical || seo.siteUrl}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>`;

  const copy = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="space-y-5">
      {/* Score */}
      <Card>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <SEOScoreRing score={score} />
          <div className="flex-1">
            <h2 className="font-display text-lg font-bold text-white">
              تقييم SEO: {score >= 80 ? "ممتاز 🎉" : score >= 55 ? "جيد — يمكن التحسين" : "يحتاج عملًا"}
            </h2>
            <p className="mt-1 text-xs text-slate-400">يتحدّث التقييم مباشرة مع كل تعديل. النقاط الاختيارية لا تخصم من الدرجة.</p>
            <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
              {checks.map((c) => (
                <li key={c.label} className="flex items-start gap-2 text-xs">
                  <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]", c.ok ? "bg-brand-400/20 text-brand-300" : c.warn ? "bg-amber-400/20 text-amber-300" : "bg-rose-400/20 text-rose-300")}>
                    {c.ok ? "✓" : c.warn ? "!" : "✕"}
                  </span>
                  <span className={c.ok ? "text-slate-300" : "text-slate-400"}>
                    {c.label}
                    {c.tip && <span className="ms-1 text-slate-500">({c.tip})</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Basic meta */}
      <Card title="الوسوم الأساسية (Meta Tags)" description="تظهر في نتائج بحث جوجل وتبويب المتصفح.">
        <div className="space-y-4">
          <Field label="عنوان الصفحة (Title)" counter={{ value: seo.title.length, min: 30, max: 65 }}>
            <Input value={seo.title} onChange={(e) => set({ title: e.target.value })} />
          </Field>
          <Field label="الوصف (Meta Description)" counter={{ value: seo.description.length, min: 100, max: 165 }}>
            <Textarea value={seo.description} onChange={(e) => set({ description: e.target.value })} />
          </Field>
          <Field label="الكلمات المفتاحية (مفصولة بفاصلة)" hint="تأثيرها محدود في جوجل لكنها مفيدة لمحركات أخرى ولتنظيم المحتوى.">
            <Input value={seo.keywords} onChange={(e) => set({ keywords: e.target.value })} />
          </Field>
          <Grid>
            <Field label="رابط الموقع الأساسي" hint="بدون شرطة مائلة في النهاية"><Input dir="ltr" value={seo.siteUrl} onChange={(e) => set({ siteUrl: e.target.value })} /></Field>
            <Field label="Canonical URL"><Input dir="ltr" value={seo.canonical} onChange={(e) => set({ canonical: e.target.value })} /></Field>
          </Grid>
          <Grid>
            <Toggle checked={seo.robotsIndex} onChange={(v) => set({ robotsIndex: v })} label="السماح بالفهرسة (index)" description="عطّله فقط أثناء التطوير" />
            <Toggle checked={seo.robotsFollow} onChange={(v) => set({ robotsFollow: v })} label="تتبّع الروابط (follow)" />
          </Grid>
        </div>
      </Card>

      {/* Previews */}
      <Card
        title="معاينة الظهور"
        actions={
          <div className="glass inline-flex rounded-xl p-1">
            {(["google", "social"] as const).map((k) => (
              <button key={k} onClick={() => setTab(k)} className={cn("rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer", tab === k ? "bg-brand-400 text-ink-950" : "text-slate-300 hover:text-white")}>
                {k === "google" ? "نتائج جوجل" : "واتساب / تويتر"}
              </button>
            ))}
          </div>
        }
      >
        {tab === "google" ? (
          <div className="rounded-xl bg-white p-5 text-start" dir="rtl">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-cyan-400 text-[10px] font-bold text-white">م</span>
              <div className="leading-tight">
                <p className="text-sm text-[#202124]">{seo.businessName}</p>
                <p className="ltr text-xs text-[#4d5156]">{host} ›</p>
              </div>
            </div>
            <p className="mt-2 cursor-pointer font-display text-xl text-[#1a0dab] hover:underline" style={{ fontFamily: "Arial, sans-serif" }}>
              {seo.title.slice(0, 65)}{seo.title.length > 65 && "…"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#4d5156]">
              {seo.description.slice(0, 165)}{seo.description.length > 165 && "…"}
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-white/10 bg-ink-800">
            {seo.ogImage && <img src={seo.ogImage} alt="" className="aspect-[1.91/1] w-full object-cover" />}
            <div className="p-4">
              <p className="ltr text-[11px] uppercase text-slate-500">{host}</p>
              <p className="mt-1 font-semibold text-white">{seo.ogTitle || seo.title}</p>
              <p className="mt-1 text-sm text-slate-400 line-clamp-2">{seo.ogDescription || seo.description}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Social */}
      <Card title="المشاركة الاجتماعية (Open Graph / Twitter)" description="يظهر عند مشاركة الرابط في واتساب وتويتر وفيسبوك.">
        <div className="space-y-4">
          <Field label="عنوان المشاركة"><Input value={seo.ogTitle} onChange={(e) => set({ ogTitle: e.target.value })} /></Field>
          <Field label="وصف المشاركة" counter={{ value: seo.ogDescription.length, max: 200 }}><Textarea value={seo.ogDescription} onChange={(e) => set({ ogDescription: e.target.value })} /></Field>
          <Grid cols={3}>
            <Field label="صورة المشاركة" hint="المقاس الموصى به 1200×630"><Input dir="ltr" value={seo.ogImage} onChange={(e) => set({ ogImage: e.target.value })} /></Field>
            <Field label="حساب تويتر/X"><Input dir="ltr" value={seo.twitterHandle} onChange={(e) => set({ twitterHandle: e.target.value })} /></Field>
            <Field label="اللغة والمنطقة"><Input dir="ltr" value={seo.locale} onChange={(e) => set({ locale: e.target.value })} /></Field>
          </Grid>
        </div>
      </Card>

      {/* Structured data */}
      <Card title="البيانات المنظّمة (Schema.org)" description="تساعد جوجل على فهم نشاطك وإظهار نتائج غنية (أسئلة شائعة، معلومات النشاط).">
        <div className="space-y-4">
          <Grid>
            <Toggle checked={seo.schemaEnabled} onChange={(v) => set({ schemaEnabled: v })} label="LocalBusiness + WebSite" />
            <Toggle checked={seo.faqSchemaEnabled} onChange={(v) => set({ faqSchemaEnabled: v })} label="FAQPage (من الأسئلة الشائعة)" />
          </Grid>
          <Grid cols={3}>
            <Field label="اسم النشاط"><Input value={seo.businessName} onChange={(e) => set({ businessName: e.target.value })} /></Field>
            <Field label="المدينة"><Input value={seo.businessCity} onChange={(e) => set({ businessCity: e.target.value })} /></Field>
            <Field label="المنطقة"><Input value={seo.businessRegion} onChange={(e) => set({ businessRegion: e.target.value })} /></Field>
          </Grid>
          <Grid>
            <Field label="رمز الدولة"><Input dir="ltr" value={seo.businessCountry} onChange={(e) => set({ businessCountry: e.target.value })} /></Field>
            <Field label="نطاق الأسعار"><Input dir="ltr" value={seo.priceRange} onChange={(e) => set({ priceRange: e.target.value })} /></Field>
          </Grid>
          <details className="group rounded-xl border border-white/10 bg-ink-950/60">
            <summary className="cursor-pointer px-4 py-3 text-xs font-medium text-slate-300">عرض JSON-LD المُولَّد</summary>
            <div className="relative border-t border-white/5">
              <Btn size="sm" className="absolute end-3 top-3" onClick={() => copy("schema", JSON.stringify(schema, null, 2))}>{copied === "schema" ? "تم النسخ ✓" : "نسخ"}</Btn>
              <pre className="ltr max-h-72 overflow-auto p-4 text-[11px] leading-relaxed text-brand-200">{JSON.stringify(schema, null, 2)}</pre>
            </div>
          </details>
        </div>
      </Card>

      {/* Analytics */}
      <Card title="التحليلات والتحقق" description="تُحقن الأكواد تلقائيًا في رأس الصفحة عند تعبئتها.">
        <Grid cols={3}>
          <Field label="Google Analytics 4" hint="G-XXXXXXXXXX"><Input dir="ltr" placeholder="G-XXXXXXXXXX" value={seo.gaId} onChange={(e) => set({ gaId: e.target.value.trim() })} /></Field>
          <Field label="Google Tag Manager" hint="GTM-XXXXXXX"><Input dir="ltr" placeholder="GTM-XXXXXXX" value={seo.gtmId} onChange={(e) => set({ gtmId: e.target.value.trim() })} /></Field>
          <Field label="Search Console Verification" hint="قيمة content فقط"><Input dir="ltr" value={seo.googleVerification} onChange={(e) => set({ googleVerification: e.target.value.trim() })} /></Field>
        </Grid>
        <Field label="وسوم إضافية في <head> (meta/link فقط)" hint="لن تُنفَّذ السكربتات هنا لأسباب أمنية.">
          <Textarea dir="ltr" className="font-mono text-xs" placeholder='<meta name="facebook-domain-verification" content="..." />' value={seo.customHeadHtml} onChange={(e) => set({ customHeadHtml: e.target.value })} />
        </Field>
      </Card>

      {/* Files */}
      <Card title="ملفات robots.txt و sitemap.xml" description="انسخ هذه الملفات وارفعها إلى جذر الاستضافة بجانب index.html.">
        <Grid>
          {[
            ["robots.txt", robotsTxt],
            ["sitemap.xml", sitemapXml],
          ].map(([name, content]) => (
            <div key={name} className="relative rounded-xl border border-white/10 bg-ink-950/60">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                <span className="ltr text-xs font-semibold text-white">{name}</span>
                <Btn size="sm" onClick={() => copy(name, content)}>{copied === name ? "تم النسخ ✓" : "نسخ"}</Btn>
              </div>
              <pre className="ltr overflow-auto p-4 text-[11px] leading-relaxed text-slate-300">{content}</pre>
            </div>
          ))}
        </Grid>
      </Card>
    </div>
  );
}
