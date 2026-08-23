import type { Metadata } from "next";
import Image from "next/image";
import {
  BadgeCheck,
  HandHeart,
  MapPin,
  ShieldCheck,
  Timer,
  Wrench,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Counter, Reveal, StaggerGroup } from "@/components/gsap";
import { MarqueeStrip } from "@/components/marketing/sections";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Dantol Hire is Johannesburg's premium tool, equipment, machinery and trailer hire company — built on well-kept machines and straight dealing.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Safety before everything",
    text: "Every machine is inspected, serviced and load-tested on a fixed schedule. If it wouldn't protect our own crew, it doesn't leave the yard.",
  },
  {
    icon: Timer,
    title: "Uptime is the product",
    text: "You're not renting steel — you're renting working hours. We answer breakdown calls in hours, not days, with swap-out stock standing by.",
  },
  {
    icon: HandHeart,
    title: "Straight dealing",
    text: "Itemised quotes, honest day/week rates, deposits refunded fast. No hidden delivery fees, no fine-print games.",
  },
  {
    icon: Wrench,
    title: "Trade-grade fleet",
    text: "CAT, Bosch Professional, Wacker Neuson, Generac — we buy the brands site foremen trust and maintain them to showroom standard.",
  },
];

const AREAS = [
  "Sandton", "Randburg", "Fourways", "Midrand",
  "Roodepoort", "Soweto", "Rosebank", "Bedfordview",
  "Centurion", "Krugersdorp", "Alberton", "JHB CBD",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pb-20 pt-36 sm:pt-44">
          <div className="grid-texture absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
          <div className="absolute -top-40 left-1/3 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-brand/22 blur-[140px]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-volt">
                Est. 2016 · Wynberg, Sandton
              </p>
              <h1 className="max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
                The hire company{" "}
                <span className="text-gradient-brand">foremen recommend</span>{" "}
                to other foremen.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-zinc-400">
                Dantol Hire started with six machines, one bakkie and a simple
                promise: equipment that works when you switch it on. Ten years
                later that promise runs a fleet of 240+ assets serving
                builders, landscapers, electricians and events crews across
                Gauteng.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
          <StaggerGroup
            selector="[data-stagger]"
            className="grid grid-cols-2 gap-y-10 rounded-3xl border border-line bg-surface px-8 py-12 lg:grid-cols-4"
          >
            {[
              { value: 2016, suffix: "", label: "Founded in Wynberg" },
              { value: 240, suffix: "+", label: "Assets in rotation" },
              { value: 1200, suffix: "+", label: "Jobs equipped" },
              { value: 98, suffix: "%", label: "On-time delivery" },
            ].map(({ value, suffix, label }) => (
              <div key={label} data-stagger className="text-center">
                <Counter
                  value={value}
                  suffix={suffix}
                  className="font-display text-4xl font-bold text-white sm:text-5xl"
                />
                <p className="mx-auto mt-2 max-w-[180px] text-sm text-zinc-500">
                  {label}
                </p>
              </div>
            ))}
          </StaggerGroup>
        </section>

        {/* Values */}
        <section className="border-y border-line bg-[#04070c] py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-soft">
                What we stand for
              </p>
              <h2 className="max-w-xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Four rules we don&apos;t break
              </h2>
            </Reveal>
            <StaggerGroup className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-2">
              {VALUES.map((v) => (
                <div key={v.title} data-stagger className="flex gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-surface shadow-[0_0_20px_rgba(0,121,245,0.15)]">
                    <v.icon className="h-5 w-5 text-signal" />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-semibold text-white">
                      {v.title}
                    </span>
                    <span className="mt-2 block max-w-md text-sm leading-relaxed text-zinc-500">
                      {v.text}
                    </span>
                  </span>
                </div>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* Coverage */}
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Reveal className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-signal">
              Where we deliver
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Greater Johannesburg,{" "}
              <span className="text-gradient-brand">covered</span>
            </h2>
            <p className="mt-4 leading-relaxed text-zinc-400">
              Same-day delivery inside a 40km radius of our Wynberg yard —
              most orders placed before noon arrive the same afternoon.
            </p>
          </Reveal>
          <StaggerGroup className="mt-10 flex flex-wrap gap-2.5">
            {AREAS.map((area) => (
              <span
                key={area}
                data-stagger
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm text-zinc-300"
              >
                <MapPin className="h-3.5 w-3.5 text-brand" />
                {area}
              </span>
            ))}
          </StaggerGroup>
          <Reveal className="mt-12">
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-volt/25 bg-volt/[0.05] p-6">
              <BadgeCheck className="h-6 w-6 shrink-0 text-volt" />
              <p className="text-sm leading-relaxed text-zinc-300">
                Registered supplier to CIDB Grade 3–5 contractors · SANS-compliant
                inspection records available for every machine on request.
              </p>
            </div>
          </Reveal>
        </section>

        <MarqueeStrip
          names={[
            "Builders", "Landscapers", "Electricians", "Event Crews",
            "Renovators", "Plumbers", "Farmers", "Film Sets",
          ]}
        />

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <Reveal>
            <div className="relative mb-8 h-56 overflow-hidden rounded-3xl border border-line sm:h-72">
              <Image
                src="/images/marketing/yard-dusk.jpg"
                alt="Dantol Hire's equipment yard at dusk, rows of machinery ready to go"
                fill
                sizes="(min-width: 1280px) 1152px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <p className="absolute bottom-4 left-5 text-sm font-medium text-zinc-200">
                Our Wynberg yard, ready for the morning rush
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/20 via-surface to-surface p-10 text-center sm:p-16">
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Come see the yard
              </h2>
              <p className="mx-auto mt-3 max-w-md text-zinc-400">
                12 Foundry Road, Wynberg. Coffee&apos;s on — kick the tyres
                before you hire.
              </p>
              <a
                href="/contact"
                className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-volt px-7 py-3.5 font-semibold text-[#060a12] transition-all hover:shadow-[0_0_40px_rgba(207,233,0,0.5)] sm:w-auto"
              >
                Get in touch →
              </a>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
