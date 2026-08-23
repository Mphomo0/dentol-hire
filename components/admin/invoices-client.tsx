"use client";

import { useState } from "react";
import { Banknote, FileText, Printer, Truck } from "lucide-react";
import Link from "next/link";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { ConvertToRentalModal } from "@/components/admin/convert-to-rental-modal";
import { documentTotals, formatDate, formatMoney, type VatConfig } from "@/lib/format";
import type { Invoice, InvoiceStatus, Rental } from "@/lib/types";

const STATUS_STYLES: Record<InvoiceStatus, string> = {
  draft: "bg-white/8 text-zinc-400 border-line",
  sent: "bg-brand/10 text-brand-soft border-brand/25",
  paid: "bg-signal/10 text-signal border-signal/25",
  overdue: "bg-red-500/10 text-red-400 border-red-500/25",
};

export function InvoicesClient({
  initialInvoices,
  initialRentals,
  vat,
}: {
  initialInvoices: Invoice[];
  initialRentals: Rental[];
  vat: VatConfig;
}) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [rentals, setRentals] = useState<Rental[]>(initialRentals);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [converting, setConverting] = useState<Invoice | null>(null);

  const rentalByInvoiceId = new Map(
    rentals.filter((r) => r.invoiceId).map((r) => [r.invoiceId, r])
  );

  async function setStatus(id: string, status: InvoiceStatus) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
      }
    } finally {
      setBusyId(null);
    }
  }

  const sorted = [...invoices].sort((a, b) =>
    b.issueDate.localeCompare(a.issueDate)
  );

  return (
    <>
      <PageHeader
        title="Invoices"
        subtitle="Billing and payment tracking."
        action={
          <Link
            href="/admin/invoices/new"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-volt px-5 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_24px_rgba(207,233,0,0.4)]"
          >
            <FileText className="h-4 w-4" />
            New invoice
          </Link>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon={Banknote}
          title="No invoices yet"
          text="Convert an accepted quote or create one from scratch."
        />
      ) : (
        <>
          {/* Mobile & tablet: stacked cards */}
          <div className="grid gap-3 lg:hidden">
            {sorted.map((inv) => {
              const totals = documentTotals(inv.items, vat);
              return (
                <Card key={inv.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className="font-mono text-xs font-semibold text-brand-soft hover:underline"
                      >
                        {inv.number}
                      </Link>
                      <p className="mt-1 font-medium text-white">
                        {inv.customer.company || inv.customer.name}
                      </p>
                    </div>
                    <Badge className={STATUS_STYLES[inv.status]}>{inv.status}</Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-sm">
                    <div className="flex gap-5">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-zinc-600">
                          Issued
                        </p>
                        <p className="tabular-nums text-zinc-300">
                          {formatDate(inv.issueDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-zinc-600">
                          Due
                        </p>
                        <p className="tabular-nums text-zinc-300">
                          {formatDate(inv.dueDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-zinc-600">
                          Total (incl.)
                        </p>
                        <p className="font-display font-bold tabular-nums text-white">
                          {formatMoney(totals.total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap justify-end gap-1.5 border-t border-line pt-3">
                    <InvoiceActions
                      inv={inv}
                      busyId={busyId}
                      setStatus={setStatus}
                      hasRental={rentalByInvoiceId.has(inv.id)}
                      onConvert={() => setConverting(inv)}
                    />
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Desktop: table */}
          <Card className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-widest text-zinc-600">
                  <th className="px-5 py-3.5 font-semibold">Invoice</th>
                  <th className="px-4 py-3.5 font-semibold">Customer</th>
                  <th className="px-4 py-3.5 font-semibold">Issued</th>
                  <th className="px-4 py-3.5 font-semibold">Due</th>
                  <th className="px-4 py-3.5 text-right font-semibold">Total (incl.)</th>
                  <th className="px-4 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sorted.map((inv) => {
                  const totals = documentTotals(inv.items, vat);
                  return (
                    <tr key={inv.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="whitespace-nowrap px-5 py-4">
                        <Link
                          href={`/admin/invoices/${inv.id}`}
                          className="font-mono text-xs font-semibold text-brand-soft hover:underline"
                        >
                          {inv.number}
                        </Link>
                      </td>
                      <td className="max-w-[180px] truncate px-4 py-4 font-medium text-white">
                        {inv.customer.company || inv.customer.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 tabular-nums text-zinc-400">
                        {formatDate(inv.issueDate)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 tabular-nums text-zinc-400">
                        {formatDate(inv.dueDate)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right font-display font-bold tabular-nums text-white">
                        {formatMoney(totals.total)}
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={STATUS_STYLES[inv.status]}>{inv.status}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1.5">
                          <InvoiceActions
                            inv={inv}
                            busyId={busyId}
                            setStatus={setStatus}
                            hasRental={rentalByInvoiceId.has(inv.id)}
                            onConvert={() => setConverting(inv)}
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

      {converting && (
        <ConvertToRentalModal
          invoice={converting}
          onClose={() => setConverting(null)}
          onConverted={(rental) => {
            setRentals((prev) => [rental, ...prev]);
            setConverting(null);
          }}
        />
      )}
    </>
  );
}

function InvoiceActions({
  inv,
  busyId,
  setStatus,
  hasRental,
  onConvert,
}: {
  inv: Invoice;
  busyId: string | null;
  setStatus: (id: string, status: InvoiceStatus) => void;
  hasRental: boolean;
  onConvert: () => void;
}) {
  return (
    <>
      {inv.status === "draft" && (
        <button
          type="button"
          disabled={busyId === inv.id}
          onClick={() => setStatus(inv.id, "sent")}
          className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-soft disabled:opacity-50"
        >
          Send
        </button>
      )}
      {(inv.status === "sent" || inv.status === "overdue") && (
        <button
          type="button"
          disabled={busyId === inv.id}
          onClick={() => setStatus(inv.id, "paid")}
          className="rounded-full border border-signal/30 bg-signal/10 px-3 py-1.5 text-xs font-semibold text-signal transition-colors hover:bg-signal hover:text-black disabled:opacity-50"
        >
          Mark paid
        </button>
      )}
      {inv.status === "paid" &&
        (hasRental ? (
          <Link
            href="/admin/rentals"
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-brand/40 hover:text-brand"
          >
            <Truck className="h-3.5 w-3.5" />
            View rental
          </Link>
        ) : (
          <button
            type="button"
            onClick={onConvert}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand-soft transition-colors hover:bg-brand hover:text-white"
          >
            <Truck className="h-3.5 w-3.5" />
            Convert to rental
          </button>
        ))}
      <Link
        href={`/admin/invoices/${inv.id}`}
        aria-label="View printable invoice"
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-line text-zinc-400 transition-colors hover:border-brand/40 hover:text-brand"
      >
        <Printer className="h-3.5 w-3.5" />
      </Link>
    </>
  );
}
