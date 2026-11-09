import { useSyncExternalStore } from "react";
import { faqs, features, plans, stats, steps, testimonials, type Plan } from "@/data/content";

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
  passwordHash: string;
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
    gtmId: "",
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

/* ---------------- Persistence ---------------- */
const KEY = "mandoob:site:v1";

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
function deepMerge<T>(base: T, patch: unknown): T {
  if (!isObj(base) || !isObj(patch)) return (patch === undefined ? base : (patch as T));
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const k of Object.keys(patch)) {
    const b = (base as Record<string, unknown>)[k];
    const p = patch[k];
    out[k] = isObj(b) && isObj(p) ? deepMerge(b, p) : p === undefined ? b : p;
  }
  return out as T;
}

function load(): SiteSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultSettings;
    return deepMerge(defaultSettings, JSON.parse(raw));
  } catch {
    return defaultSettings;
  }
}

let state: SiteSettings = load();
const listeners = new Set<() => void>();
let saveTimer: number | undefined;

function emit() {
  listeners.forEach((l) => l());
}
function persist() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      lastSavedAt = Date.now();
      emit();
    } catch {
      /* quota exceeded — ignore */
    }
  }, 250);
}

export let lastSavedAt = 0;

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
export function resetSettings() {
  state = defaultSettings;
  localStorage.removeItem(KEY);
  emit();
}
export function importSettings(json: string) {
  const parsed = JSON.parse(json);
  state = deepMerge(defaultSettings, parsed);
  emit();
  persist();
}
export function exportSettings() {
  return JSON.stringify(state, null, 2);
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
export async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const DEFAULT_USERNAME = "admin";
export const DEFAULT_PASSWORD = "admin123";
export const SESSION_USER_KEY = "mandoob:admin:user";

function uid() {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeUsername(v: string) {
  return v.trim().toLowerCase();
}

/** Ensure at least one admin user exists (migrates legacy passwordHash). */
export async function ensureUsersSeeded() {
  const users = state.admin.users ?? [];
  if (users.length > 0) return;

  const hash = state.admin.passwordHash || (await sha256(DEFAULT_PASSWORD));
  const seed: AdminUser = {
    id: uid(),
    username: DEFAULT_USERNAME,
    name: "المدير",
    role: "admin",
    passwordHash: hash,
    active: true,
    createdAt: new Date().toISOString(),
  };
  setSettings((s) => ({
    ...s,
    admin: { ...s.admin, users: [seed], passwordHash: "" },
  }));
}

export function getUsers() {
  return state.admin.users ?? [];
}

export function getUserById(id: string) {
  return getUsers().find((u) => u.id === id);
}

export function getSessionUserId() {
  return sessionStorage.getItem(SESSION_USER_KEY);
}

export function getSessionUser() {
  const id = getSessionUserId();
  return id ? getUserById(id) : undefined;
}

export function setSessionUser(user: AdminUser | null) {
  if (user) sessionStorage.setItem(SESSION_USER_KEY, user.id);
  else sessionStorage.removeItem(SESSION_USER_KEY);
}

export async function loginUser(username: string, password: string) {
  await ensureUsersSeeded();
  const u = normalizeUsername(username);
  const h = await sha256(password);
  const user = getUsers().find((x) => x.active && normalizeUsername(x.username) === u && x.passwordHash === h);
  if (!user) return null;
  setSessionUser(user);
  return user;
}

/** Legacy single-password check — still accepted as admin password if no username match. */
export async function verifyPassword(input: string) {
  await ensureUsersSeeded();
  const h = await sha256(input);
  const users = getUsers();
  if (users.some((u) => u.active && u.passwordHash === h)) return true;
  const stored = state.admin.passwordHash;
  if (stored) return h === stored;
  return h === (await sha256(DEFAULT_PASSWORD));
}

export async function createUser(input: {
  username: string;
  name: string;
  role: AdminRole;
  password: string;
}) {
  await ensureUsersSeeded();
  const username = normalizeUsername(input.username);
  if (!username || username.length < 3) throw new Error("اسم المستخدم يجب أن يكون 3 أحرف على الأقل");
  if (!/^[a-z0-9._-]+$/.test(username)) throw new Error("اسم المستخدم يقبل حروف إنجليزية وأرقام و . _ - فقط");
  if (input.password.length < 6) throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
  if (getUsers().some((u) => normalizeUsername(u.username) === username)) throw new Error("اسم المستخدم مستخدم بالفعل");

  const user: AdminUser = {
    id: uid(),
    username,
    name: input.name.trim() || username,
    role: input.role,
    passwordHash: await sha256(input.password),
    active: true,
    createdAt: new Date().toISOString(),
  };
  setSettings((s) => ({
    ...s,
    admin: { ...s.admin, users: [...(s.admin.users ?? []), user] },
  }));
  return user;
}

export async function updateUser(
  id: string,
  patchData: Partial<Pick<AdminUser, "name" | "role" | "active" | "username">> & { password?: string }
) {
  await ensureUsersSeeded();
  const users = getUsers();
  const target = users.find((u) => u.id === id);
  if (!target) throw new Error("المستخدم غير موجود");

  let username = target.username;
  if (patchData.username !== undefined) {
    username = normalizeUsername(patchData.username);
    if (!username || username.length < 3) throw new Error("اسم المستخدم يجب أن يكون 3 أحرف على الأقل");
    if (!/^[a-z0-9._-]+$/.test(username)) throw new Error("اسم المستخدم يقبل حروف إنجليزية وأرقام و . _ - فقط");
    if (users.some((u) => u.id !== id && normalizeUsername(u.username) === username)) {
      throw new Error("اسم المستخدم مستخدم بالفعل");
    }
  }

  if (patchData.password !== undefined && patchData.password.length > 0 && patchData.password.length < 6) {
    throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
  }

  // Don't deactivate / demote the last active admin
  const nextRole = patchData.role ?? target.role;
  const nextActive = patchData.active ?? target.active;
  const others = users.filter((u) => u.id !== id && u.active && u.role === "admin");
  if (target.role === "admin" && (nextRole !== "admin" || !nextActive) && others.length === 0) {
    throw new Error("يجب الإبقاء على مدير نشط واحد على الأقل");
  }

  const next: AdminUser = {
    ...target,
    username,
    name: patchData.name !== undefined ? patchData.name.trim() || username : target.name,
    role: nextRole,
    active: nextActive,
    passwordHash: patchData.password ? await sha256(patchData.password) : target.passwordHash,
  };

  setSettings((s) => ({
    ...s,
    admin: { ...s.admin, users: (s.admin.users ?? []).map((u) => (u.id === id ? next : u)) },
  }));
  return next;
}

export function deleteUser(id: string) {
  const users = getUsers();
  const target = users.find((u) => u.id === id);
  if (!target) throw new Error("المستخدم غير موجود");
  const remainingAdmins = users.filter((u) => u.id !== id && u.active && u.role === "admin");
  if (target.role === "admin" && remainingAdmins.length === 0) {
    throw new Error("لا يمكن حذف آخر مدير");
  }
  if (getSessionUserId() === id) throw new Error("لا يمكن حذف حسابك الحالي أثناء الجلسة");

  setSettings((s) => ({
    ...s,
    admin: { ...s.admin, users: (s.admin.users ?? []).filter((u) => u.id !== id) },
  }));
}
