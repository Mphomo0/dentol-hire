import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  FileText,
  CalendarCheck,
  Truck,
  PhoneCall,
} from "lucide-react";
import { Counter, Reveal, StaggerGroup } from "@/components/gsap";
import { CATEGORY_ICONS } from "./equipment-card";
import { CATEGORY_LABELS } from "@/lib/types";
import type { Category } from "@/lib/types";

export function CategoriesSection() {
  const categories = Object.entries(CATEGORY_LABELS) as [Category, string][];
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <Reveal>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-soft">
          What we hire out
        </p>
        <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Four fleets.{" "}
          <span className="text-gradient-brand">Every job site.</span>
        </h2>
      </Reveal>

      <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map(([key, label]) => {
          const Icon = CATEGORY_ICONS[key];
          return (
            <Link
              key={key}
              data-stagger
              href={`/fleet?category=${key}`}
              className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-volt/40"
            >
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand/15 blur-2xl transition-all group-hover:bg-volt/15" />
              <Icon className="h-9 w-9 text-brand transition-colors group-hover:text-volt" />
              <h3 className="mt-6 font-display text-xl font-semibold text-white">
                {label}
              </h3>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500 transition-colors group-hover:text-zinc-300">
                Browse fleet
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </p>
            </Link>
          );
        })}
      </StaggerGroup>
    </section>
  );
}

const STEPS = [
  {
    icon: PhoneCall,
    title: "Tell us the job",
    text: "Send a quote request online or phone the yard. Describe the job and dates — we match the right machine.",
  },
  {
    icon: FileText,
    title: "Get your quote",
    text: "A clear, itemised quote within one working day. Day and week rates, delivery and deposit spelled out.",
  },
  {
    icon: CalendarCheck,
    title: "Book & confirm",
    text: "Accept the quote and we lock the equipment in for your dates. ID and deposit on collection.",
  },
  {
    icon: Truck,
    title: "Delivered ready-to-work",
    text: "Serviced, fuelled and safety-checked. We deliver to site across Gauteng — or collect from Wynberg.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative border-y border-line bg-[#04070c] py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-signal">
            How it works
          </p>
          <h2 className="max-w-xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            From call to concrete in four steps
          </h2>
        </Reveal>

        <StaggerGroup className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} data-stagger className="relative">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-surface shadow-[0_0_20px_rgba(0,121,245,0.15)]">
                  <step.icon className="h-5 w-5 text-volt" />
                </span>
                <span className="font-display text-4xl font-bold text-white/10">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {step.text}
              </p>
            </div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

export function StatsBand() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <StaggerGroup
        selector="[data-stagger]"
        className="grid grid-cols-2 gap-y-12 rounded-3xl border border-line bg-surface px-8 py-12 lg:grid-cols-4"
      >
        {[
          { value: 240, suffix: "+", label: "Assets on hire-ready standby" },
          { value: 1200, suffix: "+", label: "Jobs equipped since 2016" },
          { value: 98, suffix: "%", label: "On-time delivery rate" },
          { value: 4, suffix: "h", label: "Breakdown response average" },
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
  );
}

export function CtaBand() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 pb-28 sm:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/20 via-surface to-surface p-10 sm:p-16">
          <div className="grid-texture absolute inset-0 opacity-50" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-volt/15 blur-[100px]" />
          <div className="relative max-w-xl">
            <ClipboardList className="mb-6 h-8 w-8 text-volt" />
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Need it tomorrow?
              <br />
              <span className="text-gradient-brand">Quote today.</span>
            </h2>
            <p className="mt-4 max-w-md text-zinc-400">
              Send us your list and dates. We&apos;ll come back with an
              itemised quote — usually within a few hours.
            </p>
            <Link
              href="/quote"
              className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-volt px-7 py-3.5 font-semibold text-[#060a12] transition-all hover:shadow-[0_0_40px_rgba(207,233,0,0.5)] sm:w-auto"
            >
              Request a quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function MarqueeStrip({ names }: { names: string[] }) {
  const doubled = [...names, ...names];
  return (
    <div className="marquee-paused relative overflow-hidden border-y border-line bg-[#04070c] py-5">
      <div className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap">
        {doubled.map((name, i) => (
          <span
            key={i}
            className="flex items-center gap-3 font-display text-sm font-medium uppercase tracking-[0.2em] text-zinc-600"
          >
            {name}
            <span className="h-1 w-1 rounded-full bg-brand/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
