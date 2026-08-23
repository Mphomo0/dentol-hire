"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Check } from "lucide-react";
import { Card } from "@/components/admin/ui";
import {
  formatMoney,
  formatMoneyPrecise,
  documentTotals,
  DEFAULT_VAT,
  type VatConfig,
} from "@/lib/format";
import type { Equipment, RateType } from "@/lib/types";

interface BuilderLine {
  key: string;
  equipmentId: string;
  description: string;
  qty: number;
  rateType: RateType;
  rate: number;
}

export interface BuilderCustomer {
  name: string;
  company: string;
  email: string;
  phone: string;
}

const inputCls =
  "h-10 w-full rounded-lg border border-line bg-white/[0.03] px-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-brand/50";

let lineSeq = 0;
const newKey = () => `line-${++lineSeq}-${Date.now()}`;

function blankLine(): BuilderLine {
  return {
    key: newKey(),
    equipmentId: "",
    description: "",
    qty: 1,
    rateType: "day",
    rate: 0,
  };
}

export function DocumentBuilder({
  mode,
  equipment,
  initialCustomer,
  notesLabel = "Notes",
  vat = DEFAULT_VAT,
}: {
  mode: "quote" | "invoice";
  equipment: Equipment[];
  initialCustomer?: Partial<BuilderCustomer>;
  notesLabel?: string;
  vat?: VatConfig;
}) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Required<BuilderCustomer>>({
    name: initialCustomer?.name ?? "",
    company: initialCustomer?.company ?? "",
    email: initialCustomer?.email ?? "",
    phone: initialCustomer?.phone ?? "",
  });
  const [lines, setLines] = useState<BuilderLine[]>([blankLine()]);
  const [notes, setNotes] = useState("");
  const [validDays, setValidDays] = useState(mode === "quote" ? 14 : 15);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(
    () =>
      documentTotals(
        lines.filter((l) => l.description && l.rate > 0),
        vat
      ),
    [lines, vat]
  );

  function updateLine(key: string, patch: Partial<BuilderLine>) {
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, ...patch } : l))
    );
  }

  function pickEquipment(lineKey: string, equipmentId: string) {
    const eq = equipment.find((e) => e.id === equipmentId);
    if (!eq) {
      updateLine(lineKey, { equipmentId: "", rate: 0 });
      return;
    }
    const line = lines.find((l) => l.key === lineKey);
    updateLine(lineKey, {
      equipmentId,
      description: eq.name,
      rate:
        line?.rateType === "week"
          ? eq.weekRate
          : eq.dayRate,
    });
  }

  function changeRateType(lineKey: string, rateType: RateType) {
    const line = lines.find((l) => l.key === lineKey);
    if (line?.equipmentId) {
      const eq = equipment.find((e) => e.id === line.equipmentId);
      if (eq) {
        updateLine(lineKey, { rateType, rate: rateType === "week" ? eq.weekRate : eq.dayRate });
        return;
      }
    }
    updateLine(lineKey, { rateType });
  }

  async function submit() {
    setError(null);

    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setError("Customer name, email and phone are required.");
      return;
    }
    const cleanLines = lines.filter((l) => l.description.trim() && l.rate > 0 && l.qty > 0);
    if (!cleanLines.length) {
      setError("Add at least one line item with a description and rate.");
      return;
    }

    setSaving(true);
    try {
      const payload =
        mode === "quote"
          ? {
              customer: { id: `cus-${Date.now()}`, ...customer },
              items: cleanLines.map((l) => ({
                equipmentId: l.equipmentId || null,
                description: l.description,
                qty: l.qty,
                rateType: l.rateType,
                rate: l.rate,
              })),
              validDays,
              notes,
            }
          : {
              customer: { id: `cus-${Date.now()}`, ...customer },
              items: cleanLines.map((l) => ({
                equipmentId: l.equipmentId || null,
                description: l.description,
                qty: l.qty,
                rateType: l.rateType,
                rate: l.rate,
              })),
              dueDays: validDays,
              notes,
            };

      const res = await fetch(`/api/${mode}s`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Save failed");
      }
      router.push(`/admin/${mode}s`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Customer */}
      <Card className="p-5">
        <h2 className="mb-4 font-display font-semibold text-white">Bill to</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            placeholder="Contact name *"
            className={inputCls}
          />
          <input
            value={customer.company}
            onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
            placeholder="Company"
            className={inputCls}
          />
          <input
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            placeholder="Email *"
            type="email"
            className={inputCls}
          />
          <input
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            placeholder="Phone *"
            className={inputCls}
          />
        </div>
      </Card>

      {/* Line items */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display font-semibold text-white">Line items</h2>
          <button
            type="button"
            onClick={() => setLines((p) => [...p, blankLine()])}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-xs font-semibold text-zinc-300 transition-colors hover:border-brand/50 hover:text-brand"
          >
            <Plus className="h-3.5 w-3.5" />
            Add item
          </button>
        </div>

        <div className="space-y-3">
          {lines.map((line, idx) => (
            <div
              key={line.key}
              className="grid items-center gap-2 rounded-xl border border-line bg-white/[0.02] p-3 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_72px_110px_120px_36px]"
            >
              <div className="sm:col-span-2 lg:col-span-1">
                <select
                  value={line.equipmentId}
                  onChange={(e) => pickEquipment(line.key, e.target.value)}
                  className={`${inputCls} mb-2`}
                >
                  <option value="">— Custom / catalog —</option>
                  {equipment.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name}
                    </option>
                  ))}
                </select>
                <input
                  value={line.description}
                  onChange={(e) => updateLine(line.key, { description: e.target.value })}
                  placeholder={`Description ${idx + 1}`}
                  className={inputCls}
                />
              </div>

              <div className="text-xs text-zinc-600 sm:col-span-2 lg:col-span-1">
                Qty &amp; rate
              </div>
              <input
                type="number"
                min={1}
                max={99}
                value={line.qty}
                onChange={(e) => updateLine(line.key, { qty: Number(e.target.value) })}
                className={`${inputCls} text-center`}
                aria-label="Quantity"
              />
              <select
                value={line.rateType}
                onChange={(e) => changeRateType(line.key, e.target.value as RateType)}
                className={inputCls}
                aria-label="Rate type"
              >
                <option value="day">/ day</option>
                <option value="week">/ week</option>
              </select>
              <input
                type="number"
                min={0}
                step={50}
                value={line.rate || ""}
                onChange={(e) => updateLine(line.key, { rate: Number(e.target.value) })}
                placeholder="Rate R"
                className={`${inputCls} text-right`}
                aria-label="Rate"
              />
              <button
                type="button"
                onClick={() => setLines((p) => p.filter((l) => l.key !== line.key))}
                disabled={lines.length === 1}
                aria-label="Remove line"
                className="mx-auto grid h-8 w-8 place-items-center rounded-lg text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30 sm:col-span-2 lg:col-span-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 ml-auto max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatMoneyPrecise(totals.subtotal)}</span>
          </div>
          {vat.enabled && (
            <div className="flex justify-between text-zinc-400">
              <span>VAT @ {vat.rate}%</span>
              <span className="tabular-nums">{formatMoneyPrecise(totals.vat)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-line pt-2 font-display text-base font-bold text-white">
            <span>Total</span>
            <span className="tabular-nums">{formatMoney(totals.total)}</span>
          </div>
        </div>
      </Card>

      {/* Terms */}
      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
          <div>
            <label htmlFor="db-valid" className="mb-2 block text-sm font-medium text-zinc-300">
              {mode === "quote" ? "Valid for (days)" : "Payment due (days)"}
            </label>
            <input
              id="db-valid"
              type="number"
              min={1}
              max={120}
              value={validDays}
              onChange={(e) => setValidDays(Number(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="db-notes" className="mb-2 block text-sm font-medium text-zinc-300">
              {notesLabel}
            </label>
            <textarea
              id="db-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Delivery, deposit terms, payment details…"
              className={`${inputCls} h-auto resize-none py-2.5`}
            />
          </div>
        </div>
      </Card>

      {error && (
        <p className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-soft px-8 font-semibold text-white shadow-[0_0_28px_rgba(0,121,245,0.4)] transition-all hover:shadow-[0_0_40px_rgba(0,121,245,0.55)] disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Create {mode}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="h-12 rounded-full border border-line px-6 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
