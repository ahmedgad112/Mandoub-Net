import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { navLinks } from "@/data/content";
import { useSite, useWhatsApp } from "@/store/siteStore";
import { ButtonLink, Icons } from "./ui";

export function Logo({
  className,
  href = "#top",
  dark = false,
  compact = false,
}: {
  className?: string;
  href?: string;
  dark?: boolean;
  compact?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="مندوب نت — الصفحة الرئيسية"
    >
      <img
        src="/images/logo-circle.png"
        alt="مندوب نت — Mandoub Net"
        width={compact ? 48 : 56}
        height={compact ? 48 : 56}
        className={cn(
          "rounded-full object-cover shadow-md ring-2 ring-brand-500/25 transition-transform duration-300 group-hover:scale-[1.05]",
          compact ? "h-11 w-11 sm:h-12 sm:w-12" : "h-12 w-12 sm:h-14 sm:w-14",
          dark && "ring-brand-400/40"
        )}
      />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-lg font-extrabold", dark ? "text-white" : "text-ink-900")}>
          مندوب<span className="text-brand-600"> نت</span>
        </span>
        <span className={cn("mt-0.5 text-[10px] font-medium", dark ? "text-slate-400" : "text-slate-500")}>
          Mandoub Net
        </span>
      </span>
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { link: WHATSAPP_LINK } = useWhatsApp();
  const { general, sections } = useSite();
  const phoneHref = "tel:+" + general.whatsappNumber.replace(/\D/g, "");
  const visible = navLinks.filter((l) => {
    const map: Record<string, boolean> = {
      "#features": sections.features,
      "#showcase": sections.showcase,
      "#how-it-works": sections.howItWorks,
      "#pricing": sections.pricing,
      "#faq": sections.faq,
    };
    return map[l.href] ?? true;
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled ? "border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl" : "border-transparent bg-white"
      )}
    >
      {general.announcementEnabled && general.announcementText && (
        <div className="bg-brand-500 px-4 py-2 text-center text-xs font-bold text-ink-950">
          {general.announcementText}
        </div>
      )}
      <nav aria-label="التنقل الرئيسي" className="mx-auto flex h-[80px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <ul className="hidden items-center gap-1 xl:flex">
          {visible.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-brand-50 hover:text-ink-900"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <ButtonLink href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" variant="secondary" size="sm" className="!border-slate-200 !bg-white !text-ink-900 hover:!bg-slate-50">
            <Icons.WhatsApp className="h-4 w-4 text-brand-600" />
            واتساب
          </ButtonLink>
          <ButtonLink href={phoneHref} size="sm" className="ltr">
            <Icons.Phone className="h-4 w-4" />
            {general.phone}
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-ink-900 lg:hidden"
        >
          {open ? <Icons.X className="h-5 w-5" /> : <Icons.Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 top-[80px] z-40 lg:hidden transition-all duration-400",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div
          className={cn(
            "absolute inset-x-4 top-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl transition-all duration-400",
            open ? "translate-y-0 scale-100" : "-translate-y-3 scale-95"
          )}
        >
          <ul className="flex flex-col gap-1">
            {visible.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold text-ink-900 hover:bg-brand-50"
                >
                  {l.label}
                  <Icons.ArrowRight className="h-4 w-4 text-slate-400" />
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            <ButtonLink href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              <Icons.WhatsApp className="h-4 w-4" />
              تواصل عبر واتساب
            </ButtonLink>
            <ButtonLink href={phoneHref} variant="secondary" className="!border-slate-200 !bg-slate-50 !text-ink-900" onClick={() => setOpen(false)}>
              <Icons.Phone className="h-4 w-4" />
              {general.phone}
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}
