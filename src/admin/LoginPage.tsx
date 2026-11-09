import { useEffect, useState, type FormEvent } from "react";
import {
  DEFAULT_PASSWORD,
  DEFAULT_USERNAME,
  ensureUsersSeeded,
  loginUser,
  SESSION_USER_KEY,
} from "@/store/siteStore";
import { Logo } from "@/components/Navbar";
import { Icons } from "@/components/ui";
import { Btn } from "./ui";

const SESSION_KEY = "mandoob:admin:session";

export function LoginPage({ onSuccess }: { onSuccess?: () => void }) {
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void ensureUsersSeeded();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const user = await loginUser(username, pw);
      setBusy(false);
      if (user) {
        sessionStorage.setItem(SESSION_KEY, "1");
        if (onSuccess) onSuccess();
        else location.hash = "#/admin";
      } else {
        setErr("اسم المستخدم أو كلمة المرور غير صحيحة.");
      }
    } catch {
      setBusy(false);
      setErr("تعذّر تسجيل الدخول. حاول مرة أخرى.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 hero-surface opacity-[0.08]" />
        <div className="absolute -top-24 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-brand-400/25 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[280px] w-[280px] rounded-full bg-brand-500/20 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo href="#/" className="[&_img]:h-16 [&_img]:w-16 [&_img]:sm:h-20 [&_img]:sm:w-20" />
        </div>

        <form
          onSubmit={submit}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_30px_80px_-40px_rgba(3,26,22,0.35)] sm:p-9"
        >
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
              <Icons.Shield className="h-3.5 w-3.5" />
              منطقة محمية
            </span>
            <h1 className="mt-4 font-display text-2xl font-extrabold text-ink-text">تسجيل الدخول</h1>
            <p className="mt-2 text-sm text-slate-500">ادخل بحسابك لإدارة المحتوى والباقات والـ SEO</p>
          </div>

          <label className="mt-8 block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">اسم المستخدم</span>
            <input
              type="text"
              dir="ltr"
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErr("");
              }}
              placeholder="admin"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-ink-text placeholder:text-slate-400 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">كلمة المرور</span>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                dir="ltr"
                autoComplete="current-password"
                value={pw}
                onChange={(e) => {
                  setPw(e.target.value);
                  setErr("");
                }}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pe-12 text-sm text-ink-text placeholder:text-slate-400 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute end-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-500 hover:bg-slate-100 hover:text-ink-900 cursor-pointer"
              >
                {show ? "إخفاء" : "إظهار"}
              </button>
            </div>
          </label>

          {err && (
            <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600" role="alert">
              {err}
            </p>
          )}

          <Btn type="submit" variant="primary" className="mt-6 w-full !h-12 !rounded-2xl !text-sm" disabled={busy || !username || !pw}>
            {busy ? "جارٍ التحقق…" : "دخول إلى اللوحة"}
          </Btn>

          <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-center text-[11px] text-slate-500">
            الحساب الافتراضي:{" "}
            <span className="ltr font-mono font-semibold text-ink-800">
              {DEFAULT_USERNAME} / {DEFAULT_PASSWORD}
            </span>
          </div>

          <a href="#/" className="mt-5 flex items-center justify-center gap-1.5 text-xs font-bold text-brand-700 hover:underline">
            <Icons.ArrowRight className="h-3.5 w-3.5 rotate-180" />
            العودة للموقع
          </a>
        </form>
      </div>
    </div>
  );
}

export { SESSION_KEY, SESSION_USER_KEY };
