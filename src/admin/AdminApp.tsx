import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import {
  subscribe,
  useSite,
  lastSavedAt,
  getSessionUserId,
  logoutUser,
  isLoggedIn,
  SESSION_KEY,
} from "@/store/siteStore";
import { getToken } from "@/api/client";
import { Icons } from "@/components/ui";
import { Logo } from "@/components/Navbar";
import { Btn, Card } from "./ui";
import { LoginPage } from "./LoginPage";
import { BackupPanel, FAQPanel, GeneralPanel, HeroPanel, ListsPanel, PackagesPanel, SectionsPanel, TestimonialsPanel } from "./panels/ContentPanels";
import { SEOPanel, SEOScoreRing } from "./panels/SEOPanel";
import { UsersPanel } from "./panels/UsersPanel";

const nav = [
  { id: "overview", label: "نظرة عامة", icon: "Sparkle" },
  { id: "general", label: "الإعدادات العامة", icon: "Home" },
  { id: "hero", label: "القسم الرئيسي", icon: "Bolt" },
  { id: "lists", label: "المميزات والخطوات", icon: "Compare" },
  { id: "packages", label: "الباقات والأسعار", icon: "Wallet" },
  { id: "testimonials", label: "آراء العملاء", icon: "Star" },
  { id: "faq", label: "الأسئلة الشائعة", icon: "Headset" },
  { id: "sections", label: "الأقسام", icon: "Router" },
  { id: "seo", label: "تحسين محركات البحث", icon: "Map" },
  { id: "users", label: "المستخدمون", icon: "Users" },
  { id: "backup", label: "النسخ والأمان", icon: "Shield" },
] as const;
type PanelId = (typeof nav)[number]["id"];

