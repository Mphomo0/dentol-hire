import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { EquipmentCard } from "@/components/marketing/equipment-card";
import {
  CategoriesSection,
  CtaBand,
  HowItWorks,
  MarqueeStrip,
  StatsBand,
} from "@/components/marketing/sections";
import { Reveal, StaggerGroup } from "@/components/gsap";
import { seedEquipment } from "@/lib/data/equipment";

const BRAND_NAMES = [
  "CAT",
  "Bosch Professional",
  "Wacker Neuson",
  "Generac",
  "Makita",
  "Hilti",
  "DeWalt",
  "Venter",
];

export default function HomePage() {
  const featured = seedEquipment.filter((e) => e.featured).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MarqueeStrip names={BRAND_NAMES} />
        <CategoriesSection />

        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-volt">
                Featured fleet
              </p>
              <h2 className="max-w-xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                The machines our clients keep rebooking
              </h2>
            </div>
            <Link
              href="/fleet"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-volt"
            >
              View full fleet
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>

          <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <div key={item.id} data-stagger>
                <EquipmentCard item={item} />
              </div>
            ))}
          </StaggerGroup>
        </section>

        <HowItWorks />
        <StatsBand />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
