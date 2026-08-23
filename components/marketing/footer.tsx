import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-[#04070c]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <Logo size="lg" />
            <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
              Premium tool, equipment, machinery and trailer hire for
              Johannesburg&apos;s builders, makers and movers.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-zinc-500 transition-colors hover:text-volt">Home</Link></li>
              <li><Link href="/fleet" className="text-zinc-500 transition-colors hover:text-volt">Our Fleet</Link></li>
              <li><Link href="/about" className="text-zinc-500 transition-colors hover:text-volt">About Us</Link></li>
              <li><Link href="/contact" className="text-zinc-500 transition-colors hover:text-volt">Contact</Link></li>
              <li><Link href="/quote" className="text-zinc-500 transition-colors hover:text-volt">Request a Quote</Link></li>
              <li><Link href="/admin" className="text-zinc-500 transition-colors hover:text-volt">Staff Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/fleet?category=tools" className="text-zinc-500 transition-colors hover:text-volt">Power Tools</Link></li>
              <li><Link href="/fleet?category=equipment" className="text-zinc-500 transition-colors hover:text-volt">Site Equipment</Link></li>
              <li><Link href="/fleet?category=machinery" className="text-zinc-500 transition-colors hover:text-volt">Heavy Machinery</Link></li>
              <li><Link href="/fleet?category=trailers" className="text-zinc-500 transition-colors hover:text-volt">Trailers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                12 Foundry Road, Wynberg, Sandton, 2090
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-brand" />
                <a href="tel:+27112345678" className="hover:text-white">(011) 234-5678</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-brand" />
                <a href="mailto:hire@dantol.co.za" className="hover:text-white">hire@dantol.co.za</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                Mon–Fri 07:00–17:30 · Sat 08:00–13:00
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-zinc-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Dantol Hire (Pty) Ltd. All rights reserved.</p>
          <p>Johannesburg · Gauteng · South Africa</p>
        </div>
      </div>
    </footer>
  );
}
