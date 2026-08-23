import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Tractor,
  Wrench,
  Cog,
  Truck,
} from "lucide-react";
import type { Equipment } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { formatMoney } from "@/lib/format";

export const CATEGORY_ICONS = {
  tools: Wrench,
  equipment: Cog,
  machinery: Tractor,
  trailers: Truck,
} as const;

const TILE_STYLES: Record<Equipment["category"], string> = {
  tools: "from-brand/30 via-brand/10 to-transparent",
  equipment: "from-volt/25 via-volt/8 to-transparent",
  machinery: "from-signal/25 via-signal/8 to-transparent",
  trailers: "from-brand/20 via-signal/12 to-transparent",
};

export function EquipmentCard({ item }: { item: Equipment }) {
  const Icon = CATEGORY_ICONS[item.category];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_24px_60px_-24px_rgba(0,121,245,0.45)]">
      <div
        className={`relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br ${TILE_STYLES[item.category]}`}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div className="grid-texture absolute inset-0 opacity-60" />
            <Icon className="h-20 w-20 text-white/85 drop-shadow-[0_6px_24px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110" />
          </>
        )}
        {item.image && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        )}
        <span className="absolute left-4 top-4 rounded-full border border-line bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-300 backdrop-blur-sm">
          {CATEGORY_LABELS[item.category]}
        </span>
        {item.unitsAvailable <= 2 && (
          <span className="absolute right-4 top-4 rounded-full bg-volt/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
            Only {item.unitsAvailable} left
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-white">
          {item.name}
        </h3>
        <p className="mt-1 text-sm text-zinc-500">{item.tagline}</p>

        <div className="mt-4 flex gap-2">
          {item.specs.slice(0, 2).map((spec) => (
            <span
              key={spec.label}
              className="rounded-md border border-line bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-400"
            >
              <span className="text-zinc-600">{spec.label}:</span>{" "}
              {spec.value}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between pt-6">
          <div>
            <p className="font-display text-xl font-bold text-white">
              {formatMoney(item.dayRate)}
              <span className="ml-1 text-xs font-normal text-zinc-500">/day</span>
            </p>
            <p className="text-xs text-zinc-500">
              or {formatMoney(item.weekRate)}/week
            </p>
          </div>
          <Link
            href={`/quote?equipment=${item.slug}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-medium text-zinc-200 transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-white"
          >
            Quote me
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-600">
          <CalendarDays className="h-3 w-3" />
          R{formatMoney(item.deposit)} refundable deposit · ID required
        </p>
      </div>
    </article>
  );
}
