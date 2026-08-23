import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "brand",
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "brand" | "volt" | "signal" | "danger";
}) {
  const tones = {
    brand: "text-brand bg-brand/10 ring-brand/20",
    volt: "text-volt bg-volt/10 ring-volt/20",
    signal: "text-signal bg-signal/10 ring-signal/20",
    danger: "text-red-400 bg-red-500/10 ring-red-500/20",
  } as const;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-white/15">
      <div className="flex items-center justify-between">
        <span
          className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${tones[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        {hint && (
          <span className="text-xs font-medium text-zinc-500">{hint}</span>
        )}
      </div>
      <p className="mt-4 font-display text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-zinc-500">{label}</p>
    </div>
  );
}

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${className}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text?: string;
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-line px-6 py-16 text-center">
      <Icon className="h-10 w-10 text-zinc-700" />
      <p className="mt-4 font-display font-semibold text-zinc-300">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-zinc-600">{text}</p>}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface ${className}`}
    >
      {children}
    </div>
  );
}
