import { useSyncExternalStore } from "react";
import { faqs, features, plans, stats, steps, testimonials, type Plan } from "@/data/content";
import { api, clearAuth, getCachedUser, getToken, setAuth, type ApiUser } from "@/api/client";

/* ---------------- Types ---------------- */
export type SiteSettings = {
  general: {
    brandName: string;
    brandSuffix: string;
    whatsappNumber: string;
    whatsappGreeting: string;
    phone: string;
    workingHours: string;
    announcementEnabled: boolean;
    announcementText: string;
  };
  hero: {
    badge: string;
    titleA: string;
    titleHighlight: string;
    titleB: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    bullets: string[];
  };
  stats: { value: number; suffix: string; label: string }[];
  features: { icon: string; title: string; description: string }[];
  steps: { number: string; icon: string; title: string; description: string }[];
  testimonials: { name: string; role: string; provider: string; text: string; rating: number }[];
  plans: { "5g": Plan[]; fiber: Plan[] };
  faqs: { q: string; a: string }[];
  sections: {
    socialProof: boolean;
    features: boolean;
    showcase: boolean;
    howItWorks: boolean;
    testimonials: boolean;
    pricing: boolean;
    faq: boolean;
    cta: boolean;
    floatingWhatsApp: boolean;
  };
  seo: {
    siteUrl: string;
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    robotsIndex: boolean;
    robotsFollow: boolean;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterHandle: string;
    locale: string;
    gaId: string;
    gtmId: string;
    googleVerification: string;
    schemaEnabled: boolean;
    faqSchemaEnabled: boolean;
    businessName: string;
    businessCity: string;
    businessRegion: string;
    businessCountry: string;
    priceRange: string;
    customHeadHtml: string;
  };
  admin: {
    /** @deprecated kept for migration from single-password setups */
    passwordHash: string;
    users: AdminUser[];
  };
};

export type AdminRole = "admin" | "editor";
export type AdminUser = {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  /** Kept for type compat; hashes live on the server only */
  passwordHash?: string;
  active: boolean;
  createdAt: string;
};

/* ---------------- Defaults ---------------- */
export const defaultSettings: SiteSettings = {
  general: {
    brandName: "مندوب",
    brandSuffix: "نت",
    whatsappNumber: "966500000000",
    whatsappGreeting: "مرحبًا مندوب نت، أحتاج مساعدة في اختيار باقة الإنترنت المنزلي المناسبة.",
    phone: "+966 50 000 0000",
    workingHours: "يوميًا · من 9 صباحًا حتى 11 مساءً",
    announcementEnabled: false,
    announcementText: "🎉 عرض محدود: تركيب فايبر مجاني مع باقات STC وزين حتى نهاية الشهر",
  },
  hero: {
    badge: "عروض الإنترنت المنزلية 5G",
    titleA: "عيش السرعة الخيالية مع",
    titleHighlight: "5G والفايبر",
    titleB: "",
    description:
      "اختر أفضل باقة إنترنت منزلي من زين وموبايلي وSTC وسلام — وخلّ مندوب نت يتحقق من التغطية ويقدّم طلبك ويتابع التركيب حتى تتصل.",
    primaryCta: "مشاهدة العروض والباقات",
    secondaryCta: "تواصل عبر واتساب",
    bullets: ["إنترنت 5G", "فايبر منزلي", "دعم 24/7"],
  },
  stats: [...stats],
  features: features.map((f) => ({ ...f })),
  steps: steps.map((s) => ({ ...s })),
  testimonials: testimonials.map((t) => ({ ...t })),
  plans: { "5g": plans["5g"].map((p) => ({ ...p, features: [...p.features] })), fiber: plans.fiber.map((p) => ({ ...p, features: [...p.features] })) },
  faqs: faqs.map((f) => ({ ...f })),
  sections: {
    socialProof: true,
    features: true,
    showcase: true,
    howItWorks: true,
    testimonials: true,
    pricing: true,
    faq: true,
    cta: true,
    floatingWhatsApp: true,
  },
  seo: {
    siteUrl: "https://mandoobnet.sa",
    title: "مندوب نت — عروض الإنترنت المنزلي 5G والفايبر في السعودية",
    description:
      "اختر باقة الإنترنت المنزلي المناسبة من زين أو موبايلي أو STC أو سلام. نتحقق من التغطية ونقدّم طلب اشتراكك ونتابع التوصيل والتركيب مجانًا.",
    keywords: "انترنت منزلي, فايبر, 5G, STC, زين, موبايلي, سلام, اشتراك انترنت السعودية, عروض الانترنت",
    canonical: "https://mandoobnet.sa/",
    robotsIndex: true,
    robotsFollow: true,
    ogTitle: "مندوب نت — أفضل عروض الإنترنت المنزلي في السعودية",
    ogDescription: "قارن باقات 5G والفايبر من المزودين الأربعة واشترك خلال دقائق مع متابعة كاملة للتركيب.",
    ogImage: "/images/hero-router.jpg",
    twitterHandle: "@mandoobnet",
    locale: "ar_SA",
    gaId: "",
    gtmId: "GTM-5GP64KZK",
    googleVerification: "",
    schemaEnabled: true,
    faqSchemaEnabled: true,
    businessName: "مندوب نت",
    businessCity: "الرياض",
    businessRegion: "منطقة الرياض",
    businessCountry: "SA",
    priceRange: "SAR 199 - 399",
    customHeadHtml: "",
  },
  admin: {
    passwordHash: "",
    users: [],
  },
};

