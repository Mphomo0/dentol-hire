"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import gsap from "gsap";
import {
  quoteRequestSchema,
  type QuoteRequestInput,
} from "@/lib/validation";
import { CATEGORY_LABELS, type Category } from "@/lib/types";

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [Category, string][];

const DEFAULT_START_DATE = new Date(Date.now() + 3 * 86_400_000)
  .toISOString()
  .slice(0, 10);

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-white/[0.03] px-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-brand/60 focus:bg-brand/[0.04] focus:ring-4 focus:ring-brand/10";

const labelClass =
  "mb-2 block text-sm font-medium text-zinc-300";

const errorClass =
  "mt-1.5 text-xs text-red-400";

export function QuoteRequestForm({
  prefillItem,
}: {
  prefillItem?: string;
}) {
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteRequestInput>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      interests: [],
      itemNotes: prefillItem ? `I'm interested in hiring the ${prefillItem}.` : "",
      startDate: DEFAULT_START_DATE,
      durationDays: 7,
      message: "",
    },
  });

  useEffect(() => {
    if (!submittedId || !successRef.current) return;
    const el = successRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-success-badge]",
        { scale: 0, rotation: -30 },
        { scale: 1, rotation: 0, duration: 0.7, ease: "back.out(2)" }
      );
      gsap.fromTo(
        "[data-success-text]",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, delay: 0.25 }
      );
    }, el);
    return () => ctx.revert();
  }, [submittedId]);

  async function onSubmit(values: QuoteRequestInput) {
    const res = await fetch("/api/quote-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        startDate: new Date(values.startDate).toISOString(),
      }),
    });
    if (!res.ok) throw new Error("Failed to submit");
    const created = await res.json();
    setSubmittedId(created.id);
  }

  if (submittedId) {
    return (
      <div ref={successRef} className="glass-panel rounded-3xl p-10 text-center sm:p-14">
        <div
          data-success-badge
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-signal/15 ring-8 ring-signal/5"
        >
          <Check className="h-9 w-9 text-signal" strokeWidth={3} />
        </div>
        <h2 data-success-text className="mt-7 font-display text-3xl font-bold text-white opacity-0">
          Request received!
        </h2>
        <p data-success-text className="mx-auto mt-3 max-w-md text-zinc-400 opacity-0">
          Thanks — our team is on it. Expect an itemised quote by email or
          phone within one working day.
        </p>
        <p data-success-text className="mt-6 inline-block rounded-full border border-line bg-white/[0.03] px-4 py-2 font-mono text-xs tracking-wide text-volt opacity-0">
          Reference: QR-{submittedId.toUpperCase().slice(-6)}
        </p>
        <div data-success-text className="opacity-0">
          <button
            type="button"
            onClick={() => {
              setSubmittedId(null);
              reset();
            }}
            className="mt-8 text-sm font-medium text-zinc-500 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="q-name" className={labelClass}>Full name *</label>
          <input id="q-name" {...register("name")} className={inputClass} placeholder="Thabo Mokoena" />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="q-company" className={labelClass}>Company</label>
          <input id="q-company" {...register("company")} className={inputClass} placeholder="Optional" />
          {errors.company && <p className={errorClass}>{errors.company.message}</p>}
        </div>
        <div>
          <label htmlFor="q-email" className={labelClass}>Email *</label>
          <input id="q-email" type="email" {...register("email")} className={inputClass} placeholder="you@company.co.za" />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="q-phone" className={labelClass}>Phone *</label>
          <input id="q-phone" type="tel" {...register("phone")} className={inputClass} placeholder="+27 82 000 0000" />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <span className={labelClass}>What do you need? *</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(([key, label]) => (
            <label key={key} className="cursor-pointer">
              <input type="checkbox" value={key} className="peer sr-only" {...register("interests")} />
              <span className="inline-flex h-10 items-center rounded-full border border-line bg-white/[0.03] px-5 text-sm text-zinc-400 transition-all peer-checked:border-volt peer-checked:bg-volt/10 peer-checked:text-volt hover:border-zinc-600">
                {label}
              </span>
            </label>
          ))}
        </div>
        {errors.interests && <p className={errorClass}>{errors.interests.message}</p>}
      </div>

      <div>
        <label htmlFor="q-notes" className={labelClass}>
          Which items / describe the job *
        </label>
        <textarea
          id="q-notes"
          rows={3}
          {...register("itemNotes")}
          className={`${inputClass} h-auto resize-none py-3`}
          placeholder="e.g. TLB for trenching, 50m of scaffolding, angle grinder…"
        />
        {errors.itemNotes && <p className={errorClass}>{errors.itemNotes.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="q-start" className={labelClass}>Start date *</label>
          <input id="q-start" type="date" {...register("startDate")} className={`${inputClass} [color-scheme:dark]`} />
          {errors.startDate && <p className={errorClass}>{errors.startDate.message}</p>}
        </div>
        <div>
          <label htmlFor="q-duration" className={labelClass}>Duration (days) *</label>
          <input id="q-duration" type="number" min={1} {...register("durationDays", { valueAsNumber: true })} className={inputClass} placeholder="7" />
          {errors.durationDays && <p className={errorClass}>{errors.durationDays.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="q-message" className={labelClass}>Anything else?</label>
        <textarea
          id="q-message"
          rows={2}
          {...register("message")}
          className={`${inputClass} h-auto resize-none py-3`}
          placeholder="Site location, delivery needs, operator requirements…"
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand to-brand-soft font-semibold text-white shadow-[0_0_36px_rgba(0,121,245,0.45)] transition-all hover:shadow-[0_0_52px_rgba(0,121,245,0.65)] disabled:opacity-60 sm:w-auto sm:px-12"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending…
          </>
        ) : (
          <>Send request →</>
        )}
      </button>
      <p className="text-xs text-zinc-600">
        No spam, ever. We only use your details to prepare your quote.
      </p>
    </form>
  );
}
