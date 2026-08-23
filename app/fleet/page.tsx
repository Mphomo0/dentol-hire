import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { FleetExplorer } from "@/components/fleet/fleet-explorer";
import { seedEquipment } from "@/lib/data/equipment";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Our Fleet",
  description:
    "Browse Dantol Hire's fleet — power tools, site equipment, heavy machinery and trailers available for hire in Johannesburg.",
};

const VALID: Category[] = ["tools", "equipment", "machinery", "trailers"];

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const initialCategory = VALID.includes(category as Category)
    ? (category as Category)
    : "all";

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-28 pt-32 sm:pt-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-soft">
            The full lineup
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Our <span className="text-gradient-brand">fleet</span>
          </h1>
          <p className="mt-4 max-w-xl text-zinc-400">
            Every machine serviced after each hire, safety-checked and ready to
            work. Rates exclude VAT · deposits apply.
          </p>

          <div className="mt-12">
            <FleetExplorer
              equipment={seedEquipment}
              initialCategory={initialCategory}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
