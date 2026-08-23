"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, PackageOpen, Search } from "lucide-react";
import { Card, EmptyState, PageHeader } from "@/components/admin/ui";
import {
  daysBetween,
  formatDate,
  formatMoney,
  rentalStatus,
  RENTAL_STATUS_META,
} from "@/lib/format";
import type { Rental, RentalStatus } from "@/lib/types";
import { Badge } from "@/components/admin/ui";

type Filter = RentalStatus | "all";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "On hire" },
  { key: "due-soon", label: "Due soon" },
  { key: "overdue", label: "Overdue" },
  { key: "returned", label: "Returned" },
];

export function RentalsClient({ initialRentals }: { initialRentals: Rental[] }) {
  const [rentals, setRentals] = useState<Rental[]>(initialRentals);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rentals
      .filter((r) => (filter === "all" ? true : rentalStatus(r) === filter))
      .filter((r) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          r.reference.toLowerCase().includes(q) ||
          r.customer.name.toLowerCase().includes(q) ||
          r.customer.company.toLowerCase().includes(q) ||
          r.items.some((i) => i.name.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        const rank = { overdue: 0, "due-soon": 1, active: 2, returned: 3 };
        const ra = rentalStatus(a);
        const rb = rentalStatus(b);
        if (rank[ra] !== rank[rb]) return rank[ra] - rank[rb];
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [rentals, filter, query]);

  async function markReturned(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/rentals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-returned" }),
      });
      if (res.ok) {
        const updated: Rental = await res.json();
        setRentals((prev) =>
          prev.map((r) => (r.id === id ? updated : r))
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Rentals"
        subtitle="Track every contract — what's out, when it's due back."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`h-9 rounded-full px-4 text-xs font-semibold uppercase tracking-wide transition-all ${
                filter === key
                  ? "bg-white/10 text-white ring-1 ring-inset ring-white/20"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reference, customer or item…"
            className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-brand/50 sm:w-80"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No rentals match"
          text="Try another filter or clear the search."
        />
      ) : (
        <>
          {/* Mobile & tablet: stacked cards */}
          <div className="grid gap-3 lg:hidden">
            {filtered.map((rental) => {
              const status = rentalStatus(rental);
              const meta = RENTAL_STATUS_META[status];
              const days = daysBetween(rental.dueDate, new Date());
              const total = rental.items.reduce(
                (s, i) => s + i.qty * i.rate,
                0
              );
              return (
                <Card key={rental.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs font-semibold text-brand-soft">
                        {rental.reference}
                      </p>
                      <p className="mt-1 font-medium text-white">
                        {rental.customer.company || rental.customer.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {rental.customer.phone}
                      </p>
                    </div>
                    <Badge className={meta.className}>{meta.label}</Badge>
                  </div>

                  <div className="mt-3 border-t border-line pt-3">
                    <p className="text-sm text-zinc-300">
                      {rental.items.map((i) => i.name).join(", ")}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-600">
                      {rental.items.map((i) => `×${i.qty}`).join(" · ")},{" "}
                      {rental.items[0]?.rateType}ly rate ·{" "}
                      {formatMoney(total)}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-sm">
                    <div className="flex gap-5">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-zinc-600">
                          Out
                        </p>
                        <p className="tabular-nums text-zinc-300">
                          {formatDate(rental.startDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-zinc-600">
                          Due back
                        </p>
                        <p className="tabular-nums text-zinc-200">
                          {formatDate(rental.dueDate)}
                        </p>
                        {!rental.returnedDate && (
                          <p
                            className={`text-[11px] ${
                              days < 0
                                ? "text-red-400"
                                : days <= 2
                                  ? "text-volt"
                                  : "text-zinc-600"
                            }`}
                          >
                            {days < 0
                              ? `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} late`
                              : days === 0
                                ? "Due today"
                                : `${days} days left`}
                          </p>
                        )}
                        {rental.returnedDate && (
                          <p className="text-[11px] text-signal">
                            In {formatDate(rental.returnedDate).slice(0, 6)}
                          </p>
                        )}
                      </div>
                    </div>

                    {!rental.returnedDate ? (
                      <button
                        type="button"
                        disabled={busyId === rental.id}
                        onClick={() => markReturned(rental.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1.5 text-xs font-semibold text-signal transition-all hover:bg-signal hover:text-black disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Mark returned
                      </button>
                    ) : (
                      <span className="text-xs text-zinc-600">Closed</span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Desktop: table */}
          <Card className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-widest text-zinc-600">
                  <th className="px-5 py-3.5 font-semibold">Contract</th>
                  <th className="px-4 py-3.5 font-semibold">Customer</th>
                  <th className="px-4 py-3.5 font-semibold">Items</th>
                  <th className="px-4 py-3.5 font-semibold">Out</th>
                  <th className="px-4 py-3.5 font-semibold">Due back</th>
                  <th className="px-4 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((rental) => {
                  const status = rentalStatus(rental);
                  const meta = RENTAL_STATUS_META[status];
                  const days = daysBetween(rental.dueDate, new Date());
                  const total = rental.items.reduce(
                    (s, i) => s + i.qty * i.rate,
                    0
                  );
                  return (
                    <tr
                      key={rental.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs font-semibold text-brand-soft">
                          {rental.reference}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {formatMoney(total)}
                        </p>
                      </td>
                      <td className="max-w-[180px] px-4 py-4">
                        <p className="truncate font-medium text-white">
                          {rental.customer.company || rental.customer.name}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          {rental.customer.phone}
                        </p>
                      </td>
                      <td className="max-w-[220px] px-4 py-4">
                        <p className="truncate text-zinc-300">
                          {rental.items.map((i) => i.name).join(", ")}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-600">
                          {rental.items.map((i) => `×${i.qty}`).join(" · ")},{" "}
                          {rental.items[0]?.rateType}ly rate
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 tabular-nums text-zinc-400">
                        {formatDate(rental.startDate)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <p className="tabular-nums text-zinc-200">
                          {formatDate(rental.dueDate)}
                        </p>
                        {!rental.returnedDate && (
                          <p
                            className={`text-[11px] ${
                              days < 0
                                ? "text-red-400"
                                : days <= 2
                                  ? "text-volt"
                                  : "text-zinc-600"
                            }`}
                          >
                            {days < 0
                              ? `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} late`
                              : days === 0
                                ? "Due today"
                                : `${days} days left`}
                          </p>
                        )}
                        {rental.returnedDate && (
                          <p className="text-[11px] text-signal">
                            In {formatDate(rental.returnedDate).slice(0, 6)}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={meta.className}>{meta.label}</Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {!rental.returnedDate ? (
                          <button
                            type="button"
                            disabled={busyId === rental.id}
                            onClick={() => markReturned(rental.id)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1.5 text-xs font-semibold text-signal transition-all hover:bg-signal hover:text-black disabled:opacity-50"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Mark returned
                          </button>
                        ) : (
                          <span className="text-xs text-zinc-600">Closed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </>
  );
}
