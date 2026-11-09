import { type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Card({ title, description, children, actions, className }: { title?: string; description?: string; children: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6", className)}>
      {(title || actions) && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="font-display text-base font-extrabold text-ink-text">{title}</h2>}
            {description && <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function Field({ label, hint, children, counter }: { label: string; hint?: string; children: ReactNode; counter?: { value: number; min?: number; max: number } }) {
  const c = counter;
  const status = c ? (c.value === 0 ? "text-slate-500" : c.value > c.max ? "text-rose-400" : c.min && c.value < c.min ? "text-amber-400" : "text-brand-300") : "";
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700">
        {label}
        {c && (
          <span className={cn("ltr tabular-nums text-[11px]", status)}>
            {c.value}/{c.max}
          </span>
        )}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[11px] leading-relaxed text-slate-500">{hint}</span>}
    </label>
  );
}

const base =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-ink-text placeholder:text-slate-400 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:opacity-50";

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, className)} {...rest} />;
}
export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(base, "min-h-[96px] resize-y leading-relaxed", className)} {...rest} />;
}
export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(base, "appearance-none cursor-pointer", className)} {...rest}>
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-start transition-colors hover:bg-white cursor-pointer"
    >
      <span>
        <span className="block text-sm font-bold text-ink-text">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-slate-500">{description}</span>}
      </span>
      <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300", checked ? "bg-brand-500" : "bg-slate-300")}>
        <span className={cn("absolute top-0.5 start-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300", checked ? "-translate-x-5" : "translate-x-0")} />
      </span>
    </button>
  );
}

export function Btn({ children, variant = "secondary", size = "md", className, type = "button", ...rest }: { children: ReactNode; variant?: "primary" | "secondary" | "danger" | "ghost"; size?: "sm" | "md" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const v = {
    primary: "bg-brand-500 text-ink-950 font-bold shadow-lg shadow-brand-500/25 hover:bg-brand-400",
    secondary: "border border-slate-200 bg-white text-ink-900 hover:bg-slate-50",
    danger: "border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100",
    ghost: "text-slate-500 hover:text-ink-900 hover:bg-slate-100",
  }[variant];
  const s = size === "sm" ? "h-8 px-3 text-xs rounded-lg gap-1.5" : "h-10 px-4 text-sm rounded-xl gap-2";
  return (
    <button type={type} className={cn("inline-flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", v, s, className)} {...rest}>
      {children}
    </button>
  );
}

/* Generic list editor with reorder/delete/add */
export function ListEditor<T>({ items, onChange, render, create, addLabel = "إضافة عنصر", itemTitle }: { items: T[]; onChange: (items: T[]) => void; render: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode; create: () => T; addLabel?: string; itemTitle?: (item: T, i: number) => string }) {
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-500">
              <span className="ltr me-2 inline-flex h-5 w-5 items-center justify-center rounded-md bg-brand-100 text-[10px] font-bold text-brand-700">{i + 1}</span>
              {itemTitle ? itemTitle(item, i) : ""}
            </span>
            <div className="flex items-center gap-1">
              <Btn size="sm" variant="ghost" onClick={() => move(i, -1)} disabled={i === 0} aria-label="تحريك لأعلى">↑</Btn>
              <Btn size="sm" variant="ghost" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="تحريك لأسفل">↓</Btn>
              <Btn size="sm" variant="danger" onClick={() => onChange(items.filter((_, k) => k !== i))} aria-label="حذف">حذف</Btn>
            </div>
          </div>
          {render(item, (p) => onChange(items.map((it, k) => (k === i ? { ...it, ...p } : it))), i)}
        </div>
      ))}
      <Btn onClick={() => onChange([...items, create()])} className="w-full border-dashed">
        + {addLabel}
      </Btn>
    </div>
  );
}

export function Grid({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 }) {
  return <div className={cn("grid gap-4", cols === 2 && "sm:grid-cols-2", cols === 3 && "sm:grid-cols-3")}>{children}</div>;
}

export function StringList({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      {items.map((v, i) => (
        <div key={i} className="flex gap-2">
          <Input value={v} placeholder={placeholder} onChange={(e) => onChange(items.map((x, k) => (k === i ? e.target.value : x)))} />
          <Btn size="sm" variant="danger" onClick={() => onChange(items.filter((_, k) => k !== i))} className="h-10">✕</Btn>
        </div>
      ))}
      <Btn size="sm" onClick={() => onChange([...items, ""])}>+ إضافة</Btn>
    </div>
  );
}

export const iconOptions = ["Compare", "Map", "Bolt", "Truck", "Wallet", "Headset", "Shield", "Clock", "Sparkle", "Home", "Wifi", "Router", "Fiber", "Phone"];
