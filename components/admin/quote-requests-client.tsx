"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  CalendarDays,
  Eye,
  FileText,
  Inbox,
  Mail,
  Phone,
} from "lucide-react";
import { Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { formatDate, formatDateTime } from "@/lib/format";
import { CATEGORY_LABELS, type QuoteRequest } from "@/lib/types";

const STATUS_STYLES = {
  new: "bg-volt/15 text-volt",
  reviewed: "bg-brand/15 text-brand-soft",
  converted: "bg-signal/15 text-signal",
  archived: "bg-white/8 text-zinc-500",
} as const;

export function QuoteRequestsClient({
  initialRequests,
}: {
  initialRequests: QuoteRequest[];
}) {
  const [requests, setRequests] = useState<QuoteRequest[]>(initialRequests);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialRequests[0]?.id ?? null
  );
  const router = useRouter();

  const selected = requests.find((r) => r.id === selectedId) ?? null;

  async function setStatus(id: string, status: QuoteRequest["status"]) {
    const res = await fetch(`/api/quote-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    }
  }

  return (
    <>
      <PageHeader
        title="Quote Requests"
        subtitle="Enquiries from the website quote form."
      />

      {requests.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Inbox zero"
          text="New website enquiries will appear here."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-[280px_1fr] lg:grid-cols-[360px_1fr] xl:grid-cols-[420px_1fr]">
          <Card className="divide-y divide-line overflow-hidden">
            {requests.map((req) => (
              <button
                key={req.id}
                type="button"
                onClick={() => setSelectedId(req.id)}
                className={`block w-full px-5 py-4 text-left transition-colors ${
                  selectedId === req.id
                    ? "bg-brand/[0.07]"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium text-white">
                    {req.company || req.name}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[req.status]}`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                  {req.itemNotes}
                </p>
                <p className="mt-2 text-[11px] tabular-nums text-zinc-600">
                  {formatDateTime(req.createdAt)}
                </p>
              </button>
            ))}
          </Card>

          {selected && (
            <Card className="self-start">
              <div className="border-b border-line px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">
                      {selected.name}
                      {selected.company && (
                        <span className="text-zinc-500"> · {selected.company}</span>
                      )}
                    </h2>
                    <p className="mt-1 text-xs text-zinc-600">
                      Received {formatDateTime(selected.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${STATUS_STYLES[selected.status]}`}
                  >
                    {selected.status}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <a
                    href={`mailto:${selected.email}`}
                    className="inline-flex items-center gap-2 text-zinc-300 hover:text-brand"
                  >
                    <Mail className="h-4 w-4 text-zinc-600" />
                    {selected.email}
                  </a>
                  <a
                    href={`tel:${selected.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 text-zinc-300 hover:text-brand"
                  >
                    <Phone className="h-4 w-4 text-zinc-600" />
                    {selected.phone}
                  </a>
                </div>
              </div>

              <div className="space-y-5 px-6 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
                    Interested in
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selected.interests.map((i) => (
                      <span
                        key={i}
                        className="rounded-md border border-line bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-300"
                      >
                        {CATEGORY_LABELS[i]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-line bg-white/[0.02] p-3.5">
                    <CalendarDays className="h-4 w-4 text-volt" />
                    <p className="mt-2 text-[11px] uppercase tracking-wide text-zinc-600">
                      Start date
                    </p>
                    <p className="text-sm font-medium tabular-nums text-white">
                      {formatDate(selected.startDate)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-white/[0.02] p-3.5">
                    <Eye className="h-4 w-4 text-brand" />
                    <p className="mt-2 text-[11px] uppercase tracking-wide text-zinc-600">
                      Duration
                    </p>
                    <p className="text-sm font-medium text-white">
                      ~{selected.durationDays} days
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-white/[0.02] p-3.5">
                    <Inbox className="h-4 w-4 text-signal" />
                    <p className="mt-2 text-[11px] uppercase tracking-wide text-zinc-600">
                      Items wanted
                    </p>
                    <p className="line-clamp-3 text-sm text-zinc-300">
                      {selected.itemNotes}
                    </p>
                  </div>
                </div>

                {selected.message && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
                      Message
                    </p>
                    <p className="mt-2 rounded-xl border border-line bg-white/[0.02] p-4 text-sm leading-relaxed text-zinc-300">
                      “{selected.message}”
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 border-t border-line pt-5">
                  {selected.status === "new" && (
                    <button
                      type="button"
                      onClick={() => setStatus(selected.id, "reviewed")}
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-5 text-sm font-semibold text-brand-soft transition-colors hover:bg-brand hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                      Mark reviewed
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/admin/quotes/new?request=${selected.id}&name=${encodeURIComponent(selected.name)}&company=${encodeURIComponent(selected.company)}&email=${encodeURIComponent(selected.email)}&phone=${encodeURIComponent(selected.phone)}`
                      )
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-volt px-5 text-sm font-semibold text-black transition-shadow hover:shadow-[0_0_24px_rgba(207,233,0,0.4)]"
                  >
                    <FileText className="h-4 w-4" />
                    Create quote
                  </button>
                  {selected.status !== "archived" && (
                    <button
                      type="button"
                      onClick={() => setStatus(selected.id, "archived")}
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-5 text-sm font-medium text-zinc-400 transition-colors hover:border-red-500/40 hover:text-red-400"
                    >
                      <Archive className="h-4 w-4" />
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
