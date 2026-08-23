"use client";

import { useState } from "react";
import { Loader2, Truck, X } from "lucide-react";
import type { Invoice, Rental } from "@/lib/types";

const inputCls =
  "h-10 w-full rounded-lg border border-line bg-white/[0.03] px-3 text-sm text-white outline-none transition-colors focus:border-brand/50";

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

function inDaysInput(days: number) {
  return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
}

export function ConvertToRentalModal({
  invoice,
  onClose,
  onConverted,
}: {
  invoice: Invoice;
  onClose: () => void;
  onConverted: (rental: Rental) => void;
}) {
  const [startDate, setStartDate] = useState(todayInput());
  const [dueDate, setDueDate] = useState(inDaysInput(7));
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/invoices/${invoice.id}/convert-to-rental`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ startDate, dueDate, notes }),
        }
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error ?? "Conversion failed");
      }
      onConverted(body as Rental);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-white">
              <Truck className="h-5 w-5 text-signal" />
              Convert to rental
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {invoice.number} · {invoice.customer.company || invoice.customer.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-4 text-sm text-zinc-500">
          Payment&apos;s in — set when the equipment actually goes out and
          when it&apos;s due back. These don&apos;t have to be today.
        </p>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Dispatch date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Due back
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Notes (optional)
            </label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. deliver to site gate 2"
              className={inputCls}
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_24px_rgba(56,212,93,0.4)] disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Create rental
          </button>
        </div>
      </div>
    </div>
  );
}
