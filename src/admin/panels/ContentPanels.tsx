import { useRef, useState } from "react";
import { providers, type Plan, type Provider } from "@/data/content";
import { exportSettings, importSettings, patch, resetSettings, useSite, waLink } from "@/store/siteStore";
import { Btn, Card, Field, Grid, Input, ListEditor, Select, StringList, Textarea, Toggle, iconOptions } from "../ui";

/* ---------------- General ---------------- */
export function GeneralPanel() {
  const { general } = useSite();
  const g = (p: Partial<typeof general>) => patch("general", p);
  return (
    <div className="space-y-5">
      <Card title="هوية العلامة" description="الاسم الظاهر في الشعار وعناوين الموقع.">
        <Grid>
          <Field label="الاسم الأساسي"><Input value={general.brandName} onChange={(e) => g({ brandName: e.target.value })} /></Field>
          <Field label="اللاحقة (باللون الأخضر)"><Input value={general.brandSuffix} onChange={(e) => g({ brandSuffix: e.target.value })} /></Field>
        </Grid>
      </Card>

      <Card title="بيانات التواصل" description="تُستخدم في كل أزرار واتساب والتذييل ونموذج الطلب.">
        <Grid>
          <Field label="رقم واتساب (بصيغة دولية بدون +)" hint="مثال: 9665XXXXXXXX">
            <Input dir="ltr" value={general.whatsappNumber} onChange={(e) => g({ whatsappNumber: e.target.value.replace(/[^\d]/g, "") })} />
          </Field>
          <Field label="رقم الهاتف المعروض"><Input dir="ltr" value={general.phone} onChange={(e) => g({ phone: e.target.value })} /></Field>
        </Grid>
        <div className="mt-4 space-y-4">
          <Field label="رسالة واتساب الافتراضية" counter={{ value: general.whatsappGreeting.length, max: 200 }}>
            <Textarea value={general.whatsappGreeting} onChange={(e) => g({ whatsappGreeting: e.target.value })} />
          </Field>
          <Field label="ساعات العمل"><Input value={general.workingHours} onChange={(e) => g({ workingHours: e.target.value })} /></Field>
          <a href={waLink(general.whatsappNumber, general.whatsappGreeting)} target="_blank" rel="noopener noreferrer" className="inline-flex text-xs text-brand-300 hover:underline">
            اختبار رابط واتساب ↗
          </a>
        </div>
      </Card>

      <Card title="شريط الإعلانات" description="شريط أعلى الموقع للعروض المؤقتة.">
        <div className="space-y-4">
          <Toggle checked={general.announcementEnabled} onChange={(v) => g({ announcementEnabled: v })} label="تفعيل شريط الإعلان" />
          <Field label="نص الإعلان"><Input value={general.announcementText} onChange={(e) => g({ announcementText: e.target.value })} /></Field>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Hero ---------------- */
export function HeroPanel() {
  const { hero } = useSite();
  const h = (p: Partial<typeof hero>) => patch("hero", p);
  return (
    <div className="space-y-5">
      <Card title="القسم الرئيسي (Hero)" description="أول ما يراه الزائر — اجعله واضحًا ومقنعًا.">
        <div className="space-y-4">
          <Field label="شارة أعلى العنوان"><Input value={hero.badge} onChange={(e) => h({ badge: e.target.value })} /></Field>
          <Grid cols={3}>
            <Field label="بداية العنوان"><Input value={hero.titleA} onChange={(e) => h({ titleA: e.target.value })} /></Field>
            <Field label="الجزء المميز (متدرّج)"><Input value={hero.titleHighlight} onChange={(e) => h({ titleHighlight: e.target.value })} /></Field>
            <Field label="نهاية العنوان"><Input value={hero.titleB} onChange={(e) => h({ titleB: e.target.value })} /></Field>
          </Grid>
          <Field label="الوصف" counter={{ value: hero.description.length, min: 80, max: 260 }}>
            <Textarea value={hero.description} onChange={(e) => h({ description: e.target.value })} />
          </Field>
          <Grid>
            <Field label="الزر الأساسي"><Input value={hero.primaryCta} onChange={(e) => h({ primaryCta: e.target.value })} /></Field>
            <Field label="الزر الثانوي"><Input value={hero.secondaryCta} onChange={(e) => h({ secondaryCta: e.target.value })} /></Field>
          </Grid>
          <Field label="نقاط الثقة تحت الأزرار">
            <StringList items={hero.bullets} onChange={(bullets) => h({ bullets })} />
          </Field>
        </div>
      </Card>

      <Card title="معاينة مباشرة">
        <div className="rounded-xl border border-white/10 bg-ink-950 p-6">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300">{hero.badge}</span>
          <h3 className="mt-4 font-display text-2xl font-extrabold leading-[1.3] text-white">
            {hero.titleA} <span className="text-gradient">{hero.titleHighlight}</span> {hero.titleB}
          </h3>
          <p className="mt-3 text-sm leading-[1.9] text-slate-400">{hero.description}</p>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Stats / Features / Steps ---------------- */
export function ListsPanel() {
  const s = useSite();
  return (
    <div className="space-y-5">
      <Card title="الإحصائيات" description="الأرقام المتحركة أسفل شريط المزودين.">
        <ListEditor
          items={s.stats}
          onChange={(v) => patch("stats", v)}
          create={() => ({ value: 100, suffix: "+", label: "" })}
          itemTitle={(i) => i.label}
          render={(it, up) => (
            <Grid cols={3}>
              <Field label="الرقم"><Input type="number" dir="ltr" value={it.value} onChange={(e) => up({ value: Number(e.target.value) })} /></Field>
              <Field label="اللاحقة"><Input dir="ltr" value={it.suffix} onChange={(e) => up({ suffix: e.target.value })} /></Field>
              <Field label="الوصف"><Input value={it.label} onChange={(e) => up({ label: e.target.value })} /></Field>
            </Grid>
          )}
        />
      </Card>

      <Card title="المميزات" description="بطاقات «لماذا مندوب نت».">
        <ListEditor
          items={s.features}
          onChange={(v) => patch("features", v)}
          create={() => ({ icon: "Sparkle", title: "", description: "" })}
          itemTitle={(i) => i.title}
          render={(it, up) => (
            <div className="space-y-3">
              <Grid>
                <Field label="العنوان"><Input value={it.title} onChange={(e) => up({ title: e.target.value })} /></Field>
                <Field label="الأيقونة">
                  <Select value={it.icon} onChange={(e) => up({ icon: e.target.value })}>
                    {iconOptions.map((o) => <option key={o} value={o} className="bg-ink-900">{o}</option>)}
                  </Select>
                </Field>
              </Grid>
              <Field label="الوصف"><Textarea value={it.description} onChange={(e) => up({ description: e.target.value })} /></Field>
            </div>
          )}
        />
      </Card>

      <Card title="خطوات العمل" description="قسم «كيف نعمل».">
        <ListEditor
          items={s.steps}
          onChange={(v) => patch("steps", v.map((x, i) => ({ ...x, number: String(i + 1).padStart(2, "0") })))}
          create={() => ({ number: "00", icon: "Sparkle", title: "", description: "" })}
          itemTitle={(i) => i.title}
          render={(it, up) => (
            <div className="space-y-3">
              <Grid>
                <Field label="العنوان"><Input value={it.title} onChange={(e) => up({ title: e.target.value })} /></Field>
                <Field label="الأيقونة">
                  <Select value={it.icon} onChange={(e) => up({ icon: e.target.value })}>
                    {iconOptions.map((o) => <option key={o} value={o} className="bg-ink-900">{o}</option>)}
                  </Select>
                </Field>
              </Grid>
              <Field label="الوصف"><Textarea value={it.description} onChange={(e) => up({ description: e.target.value })} /></Field>
            </div>
          )}
        />
      </Card>
    </div>
  );
}

/* ---------------- Packages ---------------- */
export function PackagesPanel() {
  const { plans } = useSite();
  const [type, setType] = useState<"5g" | "fiber">("fiber");
  const list = plans[type];
  const set = (v: Plan[]) => patch("plans", { ...plans, [type]: v });
  return (
    <div className="space-y-5">
      <Card
        title="الباقات والأسعار"
        description="الأسعار بالريال السعودي. فعّل «الأكثر طلبًا» على باقة واحدة فقط لإبرازها."
        actions={
          <div className="glass inline-flex rounded-xl p-1">
            {(["5g", "fiber"] as const).map((k) => (
              <button key={k} onClick={() => setType(k)} className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${type === k ? "bg-brand-400 text-ink-950" : "text-slate-300 hover:text-white"}`}>
                {k === "5g" ? "5G منزلي" : "فايبر"}
              </button>
            ))}
          </div>
        }
      >
        <ListEditor<Plan>
          items={list}
          onChange={set}
          create={() => ({ provider: "STC" as Provider, name: "", speed: "", price: 0, period: "/شهريًا", features: [""], badge: undefined, popular: false })}
          itemTitle={(p) => `${p.provider} — ${p.name}`}
          addLabel="إضافة باقة"
          render={(p, up) => (
            <div className="space-y-3">
              <Grid cols={3}>
                <Field label="المزوّد">
                  <Select value={p.provider} onChange={(e) => up({ provider: e.target.value as Provider })}>
                    {providers.map((o) => <option key={o} value={o} className="bg-ink-900">{o}</option>)}
                  </Select>
                </Field>
                <Field label="اسم الباقة"><Input value={p.name} onChange={(e) => up({ name: e.target.value })} /></Field>
                <Field label="السرعة"><Input value={p.speed} onChange={(e) => up({ speed: e.target.value })} /></Field>
              </Grid>
              <Grid cols={3}>
                <Field label="السعر (ريال)"><Input type="number" dir="ltr" value={p.price} onChange={(e) => up({ price: Number(e.target.value) })} /></Field>
                <Field label="الفترة"><Input value={p.period} onChange={(e) => up({ period: e.target.value })} /></Field>
                <Field label="شارة (اختياري)"><Input value={p.badge ?? ""} placeholder="الأكثر طلبًا / أفضل قيمة" onChange={(e) => up({ badge: e.target.value || undefined })} /></Field>
              </Grid>
              <Toggle checked={!!p.popular} onChange={(v) => up({ popular: v })} label="إبراز كـ «الأكثر طلبًا»" description="تظهر بإطار متدرّج وزر أساسي" />
              <Field label="مميزات الباقة"><StringList items={p.features} onChange={(features) => up({ features })} /></Field>
            </div>
          )}
        />
      </Card>
    </div>
  );
}

/* ---------------- Testimonials ---------------- */
export function TestimonialsPanel() {
  const { testimonials } = useSite();
  return (
    <Card title="آراء العملاء" description="يُفضَّل 6 آراء لتوازن الشبكة.">
      <ListEditor
        items={testimonials}
        onChange={(v) => patch("testimonials", v)}
        create={() => ({ name: "", role: "", provider: "STC", text: "", rating: 5 })}
        itemTitle={(t) => t.name}
        addLabel="إضافة رأي"
        render={(t, up) => (
          <div className="space-y-3">
            <Grid cols={3}>
              <Field label="الاسم"><Input value={t.name} onChange={(e) => up({ name: e.target.value })} /></Field>
              <Field label="المدينة · الحي"><Input value={t.role} onChange={(e) => up({ role: e.target.value })} /></Field>
              <Field label="المزوّد">
                <Select value={t.provider} onChange={(e) => up({ provider: e.target.value })}>
                  {providers.map((o) => <option key={o} value={o} className="bg-ink-900">{o}</option>)}
                </Select>
              </Field>
            </Grid>
            <Field label="النص" counter={{ value: t.text.length, max: 260 }}><Textarea value={t.text} onChange={(e) => up({ text: e.target.value })} /></Field>
            <Field label="التقييم">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => up({ rating: n })} className={`text-xl transition-transform hover:scale-110 cursor-pointer ${n <= t.rating ? "text-amber-400" : "text-slate-600"}`} aria-label={`${n} نجوم`}>★</button>
                ))}
              </div>
            </Field>
          </div>
        )}
      />
    </Card>
  );
}

/* ---------------- FAQ ---------------- */
export function FAQPanel() {
  const { faqs } = useSite();
  return (
    <Card title="الأسئلة الشائعة" description="تُستخدم أيضًا لتوليد FAQ Schema تلقائيًا لمحركات البحث.">
      <ListEditor
        items={faqs}
        onChange={(v) => patch("faqs", v)}
        create={() => ({ q: "", a: "" })}
        itemTitle={(f) => f.q}
        addLabel="إضافة سؤال"
        render={(f, up) => (
          <div className="space-y-3">
            <Field label="السؤال"><Input value={f.q} onChange={(e) => up({ q: e.target.value })} /></Field>
            <Field label="الإجابة"><Textarea value={f.a} onChange={(e) => up({ a: e.target.value })} /></Field>
          </div>
        )}
      />
    </Card>
  );
}

/* ---------------- Sections ---------------- */
export function SectionsPanel() {
  const { sections } = useSite();
  const labels: Record<keyof typeof sections, [string, string]> = {
    socialProof: ["شريط المزودين والإحصائيات", "الثقة الاجتماعية أسفل الهيرو"],
    features: ["المميزات", "لماذا مندوب نت"],
    showcase: ["مقارنة 5G والفايبر", "التبويبات مع الصور"],
    howItWorks: ["كيف نعمل", "الخطوات الأربع"],
    testimonials: ["آراء العملاء", ""],
    pricing: ["الباقات والأسعار", ""],
    faq: ["الأسئلة الشائعة", ""],
    cta: ["نموذج الطلب", "قسم التواصل النهائي"],
    floatingWhatsApp: ["زر واتساب العائم", "يظهر بعد التمرير"],
  };
  return (
    <Card title="إظهار / إخفاء الأقسام" description="أخفِ أي قسم مؤقتًا دون حذف محتواه.">
      <div className="grid gap-3 sm:grid-cols-2">
        {(Object.keys(labels) as (keyof typeof sections)[]).map((k) => (
          <Toggle key={k} checked={sections[k]} onChange={(v) => patch("sections", { [k]: v })} label={labels[k][0]} description={labels[k][1]} />
        ))}
      </div>
    </Card>
  );
}

/* ---------------- Backup & Security ---------------- */
export function BackupPanel() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  const download = () => {
    const blob = new Blob([exportSettings()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `mandoob-net-settings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const onFile = async (f: File | undefined) => {
    if (!f) return;
    try {
      importSettings(await f.text());
      setMsg("✅ تم استيراد الإعدادات بنجاح");
    } catch {
      setMsg("❌ الملف غير صالح");
    }
  };

  return (
    <div className="space-y-5">
      <Card title="النسخ الاحتياطي" description="الإعدادات محفوظة في متصفحك الحالي فقط. صدّرها للاحتفاظ بنسخة أو لنقلها إلى جهاز آخر.">
        <div className="flex flex-wrap gap-3">
          <Btn variant="primary" onClick={download}>⬇ تصدير الإعدادات (JSON)</Btn>
          <Btn onClick={() => fileRef.current?.click()}>⬆ استيراد من ملف</Btn>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <Btn variant="danger" onClick={() => { if (confirm("سيتم حذف كل التعديلات والعودة للإعدادات الافتراضية. متابعة؟")) { resetSettings(); setMsg("↩ تمت الاستعادة للإعدادات الافتراضية"); } }}>
            استعادة الافتراضي
          </Btn>
        </div>
        {msg && <p className="mt-4 text-sm text-slate-600">{msg}</p>}
      </Card>

      <Card title="الحسابات وكلمات المرور" description="إدارة المستخدمين وكلمات المرور من قسم المستخدمين.">
        <a href="#/admin/users" className="inline-flex h-10 items-center rounded-xl bg-brand-500 px-4 text-sm font-bold text-ink-950 hover:bg-brand-400">
          فتح إدارة المستخدمين ←
        </a>
        <p className="mt-3 text-[11px] leading-relaxed text-amber-700">
          ⚠️ الحماية على مستوى المتصفح فقط. لحماية حقيقية اربط اللوحة بمصادقة خلفية.
        </p>
      </Card>
    </div>
  );
}
