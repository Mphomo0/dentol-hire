"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "./animate-presence";
import { CATEGORY_ICONS } from "@/components/marketing/equipment-card";
import { EquipmentCard } from "@/components/marketing/equipment-card";
import type { Category, Equipment } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

const FILTERS: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "All" },
  ...(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(
    ([key, label]) => ({ key, label })
  ),
];

export function FleetExplorer({
  equipment,
  initialCategory,
}: {
  equipment: Equipment[];
  initialCategory: Category | "all";
}) {
  const [filter, setFilter] = useState<Category | "all">(initialCategory);
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filtered = useMemo(
    () =>
      filter === "all"
        ? equipment
        : equipment.filter((e) => e.category === filter),
    [equipment, filter]
  );

  const changeFilter = (key: Category | "all") => {
    setFilter(key);
    const qs = key === "all" ? "" : `?category=${key}`;
    router.replace(`/fleet${qs}`, { scroll: false });
  };

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-2">
        {FILTERS.map(({ key, label }) => {
          const Icon =
            key === "all" ? null : CATEGORY_ICONS[key as Category];
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => changeFilter(key)}
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-all ${
                active
                  ? "border-brand bg-brand text-white shadow-[0_0_24px_rgba(0,121,245,0.4)]"
                  : "border-line bg-surface text-zinc-400 hover:border-zinc-600 hover:text-white"
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {label}
            </button>
          );
        })}
      </div>

      <div ref={gridRef}>
        <AnimatePresence dep={filter}>
          <div
            key={filter}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </div>
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="py-20 text-center text-zinc-500">
          Nothing in this category yet — try another tab.
        </p>
      )}
    </div>
  );
}
