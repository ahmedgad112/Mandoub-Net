import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { useSite, useWhatsApp } from "@/store/siteStore";
import { SEOHead } from "@/components/SEOHead";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { Features } from "@/components/Features";
import { Showcase } from "@/components/Showcase";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Icons } from "@/components/ui";
import { AdminApp } from "@/admin/AdminApp";
import { LoginPage } from "@/admin/LoginPage";
import { SESSION_KEY, isLoggedIn } from "@/store/siteStore";
import { getToken } from "@/api/client";

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

function FloatingActions() {
  const [show, setShow] = useState(false);
  const { link } = useWhatsApp();
  const { general } = useSite();
  const tel = "tel:+" + general.whatsappNumber.replace(/\D/g, "");

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-5 end-5 z-40 flex flex-col gap-3 transition-all duration-500 sm:bottom-6 sm:end-6",
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
      )}
    >
      <a
        href={tel}
        aria-label="اتصال هاتفي"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 text-white shadow-xl shadow-ink-900/30 transition hover:scale-105 hover:bg-ink-800"
      >
        <Icons.Phone className="h-6 w-6" />
      </a>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-500/40 transition hover:scale-105"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring opacity-50" />
        <Icons.WhatsApp className="relative h-7 w-7" />
      </a>
    </div>
  );
}

function PublicSite() {
  const { sections } = useSite();
  return (
    <>
      <SEOHead />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink-950"
      >
        انتقل إلى المحتوى
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        {sections.socialProof && <SocialProof />}
        {sections.pricing && <Pricing />}
        {sections.features && <Features />}
        {sections.showcase && <Showcase />}
        {sections.howItWorks && <HowItWorks />}
        {sections.testimonials && <Testimonials />}
        {sections.faq && <FAQ />}
        {sections.cta && <CTA />}
      </main>
      <Footer />
      {sections.floatingWhatsApp && <FloatingActions />}
    </>
  );
}

export default function App() {
  const hash = useHashRoute();
  const isLogin = hash === "#/login" || hash.startsWith("#/login?");
  const isAdmin = hash.startsWith("#/admin");

  if (isLogin) {
    if (isLoggedIn() || (getToken() && sessionStorage.getItem(SESSION_KEY) === "1")) {
      location.hash = "#/admin";
      return null;
    }
    return <LoginPage />;
  }
  if (isAdmin) return <AdminApp />;
  return <PublicSite />;
}
