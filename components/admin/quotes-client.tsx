"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Banknote,
  Check,
  FileText,
  Send,
  X,
} from "lucide-react";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { documentTotals, formatDate, formatMoney, type VatConfig } from "@/lib/format";
import type { Quote, QuoteStatus } from "@/lib/types";

const STATUS_STYLES: Record<QuoteStatus, string> = {
  draft: "bg-white/8 text-zinc-400 border-line",
  sent: "bg-brand/10 text-brand-soft border-brand/25",
  accepted: "bg-signal/10 text-signal border-signal/25",
  declined: "bg-red-500/10 text-red-400 border-red-500/25",
};

export function QuotesClient({
  initialQuotes,
  vat,
}: {
  initialQuotes: Quote[];
  vat: VatConfig;
}) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: QuoteStatus) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
      }
    } finally {
      setBusyId(null);
    }
  }

  const sorted = useMemo(
    () => [...quotes].sort((a, b) => b.issueDate.localeCompare(a.issueDate)),
    [quotes]
  );

  return (
    <>
      <PageHeader
        title="Quotes"
        subtitle="Draft, send and track customer quotes."
        action={
          <Link
            href="/admin/quotes/new"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-volt px-5 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_24px_rgba(207,233,0,0.4)]"
          >
            <FileText className="h-4 w-4" />
            New quote
          </Link>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No quotes yet"
          text="Create one manually or convert a website request."
        />
      ) : (
        <>
          {/* Mobile & tablet: stacked cards */}
          <div className="grid gap-3 lg:hidden">
            {sorted.map((quote) => {
              const totals = documentTotals(quote.items, vat);
              return (
                <Card key={quote.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs font-semibold text-brand-soft">
                        {quote.number}
                      </p>
                      <p className="mt-1 font-medium text-white">
                        {quote.customer.company || quote.customer.name}
                      </p>
                      <p className="text-xs text-zinc-600">{quote.customer.email}</p>
                    </div>
                    <Badge className={STATUS_STYLES[quote.status]}>{quote.status}</Badge>
                  </div>

                  <p className="mt-3 truncate border-t border-line pt-3 text-sm text-zinc-300">
                    {quote.items.map((i) => i.description).join(", ")}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-sm">
                    <div className="flex gap-5">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-zinc-600">
                          Issued
                        </p>
                        <p className="tabular-nums text-zinc-300">
                          {formatDate(quote.issueDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-zinc-600">
                          Valid until
                        </p>
                        <p className="tabular-nums text-zinc-300">
                          {formatDate(quote.validUntil)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-zinc-600">
                          Total
                        </p>
                        <p className="font-display font-bold tabular-nums text-white">
                          {formatMoney(totals.total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end gap-1.5 border-t border-line pt-3">
                    <QuoteActions
                      quote={quote}
                      busyId={busyId}
                      setStatus={setStatus}
                    />
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Desktop: table */}
          <Card className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-widest text-zinc-600">
                  <th className="px-5 py-3.5 font-semibold">Quote</th>
                  <th className="px-4 py-3.5 font-semibold">Customer</th>
                  <th className="px-4 py-3.5 font-semibold">Items</th>
                  <th className="px-4 py-3.5 font-semibold">Issued</th>
                  <th className="px-4 py-3.5 font-semibold">Valid until</th>
                  <th className="px-4 py-3.5 text-right font-semibold">Total (incl.)</th>
                  <th className="px-4 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sorted.map((quote) => {
                  const totals = documentTotals(quote.items, vat);
                  return (
                    <tr key={quote.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-brand-soft">
                        {quote.number}
                      </td>
                      <td className="max-w-[170px] px-4 py-4">
                        <p className="truncate font-medium text-white">
                          {quote.customer.company || quote.customer.name}
                        </p>
                        <p className="truncate text-xs text-zinc-600">{quote.customer.email}</p>
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-4 text-zinc-300">
                        {quote.items.map((i) => i.description).join(", ")}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 tabular-nums text-zinc-400">
                        {formatDate(quote.issueDate)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 tabular-nums text-zinc-400">
                        {formatDate(quote.validUntil)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right font-display font-bold tabular-nums text-white">
                        {formatMoney(totals.total)}
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={STATUS_STYLES[quote.status]}>{quote.status}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1.5">
                          <QuoteActions
                            quote={quote}
                            busyId={busyId}
                            setStatus={setStatus}
                          />
                        </div>
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

function QuoteActions({
  quote,
  busyId,
  setStatus,
}: {
  quote: Quote;
  busyId: string | null;
  setStatus: (id: string, status: QuoteStatus) => void;
}) {
  return (
    <>
      {quote.status === "draft" && (
        <button
          type="button"
          disabled={busyId === quote.id}
          onClick={() => setStatus(quote.id, "sent")}
          className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-soft disabled:opacity-50"
        >
          <Send className="h-3 w-3" /> Send
        </button>
      )}
      {quote.status === "sent" && (
        <>
          <button
            type="button"
            disabled={busyId === quote.id}
            onClick={() => setStatus(quote.id, "accepted")}
            aria-label="Mark accepted"
            className="inline-flex items-center gap-1 rounded-full border border-signal/30 bg-signal/10 px-3 py-1.5 text-xs font-semibold text-signal hover:bg-signal hover:text-black disabled:opacity-50"
          >
            <Check className="h-3 w-3" /> Accept
          </button>
          <button
            type="button"
            disabled={busyId === quote.id}
            onClick={() => setStatus(quote.id, "declined")}
            aria-label="Mark declined"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/15 disabled:opacity-50"
          >
            <X className="h-3 w-3" />
          </button>
        </>
      )}
      {quote.status === "accepted" && <ConvertButton quote={quote} />}
      {(quote.status === "declined" || quote.status === "accepted") && (
        <span className="self-center px-1 text-[11px] text-zinc-600">closed</span>
      )}
    </>
  );
}

function ConvertButton({ quote }: { quote: Quote }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function convert() {
    setBusy(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: quote.customer,
          items: quote.items.map(({ equipmentId, description, qty, rateType, rate }) => ({
            equipmentId,
            description,
            qty,
            rateType,
            rate,
          })),
          dueDays: 15,
          quoteId: quote.id,
          notes: quote.notes,
        }),
      });
      if (res.ok) {
        router.push("/admin/invoices");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={convert}
      className="inline-flex items-center gap-1 rounded-full border border-volt/40 bg-volt/10 px-3 py-1.5 text-xs font-semibold text-volt transition-colors hover:bg-volt hover:text-black disabled:opacity-50"
    >
      <Banknote className="h-3 w-3" /> To invoice
    </button>
  );
}
