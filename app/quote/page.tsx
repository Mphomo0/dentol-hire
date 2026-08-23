import type { Metadata } from "next";
import { Clock, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { QuoteRequestForm } from "@/components/forms/quote-request-form";
import { seedEquipment } from "@/lib/data/equipment";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Tell us what you need and for how long — Dantol Hire Johannesburg will send an itemised quote within one working day.",
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ equipment?: string }>;
}) {
  const { equipment: slug } = await searchParams;
  const match = seedEquipment.find((e) => e.slug === slug);

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-28 pt-32 sm:pt-36">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-volt">
              Fast &amp; itemised
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Request a{" "}
              <span className="text-gradient-brand">quote</span>
            </h1>
            <p className="mt-4 max-w-md leading-relaxed text-zinc-400">
              One form, zero obligation. Our hire desk replies with day and
              week rates, delivery costs and availability — usually within a
              few hours.
            </p>

            {match && (
              <div className="mt-8 rounded-2xl border border-brand/30 bg-brand/[0.06] p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-soft">
                  Pre-selected
                </p>
                <p className="mt-2 font-display text-lg font-semibold text-white">
                  {match.name}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  From R{match.dayRate.toLocaleString("en-ZA")}/day · R
                  {match.weekRate.toLocaleString("en-ZA")}/week
                </p>
              </div>
            )}

            <ul className="mt-10 space-y-5">
              {[
                {
                  icon: Clock,
                  title: "One working day turnaround",
                  text: "Most quotes go out same-day.",
                },
                {
                  icon: ShieldCheck,
                  title: "Transparent pricing",
                  text: "Day / week rates, deposit and delivery spelled out. No surprises.",
                },
                {
                  icon: Phone,
                  title: "Prefer to talk?",
                  text: "(011) 234-5678 — Mon–Fri 07:00–17:30.",
                },
                {
                  icon: MapPin,
                  title: "The yard",
                  text: "12 Foundry Road, Wynberg, Sandton.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-surface">
                    <Icon className="h-5 w-5 text-signal" />
                  </span>
                  <span>
                    <span className="block font-medium text-white">{title}</span>
                    <span className="mt-0.5 block text-sm text-zinc-500">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel rounded-3xl p-7 sm:p-9">
            <QuoteRequestForm prefillItem={match?.name} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