/* ---------------- Persistence (SQLite API) ---------------- */
function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
function deepMerge<T>(base: T, patch: unknown): T {
  if (!isObj(base) || !isObj(patch)) return patch === undefined ? base : (patch as T);
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const k of Object.keys(patch)) {
    const b = (base as Record<string, unknown>)[k];
    const p = patch[k];
    out[k] = isObj(b) && isObj(p) ? deepMerge(b, p) : p === undefined ? b : p;
  }
  return out as T;
}

function contentOnly(s: SiteSettings) {
  const { admin: _admin, ...rest } = s;
  return rest;
}

function toAdminUser(u: ApiUser): AdminUser {
  return {
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    active: u.active,
    createdAt: u.createdAt,
  };
}

let state: SiteSettings = structuredClone(defaultSettings);
let bootstrapped = false;
let bootPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();
let saveTimer: number | undefined;
let suppressPersist = false;

export let lastSavedAt = 0;
export let loadError: string | null = null;
export let isHydrating = true;

function emit() {
  listeners.forEach((l) => l());
}

function applyRemoteSettings(remote: Record<string, unknown>, users?: ApiUser[]) {
  suppressPersist = true;
  state = deepMerge(structuredClone(defaultSettings), remote);
  state = {
    ...state,
    admin: {
      passwordHash: "",
      users: users ? users.map(toAdminUser) : state.admin.users ?? [],
    },
  };
  suppressPersist = false;
  emit();
}

function persist() {
  if (suppressPersist || !bootstrapped) return;
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    void (async () => {
      try {
        await api.saveSettings(contentOnly(state));
        lastSavedAt = Date.now();
        emit();
      } catch {
        /* network — UI keeps local draft until next successful save */
      }
    })();
  }, 450);
}

export function getSettings() {
  return state;
}
export function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
export function setSettings(updater: (s: SiteSettings) => SiteSettings) {
  state = updater(state);
  emit();
  persist();
}
export function patch<K extends keyof SiteSettings>(key: K, value: Partial<SiteSettings[K]> | SiteSettings[K]) {
  setSettings((s) => ({
    ...s,
    [key]: Array.isArray(value) ? value : isObj(s[key]) && isObj(value) ? { ...(s[key] as object), ...(value as object) } : value,
  }));
}

export async function resetSettings() {
  const res = await api.resetSettings();
  applyRemoteSettings(res.settings, state.admin.users as unknown as ApiUser[]);
  lastSavedAt = Date.now();
  emit();
}

export function exportSettings() {
  return JSON.stringify(contentOnly(state), null, 2);
}

export async function importSettings(json: string) {
  const parsed = JSON.parse(json);
  const merged = deepMerge(structuredClone(defaultSettings), parsed);
  await api.saveSettings(contentOnly(merged));
  applyRemoteSettings(contentOnly(merged) as unknown as Record<string, unknown>, undefined);
  await refreshUsers();
  lastSavedAt = Date.now();
}

