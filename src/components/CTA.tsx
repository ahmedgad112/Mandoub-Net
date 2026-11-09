import { useState, type FormEvent } from "react";
import { cn } from "@/utils/cn";
import { cities, providerNames, providers } from "@/data/content";
import { useSite, waLink } from "@/store/siteStore";
import { Reveal } from "./Reveal";
import { Button, Icons } from "./ui";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-all duration-300 focus:border-brand-400/60 focus:bg-white/[0.07] focus:outline-none focus:ring-4 focus:ring-brand-400/10";

const serviceOptions = ["5G", "فايبر", "لا فرق"];
const NO_PREF = "لا تفضيل";

export function CTA() {
  const { general } = useSite();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    district: "",
    service: "لا فرق",
    provider: NO_PREF,
  });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const phone = form.phone.replace(/\s/g, "").replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
    if (form.name.trim().length < 2) errs.name = "يرجى إدخال اسمك";
    if (!/^(\+?966|0)?5\d{8}$/.test(phone)) errs.phone = "أدخل رقم جوال سعودي صحيح (05XXXXXXXX)";
    if (!form.city) errs.city = "اختر مدينتك";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const msg = `مرحبًا مندوب نت، أرغب في التحقق من التغطية والحصول على ترشيح للباقة المناسبة.
الاسم: ${form.name}
الجوال: ${phone}
المدينة: ${form.city}${form.district ? ` – ${form.district}` : ""}
نوع الخدمة: ${form.service}
المزوّد المفضل: ${form.provider}`;
    window.open(waLink(general.whatsappNumber, msg), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <section id="contact" className="relative scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal direction="scale">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-ink-900">
            {/* خلفية */}
            <div className="pointer-events-none absolute inset-0">
              <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
              <div className="absolute -right-20 -top-20 h-[420px] w-[420px] rounded-full bg-brand-500/25 blur-[120px] animate-blob" />
              <div className="absolute -bottom-32 left-0 h-[420px] w-[420px] rounded-full bg-brand-400/15 blur-[120px] animate-blob [animation-delay:-9s]" />
              <div className="absolute left-[38%] top-10 h-40 w-40 rounded-full border border-brand-400/10 animate-float" />
              <div className="absolute bottom-10 right-[40%] h-24 w-24 rounded-full border border-brand-300/10 animate-float-slow" />
            </div>

            <div className="relative grid gap-12 p-7 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
              {/* النص */}
              <div className="flex flex-col justify-center">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-400/20 bg-brand-400/10 px-3.5 py-1 text-xs font-semibold text-brand-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" /> فحص تغطية مجاني
                </span>
                <h2 className="mt-5 font-display text-3xl font-extrabold leading-[1.3] text-white sm:text-4xl lg:text-5xl">
                  جاهز لتوصيل منزلك <span className="text-brand-400">بالطريقة السهلة؟</span>
                </h2>
                <p className="mt-5 max-w-md text-base leading-[1.9] text-slate-400 sm:text-lg">
                  أخبرنا أين تسكن وكيف تستخدم الإنترنت. خلال ساعة ستحصل على قائمة مخصصة — وسنتولى كل شيء بعد موافقتك.
                </p>

                <ul className="mt-8 space-y-3">
                  {[
                    { icon: Icons.Clock, text: "نرد خلال 60 دقيقة، طوال أيام الأسبوع" },
                    { icon: Icons.Shield, text: "بياناتك تُشارك فقط مع المزوّد الذي تختاره" },
                    { icon: Icons.Wallet, text: "بدون رسوم أبدًا — تدفع سعر المزوّد الرسمي فقط" },
                  ].map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-brand-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-2.5">
                    {["ع", "س", "م", "ن"].map((n, i) => (
                      <span
                        key={n}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-900 bg-gradient-to-br from-slate-600 to-slate-800 text-xs font-bold text-white"
                        style={{ zIndex: 4 - i }}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    <span className="font-semibold text-white">312 منزلًا</span> تم توصيلها هذا الشهر
                  </p>
                </div>
              </div>

              {/* النموذج */}
              <div className="glass-strong relative rounded-3xl p-6 sm:p-8">
                {sent ? (
                  <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
                    <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-400 text-ink-950 shadow-[0_0_60px_-10px_rgba(52,211,153,0.9)]">
                      <span className="absolute inset-0 rounded-full bg-brand-400 animate-pulse-ring" />
                      <Icons.Check className="relative h-8 w-8" />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-bold text-white">أوشكت على الانتهاء!</h3>
                    <p className="mt-3 max-w-xs text-sm leading-[1.9] text-slate-400">
                      فتحنا واتساب وبياناتك جاهزة في الرسالة. اضغط إرسال وسيرد عليك مندوبنا قريبًا.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-6 text-sm font-medium text-brand-300 underline-offset-4 hover:underline cursor-pointer"
                    >
                      إرسال طلب آخر
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} noValidate className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-slate-300">
                          الاسم الكامل
                        </label>
                        <input
                          id="name"
                          value={form.name}
                          onChange={update("name")}
                          placeholder="عبدالله الـ…"
                          autoComplete="name"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-err" : undefined}
                          className={cn(inputCls, errors.name && "border-rose-400/60")}
                        />
                        {errors.name && (
                          <p id="name-err" className="mt-1 text-xs text-rose-400">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-slate-300">
                          رقم الجوال
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          inputMode="tel"
                          dir="ltr"
                          value={form.phone}
                          onChange={update("phone")}
                          placeholder="05XXXXXXXX"
                          autoComplete="tel"
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? "phone-err" : undefined}
                          className={cn(inputCls, "text-right placeholder:text-right", errors.phone && "border-rose-400/60")}
                        />
                        {errors.phone && (
                          <p id="phone-err" className="mt-1 text-xs text-rose-400">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="city" className="mb-1.5 block text-xs font-medium text-slate-300">
                          المدينة
                        </label>
                        <select
                          id="city"
                          value={form.city}
                          onChange={update("city")}
                          aria-invalid={!!errors.city}
                          className={cn(
                            inputCls,
                            "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222.5%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:12px] bg-[left_1rem_center] bg-no-repeat pe-10",
                            !form.city && "text-slate-500",
                            errors.city && "border-rose-400/60"
                          )}
                        >
                          <option value="" disabled className="bg-ink-900">
                            اختر المدينة
                          </option>
                          {cities.map((c) => (
                            <option key={c} value={c} className="bg-ink-900 text-white">
                              {c}
                            </option>
                          ))}
                        </select>
                        {errors.city && <p className="mt-1 text-xs text-rose-400">{errors.city}</p>}
                      </div>
                      <div>
                        <label htmlFor="district" className="mb-1.5 block text-xs font-medium text-slate-300">
                          الحي <span className="text-slate-500">(اختياري)</span>
                        </label>
                        <input
                          id="district"
                          value={form.district}
                          onChange={update("district")}
                          placeholder="مثال: النرجس"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <fieldset>
                      <legend className="mb-2 text-xs font-medium text-slate-300">نوع الخدمة</legend>
                      <div className="grid grid-cols-3 gap-2">
                        {serviceOptions.map((s) => (
                          <label
                            key={s}
                            className={cn(
                              "flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-300",
                              form.service === s
                                ? "border-brand-400/60 bg-brand-400/15 text-white shadow-[0_0_20px_-6px_rgba(52,211,153,0.6)]"
                                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                            )}
                          >
                            <input
                              type="radio"
                              name="service"
                              value={s}
                              checked={form.service === s}
                              onChange={update("service")}
                              className="sr-only"
                            />
                            {s}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="mb-2 text-xs font-medium text-slate-300">المزوّد المفضل</legend>
                      <div className="flex flex-wrap gap-2">
                        {[NO_PREF, ...providers.map((p) => providerNames[p])].map((p) => (
                          <label
                            key={p}
                            className={cn(
                              "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300",
                              form.provider === p
                                ? "border-brand-400/60 bg-brand-400/15 text-white"
                                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                            )}
                          >
                            <input
                              type="radio"
                              name="provider"
                              value={p}
                              checked={form.provider === p}
                              onChange={update("provider")}
                              className="sr-only"
                            />
                            {p}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <Button type="submit" size="lg" className="group w-full">
                      <Icons.WhatsApp className="h-5 w-5" />
                      أرسل طلبي عبر واتساب
                      <Icons.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    </Button>
                    <p className="text-center text-[11px] text-slate-500">
                      بإرسالك توافق على التواصل معك بشأن عروض الإنترنت المنزلي. بدون رسائل مزعجة أبدًا.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
