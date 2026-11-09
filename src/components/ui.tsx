import { useRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";

/* ---------- Buttons ---------- */
type BaseProps = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
};

const variantStyles = {
  primary:
    "relative overflow-hidden bg-brand-500 text-ink-950 font-bold shadow-[0_12px_32px_-10px_rgba(132,204,22,0.65)] hover:bg-brand-400 hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-slate-600 hover:text-ink-900 hover:bg-slate-100",
};
const sizeStyles = {
  sm: "h-9 px-4 text-sm rounded-full gap-1.5",
  md: "h-11 px-6 text-sm rounded-full gap-2",
  lg: "h-13 px-8 text-base rounded-full gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-all duration-300 ease-out cursor-pointer select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center transition-all duration-300 ease-out cursor-pointer select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...rest}
    >
      {children}
    </a>
  );
}

/* ---------- Section header ---------- */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-start",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold",
            dark
              ? "border border-brand-400/25 bg-brand-400/10 text-brand-300"
              : "bg-brand-100 text-brand-700"
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "mt-4 font-display text-3xl font-extrabold leading-[1.3] sm:text-4xl lg:text-[2.75rem]",
          dark ? "text-white" : "text-ink-text"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-[1.9] sm:text-lg",
            dark ? "text-slate-300" : "text-muted"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* ---------- Spotlight card ---------- */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "spotlight glass rounded-3xl transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-400/30 hover:shadow-[0_24px_60px_-20px_rgba(52,211,153,0.25)]",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ---------- Provider badge ---------- */
const providerStyles: Record<string, string> = {
  STC: "from-violet-500 to-fuchsia-500",
  Zain: "from-emerald-400 to-lime-400",
  Mobily: "from-sky-400 to-blue-600",
  Salam: "from-orange-400 to-rose-500",
};

export function ProviderMark({
  name,
  size = "md",
  className,
}: {
  name: keyof typeof providerStyles | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const s = size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-12 w-12 text-base" : "h-9 w-9 text-xs";
  return (
    <span
      aria-hidden
      className={cn(
        "ltr inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-display font-bold text-white shadow-lg",
        providerStyles[name] ?? "from-slate-400 to-slate-600",
        s,
        className
      )}
    >
      {name.slice(0, name === "STC" ? 3 : 1)}
    </span>
  );
}

/* ---------- Icons (inline SVG) ---------- */
type IconProps = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export const Icons = {
  Wifi: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
    </svg>
  ),
  Bolt: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  Shield: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Map: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M12 21s-6-5.33-6-10a6 6 0 0 1 12 0c0 4.67-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  ),
  Headset: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  Compare: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
      <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
      <path d="M12 2v20" />
      <path d="m8 9 2 3-2 3M16 9l-2 3 2 3" />
    </svg>
  ),
  Wallet: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
    </svg>
  ),
  Clock: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  Check: ({ className }: IconProps) => (
    <svg {...base} strokeWidth={2.4} className={className}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  ),
  /* "Forward" arrow — points left in RTL layouts */
  ArrowRight: ({ className }: IconProps) => (
    <svg {...base} strokeWidth={2.2} className={className}>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  ),
  Phone: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  WhatsApp: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.71.97.99-3.62-.23-.37a9.78 9.78 0 0 1-1.5-5.22c0-5.4 4.4-9.8 9.81-9.8 2.62 0 5.08 1.02 6.93 2.88a9.74 9.74 0 0 1 2.87 6.93c0 5.41-4.4 9.81-9.8 9.81zm8.35-18.15A11.76 11.76 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.94L0 24l6.3-1.65a11.9 11.9 0 0 0 5.74 1.46h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.54-8.41z" />
    </svg>
  ),
  Star: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Menu: ({ className }: IconProps) => (
    <svg {...base} strokeWidth={2} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  X: ({ className }: IconProps) => (
    <svg {...base} strokeWidth={2} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  Plus: ({ className }: IconProps) => (
    <svg {...base} strokeWidth={2} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Router: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <rect x="3" y="14" width="18" height="6" rx="2" />
      <path d="M7 17h.01M11 17h.01" />
      <path d="M17 14V8" />
      <path d="M13.5 5.5a5 5 0 0 1 7 0M15.5 7.5a2.2 2.2 0 0 1 3 0" />
    </svg>
  ),
  Fiber: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M3 12c4-6 8 6 12 0s4-6 6 0" />
      <path d="M3 17c4-6 8 6 12 0s4-6 6 0" opacity=".5" />
      <path d="M3 7c4-6 8 6 12 0s4-6 6 0" opacity=".5" />
    </svg>
  ),
  Sparkle: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Home: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  ),
  Truck: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  ),
  Quote: ({ className }: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6v-6H5.5a1.67 1.67 0 0 1 1.67-1.67H8V6zm10 0A5.17 5.17 0 0 0 12 11.17V18h6v-6h-2.5a1.67 1.67 0 0 1 1.67-1.67H18V6z" />
    </svg>
  ),
  Users: ({ className }: IconProps) => (
    <svg {...base} className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="3" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a3 3 0 0 1 0 5.74" />
    </svg>
  ),
};
