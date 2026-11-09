import { navLinks, providers } from "@/data/content";
import { useSite, useWhatsApp } from "@/store/siteStore";
import { Logo } from "./Navbar";
import { Icons, ProviderMark } from "./ui";

export function Footer() {
  const year = new Date().getFullYear();
  const { general } = useSite();
  const { link: WHATSAPP_LINK } = useWhatsApp();
  const telHref = "tel:+" + general.whatsappNumber.replace(/\D/g, "");
  return (
    <footer className="relative border-t border-slate-200 bg-slate-50 pt-14 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-[1.9] text-slate-600">
              مندوب نت يساعدك تختار أفضل باقة إنترنت منزلي 5G أو فايبر في السعودية، ويقدّم طلبك ويتابع التركيب.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {providers.map((p) => (
                <ProviderMark key={p} name={p} size="sm" />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold text-ink-text">استكشف</h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-slate-600 transition-colors hover:text-brand-700">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold text-ink-text">المدن</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
              {["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "تبوك", "أبها"].map((c) => (
                <li key={c} className="text-sm text-slate-600">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold text-ink-text">تواصل معنا</h3>
            <ul className="mt-5 space-y-4">
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-ink-900"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                    <Icons.WhatsApp className="h-4 w-4" />
                  </span>
                  واتساب · <span className="ltr">{general.phone}</span>
                </a>
              </li>
              <li>
                <a href={telHref} className="group flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-ink-900">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                    <Icons.Phone className="h-4 w-4" />
                  </span>
                  اتصال · <span className="ltr">{general.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <Icons.Clock className="h-4 w-4" />
                </span>
                {general.workingHours}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-7 text-xs text-slate-500 sm:flex-row">
          <p>
            © {year} {general.brandName} {general.brandSuffix}. جميع الحقوق محفوظة. ·{" "}
            <a href="#/login" className="font-semibold text-brand-700 hover:underline">دخول لوحة التحكم</a>
          </p>
          <p className="max-w-xl text-center sm:text-end">
            خدمة اشتراك مستقلة. زين وموبايلي وSTC وسلام علامات تجارية لمالكيها.
          </p>
        </div>
      </div>
    </footer>
  );
}
