import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  CalendarClock,
  FileText,
  Inbox,
  PackageOpen,
} from "lucide-react";
import {
  Card,
  PageHeader,
  StatCard,
} from "@/components/admin/ui";
import {
  formatDate,
  formatMoney,
  rentalStatus,
  RENTAL_STATUS_META,
  daysBetween,
} from "@/lib/format";
import { store } from "@/lib/store";

export default function AdminDashboard() {
  const rentals = store.rentals;
  const requests = store.quoteRequests;
  const quotes = store.quotes;
  const invoices = store.invoices;

  const openRentals = rentals.filter((r) => !r.returnedDate);
  const overdue = openRentals.filter((r) => rentalStatus(r) === "overdue");
  const newRequests = requests.filter((r) => r.status === "new");

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const revenueThisMonth = invoices
    .filter(
      (i) =>
        new Date(i.issueDate).getTime() >= monthStart.getTime() &&
        i.status !== "draft"
    )
    .reduce(
      (sum, i) => sum + i.items.reduce((s, l) => s + l.qty * l.rate, 0),
      0
    );

  const dueBack = [...openRentals]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`${new Date().toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · Wynberg yard`}
        action={
          <Link
            href="/admin/quotes/new"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,121,245,0.35)] transition-colors hover:bg-brand-soft"
          >
            <FileText className="h-4 w-4" />
            New quote
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={PackageOpen}
          label="On hire right now"
          value={openRentals.length}
          hint="open contracts"
        />
        <StatCard
          icon={AlertTriangle}
          label="Overdue returns"
          value={overdue.length}
          tone={overdue.length ? "danger" : "signal"}
          hint={overdue.length ? "chase up" : "all clear"}
        />
        <StatCard
          icon={Inbox}
          label="New quote requests"
          value={newRequests.length}
          tone="volt"
          hint="awaiting reply"
        />
        <StatCard
          icon={Banknote}
          label="Revenue this month"
          value={formatMoney(revenueThisMonth)}
          tone="signal"
          hint="excl. VAT"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="flex items-center gap-2 font-display font-semibold text-white">
              <CalendarClock className="h-4.5 w-4.5 text-volt" />
              Due back next
            </h2>
            <Link
              href="/admin/rentals"
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-volt"
            >
              All rentals <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <ul className="divide-y divide-line">
            {dueBack.map((rental) => {
              const status = rentalStatus(rental);
              const meta = RENTAL_STATUS_META[status];
              const days = daysBetween(rental.dueDate, new Date());
              return (
                <li
                  key={rental.id}
                  className="flex flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {rental.customer.company || rental.customer.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-zinc-600">
                      {rental.reference} ·{" "}
                      {rental.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${meta.className}`}
                  >
                    {days < 0 ? `${Math.abs(days)}d late` : days === 0 ? "today" : `${days}d`}
                  </span>
                  <span className="w-20 text-right text-xs tabular-nums text-zinc-400">
                    {formatDate(rental.dueDate).slice(0, 6)}
                  </span>
                </li>
              );
            })}
            {dueBack.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-zinc-600">
                Nothing on hire — the yard is quiet.
              </li>
            )}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="flex items-center gap-2 font-display font-semibold text-white">
              <Inbox className="h-4.5 w-4.5 text-brand" />
              Latest requests
            </h2>
            <Link
              href="/admin/quote-requests"
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-brand"
            >
              Inbox <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {requests.slice(0, 4).map((req) => (
              <li key={req.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium text-white">
                    {req.company ? `${req.company} — ${req.name}` : req.name}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      req.status === "new"
                        ? "bg-volt/15 text-volt"
                        : "bg-white/8 text-zinc-500"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-zinc-500">
                  {req.itemNotes}
                </p>
              </li>
            ))}
            {requests.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-zinc-600">
                No requests yet.
              </li>
            )}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/quotes" className="group">
          <Card className="flex items-center justify-between p-5 transition-all group-hover:border-brand/40 group-hover:bg-brand/[0.04]">
            <div>
              <p className="font-display text-xl font-bold text-white">{quotes.length}</p>
              <p className="text-xs text-zinc-500">Quotes total</p>
            </div>
            <FileText className="h-5 w-5 text-zinc-700 transition-colors group-hover:text-brand" />
          </Card>
        </Link>
        <Link href="/admin/invoices" className="group">
          <Card className="flex items-center justify-between p-5 transition-all group-hover:border-signal/40 group-hover:bg-signal/[0.04]">
            <div>
              <p className="font-display text-xl font-bold text-white">{invoices.length}</p>
              <p className="text-xs text-zinc-500">Invoices total</p>
            </div>
            <Banknote className="h-5 w-5 text-zinc-700 transition-colors group-hover:text-signal" />
          </Card>
        </Link>
        <Link href="/fleet" className="group">
          <Card className="flex items-center justify-between p-5 transition-all group-hover:border-volt/40 group-hover:bg-volt/[0.04]">
            <div>
              <p className="font-display text-xl font-bold text-white">Fleet</p>
              <p className="text-xs text-zinc-500">Public catalogue</p>
            </div>
            <ArrowRight className="h-5 w-5 text-zinc-700 transition-colors group-hover:text-volt" />
          </Card>
        </Link>
      </div>
    </>
  );
}