export async function bootstrapStore() {
  if (bootPromise) return bootPromise;
  bootPromise = (async () => {
    isHydrating = true;
    loadError = null;
    emit();
    try {
      const res = await api.getSettings();
      let users: ApiUser[] = [];
      if (getToken()) {
        try {
          const me = await api.me();
          setAuth(getToken(), me.user);
          sessionStorage.setItem(SESSION_KEY, "1");
          setSessionUser(toAdminUser(me.user));
          if (me.user.role === "admin") {
            const listed = await api.listUsers();
            users = listed.users;
          } else {
            users = [me.user];
          }
        } catch {
          clearAuth();
          sessionStorage.removeItem(SESSION_KEY);
          setSessionUser(null);
        }
      }
      applyRemoteSettings(res.settings, users);
      bootstrapped = true;
    } catch (e) {
      loadError = e instanceof Error ? e.message : "تعذّر الاتصال بالخادم";
      bootstrapped = false;
    } finally {
      isHydrating = false;
      emit();
    }
  })();
  return bootPromise;
}

/* ---------------- Hooks & helpers ---------------- */
export function useSite() {
  return useSyncExternalStore(subscribe, getSettings, getSettings);
}

export function waLink(number: string, text: string) {
  const n = number.replace(/[^\d]/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

export function useWhatsApp() {
  const s = useSite();
  const number = s.general.whatsappNumber;
  return {
    number,
    link: waLink(number, s.general.whatsappGreeting),
    linkWith: (text: string) => waLink(number, text),
  };
}

/* ---------------- Auth & Users ---------------- */
export const DEFAULT_USERNAME = "admin";
export const DEFAULT_PASSWORD = "admin123";
export const SESSION_KEY = "mandoob:admin:session";
export const SESSION_USER_KEY = "mandoob:admin:user";

export function normalizeUsername(v: string) {
  return v.trim().toLowerCase();
}

/** No-op kept for call-site compatibility — users are seeded on the server. */
export async function ensureUsersSeeded() {
  return;
}

export function getUsers() {
  return state.admin.users ?? [];
}

export function getUserById(id: string) {
  return getUsers().find((u) => u.id === id);
}

export function getSessionUserId() {
  return sessionStorage.getItem(SESSION_USER_KEY) || getCachedUser()?.id || null;
}

export function getSessionUser() {
  const id = getSessionUserId();
  if (!id) return undefined;
  return getUserById(id) || (getCachedUser() ? toAdminUser(getCachedUser()!) : undefined);
}

export function setSessionUser(user: AdminUser | null) {
  if (user) sessionStorage.setItem(SESSION_USER_KEY, user.id);
  else sessionStorage.removeItem(SESSION_USER_KEY);
}

export function isLoggedIn() {
  return !!getToken() && sessionStorage.getItem(SESSION_KEY) === "1";
}

function setUsersLocal(users: AdminUser[]) {
  suppressPersist = true;
  state = {
    ...state,
    admin: { ...state.admin, users, passwordHash: "" },
  };
  suppressPersist = false;
  emit();
}

async function refreshUsers() {
  if (!getToken()) return;
  try {
    const me = await api.me();
    setAuth(getToken(), me.user);
    if (me.user.role === "admin") {
      const listed = await api.listUsers();
      setUsersLocal(listed.users.map(toAdminUser));
    } else {
      setUsersLocal([toAdminUser(me.user)]);
    }
  } catch {
    /* ignore */
  }
}

export async function loginUser(username: string, password: string) {
  try {
    const res = await api.login(username, password);
    setAuth(res.token, res.user);
    sessionStorage.setItem(SESSION_KEY, "1");
    const user = toAdminUser(res.user);
    setSessionUser(user);
    await refreshUsers();
    return user;
  } catch (e) {
    if (e instanceof Error && (e as Error & { status?: number }).status === 401) return null;
    throw e;
  }
}

export async function logoutUser() {
  try {
    await api.logout();
  } finally {
    clearAuth();
    sessionStorage.removeItem(SESSION_KEY);
    setSessionUser(null);
  }
}

export async function createUser(input: {
  username: string;
  name: string;
  role: AdminRole;
  password: string;
}) {
  const res = await api.createUser(input);
  await refreshUsers();
  return toAdminUser(res.user);
}

export async function updateUser(
  id: string,
  patchData: Partial<Pick<AdminUser, "name" | "role" | "active" | "username">> & { password?: string }
) {
  const res = await api.updateUser(id, patchData);
  await refreshUsers();
  return toAdminUser(res.user);
}

export async function deleteUser(id: string) {
  await api.deleteUser(id);
  await refreshUsers();
}