function Overview({ go }: { go: (p: PanelId) => void }) {
  const s = useSite();
  const t = s.seo.title.length, d = s.seo.description.length;
  const quick = [
    { ok: t >= 30 && t <= 65, l: "عنوان SEO" },
    { ok: d >= 100 && d <= 165, l: "وصف SEO" },
    { ok: !!s.seo.ogImage, l: "صورة المشاركة" },
    { ok: s.seo.robotsIndex, l: "قابل للفهرسة" },
    { ok: s.seo.schemaEnabled, l: "Schema" },
    { ok: !!s.seo.gaId || !!s.seo.gtmId, l: "التحليلات" },
  ];
  const score = Math.round((quick.filter((q) => q.ok).length / quick.length) * 100);
  const hidden = Object.values(s.sections).filter((v) => !v).length;
  const stats = [
    { label: "باقات 5G", value: s.plans["5g"].length, go: "packages" as PanelId },
    { label: "باقات الفايبر", value: s.plans.fiber.length, go: "packages" as PanelId },
    { label: "آراء العملاء", value: s.testimonials.length, go: "testimonials" as PanelId },
    { label: "الأسئلة الشائعة", value: s.faqs.length, go: "faq" as PanelId },
    { label: "المميزات", value: s.features.length, go: "lists" as PanelId },
    { label: "أقسام مخفية", value: hidden, go: "sections" as PanelId },
  ];
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Card className="flex items-center gap-5 !bg-white !border-slate-200">
          <SEOScoreRing score={score} />
          <div>
            <p className="text-xs text-slate-500">جاهزية SEO السريعة</p>
            <h2 className="font-display text-lg font-extrabold text-ink-text">{score >= 80 ? "ممتاز" : score >= 55 ? "جيد" : "يحتاج تحسين"}</h2>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {quick.map((q) => (
                <li key={q.l} className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", q.ok ? "bg-brand-100 text-brand-700" : "bg-rose-50 text-rose-600")}>{q.l}</li>
              ))}
            </ul>
            <button onClick={() => go("seo")} className="mt-3 text-xs font-bold text-brand-700 hover:underline cursor-pointer">فتح إعدادات SEO ←</button>
          </div>
        </Card>
        <Card title="المحتوى الحالي" className="!bg-white !border-slate-200">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((st) => (
              <button key={st.label} onClick={() => go(st.go)} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-start transition hover:border-brand-400 hover:bg-brand-50 cursor-pointer">
                <p className="ltr font-display text-2xl font-extrabold text-ink-text">{st.value}</p>
                <p className="text-[11px] font-medium text-slate-500">{st.label}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card title="إجراءات سريعة" className="!bg-white !border-slate-200">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { l: "تعديل رقم واتساب", d: s.general.whatsappNumber, go: "general" as PanelId },
            { l: "تعديل عنوان الهيرو", d: s.hero.titleHighlight, go: "hero" as PanelId },
            { l: "تحديث الأسعار", d: `من ${Math.min(...[...s.plans["5g"], ...s.plans.fiber].map((p) => p.price))} ريال`, go: "packages" as PanelId },
            { l: "نسخة احتياطية", d: "تصدير JSON", go: "backup" as PanelId },
          ].map((a) => (
            <button key={a.l} onClick={() => go(a.go)} className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-start transition hover:border-brand-400 hover:bg-white cursor-pointer">
              <span>
                <span className="block text-sm font-bold text-ink-text">{a.l}</span>
                <span className="ltr block text-[11px] text-slate-500">{a.d}</span>
              </span>
              <Icons.ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-x-1" />
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function AdminApp({ forceLogin = false }: { forceLogin?: boolean }) {
  const [authed, setAuthed] = useState(() => !forceLogin && isLoggedIn() && !!getToken());
  const [panel, setPanel] = useState<PanelId>(() => {
    const part = location.hash.split("/")[2] as PanelId;
    return nav.some((n) => n.id === part) ? part : "overview";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const site = useSite();
  const me = (() => {
    const id = getSessionUserId();
    return id ? site.admin.users?.find((u) => u.id === id) : undefined;
  })();
  const visibleNav = nav.filter((n) => n.id !== "users" || !me || me.role === "admin");

  useEffect(() => {
    const syncPanel = () => {
      const part = location.hash.split("/")[2] as PanelId;
      if (nav.some((n) => n.id === part)) setPanel(part);
    };
    syncPanel();
    window.addEventListener("hashchange", syncPanel);
    return () => window.removeEventListener("hashchange", syncPanel);
  }, []);

  useEffect(() => {
    document.title = "لوحة التحكم — مندوب نت";
    document.body.classList.add("admin-body");
    if (!getToken()) {
      sessionStorage.removeItem(SESSION_KEY);
      setAuthed(false);
    }
    const unsub = subscribe(() => {
      if (Date.now() - lastSavedAt < 800) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1600);
      }
    });
    return () => {
      unsub();
      document.body.classList.remove("admin-body");
    };
  }, []);

  const go = (p: PanelId) => {
    setPanel(p);
    setMenuOpen(false);
    location.hash = `#/admin/${p}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!authed) {
    return (
      <LoginPage
        onSuccess={() => {
          setAuthed(true);
          if (forceLogin || location.hash.startsWith("#/login")) location.hash = "#/admin";
        }}
      />
    );
  }

  const safePanel = panel === "users" && me && me.role !== "admin" ? "overview" : panel;
  const Panel = {
    overview: () => <Overview go={go} />,
    general: GeneralPanel,
    hero: HeroPanel,
    lists: ListsPanel,
    packages: PackagesPanel,
    testimonials: TestimonialsPanel,
    faq: FAQPanel,
    sections: SectionsPanel,
    seo: SEOPanel,
    users: UsersPanel,
    backup: BackupPanel,
  }[safePanel];
  const current = nav.find((n) => n.id === safePanel)!;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen((v) => !v)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-ink-900 lg:hidden cursor-pointer" aria-label="القائمة">
              {menuOpen ? <Icons.X className="h-4 w-4" /> : <Icons.Menu className="h-4 w-4" />}
            </button>
            <Logo href="#/admin" compact />
            <span className="hidden rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-extrabold text-brand-700 sm:inline">لوحة التحكم</span>
          </div>
          <div className="flex items-center gap-2">
            {me && (
              <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 ps-1 pe-3 text-xs font-bold text-ink-900 sm:inline-flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-[10px] text-ink-950">
                  {(me.name || me.username).charAt(0)}
                </span>
                {me.name || me.username}
              </span>
            )}
            <span className={cn("hidden items-center gap-1.5 text-xs font-medium md:flex", saved ? "text-brand-700" : "text-slate-400")}>
              <span className={cn("h-1.5 w-1.5 rounded-full", saved ? "bg-brand-500" : "bg-slate-300")} />
              {saved ? "تم الحفظ" : "حفظ تلقائي"}
            </span>
            <a href="#/" target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-ink-900 hover:bg-slate-50">
              عرض الموقع ↗
            </a>
            <Btn
              size="sm"
              variant="ghost"
              className="!text-slate-600"
              onClick={() => {
                void logoutUser().finally(() => {
                  setAuthed(false);
                  location.hash = "#/login";
                });
              }}
            >
              خروج
            </Btn>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6 sm:px-6">
        <aside className={cn("fixed inset-y-16 start-0 z-30 w-72 border-e border-slate-200 bg-white p-4 shadow-xl transition-transform duration-300 lg:static lg:inset-auto lg:w-60 lg:shrink-0 lg:translate-x-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none", menuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0")}>
          <nav className="lg:sticky lg:top-24 space-y-1 rounded-2xl border border-slate-200 bg-white p-2 lg:border-0 lg:bg-transparent lg:p-0" aria-label="أقسام لوحة التحكم">
            {visibleNav.map((n) => {
              const Icon = Icons[n.icon as keyof typeof Icons];
              const active = n.id === safePanel;
              return (
                <button key={n.id} onClick={() => go(n.id)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer", active ? "bg-brand-500 text-ink-950 shadow-md shadow-brand-500/25" : "text-slate-600 hover:bg-slate-100 hover:text-ink-900")}>
                  <Icon className="h-4.5 w-4.5" />
                  {n.label}
                </button>
              );
            })}
          </nav>
        </aside>
        {menuOpen && <div className="fixed inset-0 top-16 z-20 bg-ink-950/40 lg:hidden" onClick={() => setMenuOpen(false)} />}

        <main className="min-w-0 flex-1">
          <div className="mb-5">
            <p className="text-xs font-medium text-slate-500">لوحة التحكم / {current.label}</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold text-ink-text">{current.label}</h1>
          </div>
          <div className="admin-panels space-y-5">
            <Panel />
          </div>
        </main>
      </div>
    </div>
  );
}
