import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PrintButton } from "@/components/admin/print-button";
import { store } from "@/lib/store";
import { documentTotals, formatDate, formatMoneyPrecise } from "@/lib/format";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = store.invoices.find((i) => i.id === id);
  if (!invoice) notFound();

  const settings = store.settings;
  const totals = documentTotals(invoice.items, {
    enabled: settings.vatEnabled,
    rate: settings.vatRate,
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="no-print mb-6 flex items-center justify-between">
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to invoices
        </Link>
        <PrintButton />
      </div>

      {/* Printable sheet */}
      <article className="print-sheet rounded-2xl border border-line bg-white p-8 text-[#111] shadow-2xl sm:p-12">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-[#0079f5] pb-8">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo/logo.png"
              alt="Dantol Hire"
              className="h-9 w-auto"
            />
            <p className="mt-2 max-w-[240px] text-xs leading-relaxed text-neutral-500">
              {settings.address}
              <br />
              {settings.emails.join(" · ")} · {settings.phone}
              {settings.vatEnabled && settings.vatNumber && (
                <>
                  <br />
                  VAT No. {settings.vatNumber}
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#0079f5]">
              Tax Invoice
            </h1>
            <p className="mt-2 font-mono text-sm font-semibold">{invoice.number}</p>
            <p className="mt-3 text-xs text-neutral-500">
              Issued: {formatDate(invoice.issueDate)}
              <br />
              Due: {formatDate(invoice.dueDate)}
            </p>
            <span className="mt-3 inline-block rounded-full border border-neutral-300 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest">
              {invoice.status}
            </span>
          </div>
        </header>

        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Bill to
            </p>
            <p className="mt-2 font-semibold">{invoice.customer.company || invoice.customer.name}</p>
            <p className="text-sm text-neutral-600">
              {invoice.customer.name}
              <br />
              {invoice.customer.email}
              <br />
              {invoice.customer.phone}
            </p>
          </div>
        </section>

        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-300 text-[10px] uppercase tracking-widest text-neutral-500">
              <th className="py-2 font-bold">Description</th>
              <th className="py-2 text-right font-bold">Qty</th>
              <th className="py-2 text-right font-bold">Rate</th>
              <th className="py-2 text-right font-bold">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {invoice.items.map((line) => (
              <tr key={line.id}>
                <td className="py-3 pr-4">
                  {line.description}
                  <span className="block text-xs text-neutral-500">
                    per {line.rateType}
                  </span>
                </td>
                <td className="py-3 text-right tabular-nums">{line.qty}</td>
                <td className="py-3 text-right tabular-nums">
                  {formatMoneyPrecise(line.rate)}
                </td>
                <td className="py-3 text-right tabular-nums">
                  {formatMoneyPrecise(line.qty * line.rate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 ml-auto w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatMoneyPrecise(totals.subtotal)}</span>
          </div>
          {settings.vatEnabled && (
            <div className="flex justify-between text-neutral-600">
              <span>VAT @ {settings.vatRate}%</span>
              <span className="tabular-nums">{formatMoneyPrecise(totals.vat)}</span>
            </div>
          )}
          <div className="flex justify-between border-t-2 border-[#111] pt-2 text-base font-bold">
            <span>Total due</span>
            <span className="tabular-nums">{formatMoneyPrecise(totals.total)}</span>
          </div>
        </div>

        <footer className="mt-10 border-t border-neutral-200 pt-5 text-xs leading-relaxed text-neutral-500">
          {invoice.notes && <p className="mb-2">{invoice.notes}</p>}
          <p>
            Banking: FNB · Dantol Hire (Pty) Ltd · Acc 62•• •••789 · Branch
            250655 · Ref {invoice.number}. This is a computer-generated{" "}
            {invoice.quoteId ? "invoice generated from an accepted quote" : "tax invoice"}.
          </p>
        </footer>
      </article>
    </div>
  );
}
