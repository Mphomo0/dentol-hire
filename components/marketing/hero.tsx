"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, ShieldCheck, Truck, BadgeCheck } from "lucide-react";

const HEADLINE = ["Hire", "the", "machine.", "Own", "the", "job."];

export function Hero() {
  const scopeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      try {
        // Hide only once we know we can animate — content stays visible if JS/GSAP fails.
        gsap.set("[data-hero-kicker]", { autoAlpha: 0, y: 18 });
        gsap.set("[data-hero-word]", { autoAlpha: 0, yPercent: 110 });
        gsap.set("[data-hero-sub]", { autoAlpha: 0, y: 22 });
        gsap.set("[data-hero-cta]", { autoAlpha: 0, y: 22 });
        gsap.set("[data-hero-trust]", { autoAlpha: 0, y: 16 });
        gsap.set("[data-hero-chip]", { autoAlpha: 0, scale: 0.8, y: 30 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to("[data-hero-kicker]", { autoAlpha: 1, y: 0, duration: 0.6 })
          .to(
            "[data-hero-word]",
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.85,
              stagger: 0.07,
            },
            "-=0.25"
          )
          .to("[data-hero-sub]", { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.45")
          .to(
            "[data-hero-cta]",
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 },
            "-=0.4"
          )
          .to(
            "[data-hero-trust]",
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 },
            "-=0.35"
          )
          .to(
            "[data-hero-chip]",
            {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "back.out(1.6)",
            },
            "-=1.2"
          );
      } catch {
        gsap.set(scope.querySelectorAll<HTMLElement>("[data-hero]"), {
          clearProps: "all",
        });
      }
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={scopeRef}
      className="relative overflow-hidden pb-20 pt-32 sm:pt-40 md:pt-48"
    >
      <div className="absolute inset-y-0 right-0 hidden w-[46%] lg:block">
        <Image
          src="/images/marketing/hero-construction.jpg"
          alt=""
          fill
          priority
          sizes="46vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>
      <div className="grid-texture absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] max-w-none -translate-x-1/2 rounded-full bg-brand/25 blur-[140px]" />
      <div className="absolute right-[-160px] top-40 h-[380px] w-[380px] rounded-full bg-signal/12 blur-[120px]" />
      <div className="absolute left-[-120px] top-72 h-[320px] w-[320px] rounded-full bg-volt/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <p
          data-hero
          data-hero-kicker
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-wide text-zinc-400"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_8px_rgba(56,212,93,0.9)]" />
          Johannesburg&apos;s premium hire fleet · Available now
        </p>

        <h1 className="max-w-4xl font-display text-4xl font-bold leading-[1.06] tracking-tight text-white min-[420px]:text-5xl sm:text-7xl">
          {HEADLINE.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
              <span
                data-hero
                data-hero-word
                className={`mr-[0.24em] inline-block ${
                  word === "machine."
                    ? "text-gradient-brand"
                    : word === "job."
                      ? "text-volt"
                      : ""
                }`}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <p
          data-hero
          data-hero-sub
          className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-400"
        >
          Tools, site equipment, heavy machinery and trailers — maintained to
          showroom standard and ready when you are. One call, one quote, zero
          downtime.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            data-hero
            data-hero-cta
            href="/quote"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 font-semibold text-white shadow-[0_0_36px_rgba(0,121,245,0.5)] transition-all hover:bg-brand-soft hover:shadow-[0_0_48px_rgba(0,121,245,0.65)] sm:w-auto"
          >
            Get an instant quote
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            data-hero
            data-hero-cta
            href="/fleet"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-7 py-3.5 font-semibold text-zinc-200 transition-colors hover:border-volt/40 hover:text-volt sm:w-auto"
          >
            Browse the fleet
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
          {[
            { icon: ShieldCheck, label: "Fully serviced & safety-checked" },
            { icon: Truck, label: "Same-day delivery in Gauteng" },
            { icon: BadgeCheck, label: "Certified operators available" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              data-hero
              data-hero-trust
              className="inline-flex items-center gap-2 text-sm text-zinc-500"
            >
              <Icon className="h-4 w-4 text-signal" />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Floating stat chips */}
      <div className="pointer-events-none relative mx-auto mt-16 hidden max-w-7xl px-8 lg:block">
        <div
          data-hero
          data-hero-chip
          className="glass-panel absolute right-16 top-0 w-52 rounded-2xl p-5"
        >
          <p className="font-display text-3xl font-bold text-white">98%</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            on-time delivery rate across Gauteng sites
          </p>
        </div>
        <div
          data-hero
          data-hero-chip
          className="glass-panel absolute right-72 top-32 w-48 rounded-2xl p-5"
        >
          <p className="font-display text-3xl font-bold text-volt">240+</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            machines &amp; tools in active rotation
          </p>
        </div>
        <div
          data-hero
          data-hero-chip
          className="glass-panel absolute right-6 top-64 w-52 rounded-2xl p-5"
        >
          <p className="font-display text-3xl font-bold text-signal">4h</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            average breakdown response time
          </p>
        </div>
      </div>
    </section>
  );
}
