"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import gsap from "gsap";
import { Check, Loader2 } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validation";

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-white/[0.03] px-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-all focus:border-brand/60 focus:bg-brand/[0.04] focus:ring-4 focus:ring-brand/10";

const labelClass = "mb-2 block text-sm font-medium text-zinc-300";
const errorClass = "mt-1.5 text-xs text-red-400";

const SUBJECTS = [
  { value: "general", label: "General enquiry" },
  { value: "booking", label: "Booking & availability" },
  { value: "accounts", label: "Accounts / invoicing" },
  { value: "careers", label: "Careers" },
] as const;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "general",
      message: "",
    },
  });

  useEffect(() => {
    if (!sent || !successRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-sent-badge]",
        { scale: 0, rotation: -30 },
        { scale: 1, rotation: 0, duration: 0.7, ease: "back.out(2)" }
      );
      gsap.fromTo(
        "[data-sent-text]",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.2 }
      );
    }, successRef);
    return () => ctx.revert();
  }, [sent]);

  async function onSubmit(values: ContactInput) {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error("Failed to send");
    setSent(true);
  }

  if (sent) {
    return (
      <div ref={successRef} className="glass-panel flex h-full flex-col items-center justify-center rounded-3xl p-12 text-center">
        <div
          data-sent-badge
          className="grid h-20 w-20 place-items-center rounded-full bg-signal/15 ring-8 ring-signal/5"
        >
          <Check className="h-9 w-9 text-signal" strokeWidth={3} />
        </div>
        <h3 data-sent-text className="mt-7 font-display text-2xl font-bold text-white opacity-0">
          Message sent
        </h3>
        <p data-sent-text className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400 opacity-0">
          Thanks for getting in touch. The hire desk replies within one working
          day — usually much sooner.
        </p>
        <button
          data-sent-text
          type="button"
          onClick={() => {
            setSent(false);
            reset();
          }}
          className="mt-7 text-sm font-medium text-zinc-500 underline-offset-4 transition-colors hover:text-volt hover:underline opacity-0"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className={labelClass}>Name *</label>
          <input id="c-name" {...register("name")} className={inputClass} placeholder="Your name" />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="c-phone" className={labelClass}>Phone *</label>
          <input id="c-phone" type="tel" {...register("phone")} className={inputClass} placeholder="+27 82 000 0000" />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="c-email" className={labelClass}>Email *</label>
        <input id="c-email" type="email" {...register("email")} className={inputClass} placeholder="you@company.co.za" />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="c-subject" className={labelClass}>Subject *</label>
        <select id="c-subject" {...register("subject")} className={`${inputClass} appearance-none`}>
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value} className="bg-surface">
              {s.label}
            </option>
          ))}
        </select>
        {errors.subject && <p className={errorClass}>{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="c-message" className={labelClass}>Message *</label>
        <textarea
          id="c-message"
          rows={5}
          {...register("message")}
          className={`${inputClass} h-auto resize-none py-3`}
          placeholder="How can we help?"
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-soft py-3.5 font-semibold text-white shadow-[0_0_32px_rgba(0,121,245,0.45)] transition-shadow hover:shadow-[0_0_48px_rgba(0,121,245,0.6)] disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Sending…
          </>
        ) : (
          <>Send message</>
        )}
      </button>
    </form>
  );
}
