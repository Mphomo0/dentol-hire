import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone, Truck } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Reveal } from "@/components/gsap";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call, visit or message Dantol Hire in Wynberg, Sandton. Same-day delivery across greater Johannesburg.",
};

const CHANNELS = [
  {
    icon: Phone,
    title: "Hire desk",
    lines: ["(011) 234-5678", "WhatsApp +27 82 000 1234"],
    href: "tel:+27112345678",
    action: "Call now",
    accent: "text-brand",
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["hire@dantol.co.za", "accounts@dantol.co.za"],
    href: "mailto:hire@dantol.co.za",
    action: "Write to us",
    accent: "text-volt",
  },
  {
    icon: MapPin,
    title: "The yard",
    lines: ["12 Foundry Road, Wynberg", "Sandton, 2090"],
    href: "https://maps.google.com/?q=Wynberg+Sandton+Johannesburg",
    action: "Directions",
    accent: "text-signal",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-28 pt-32 sm:pt-36">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-soft">
              We answer fast
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Talk to the{" "}
              <span className="text-gradient-brand">hire desk</span>
            </h1>
            <p className="mt-5 leading-relaxed text-zinc-400">
              Booking a TLB for Monday or chasing an invoice — you&apos;ll get
              a human, not a hold tune.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Left column: channels + hours */}
            <div className="space-y-5">
              {CHANNELS.map((ch, i) => (
                <Reveal key={ch.title} delay={i * 0.08}>
                  <a
                    href={ch.href}
                    target={ch.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group flex items-start gap-4 rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-white/20"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-white/[0.03]">
                      <ch.icon className={`h-5 w-5 ${ch.accent}`} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display font-semibold text-white">
                        {ch.title}
                      </span>
                      {ch.lines.map((line) => (
                        <span key={line} className="block text-sm text-zinc-400">
                          {line}
                        </span>
                      ))}
                    </span>
                    <span className="self-center text-xs font-medium text-zinc-600 transition-colors group-hover:text-volt">
                      {ch.action} →
                    </span>
                  </a>
                </Reveal>
              ))}

              <Reveal delay={0.24}>
                <div className="rounded-2xl border border-line bg-surface p-5">
                  <h3 className="flex items-center gap-2 font-display font-semibold text-white">
                    <Clock className="h-4.5 w-4.5 text-brand" />
                    Trading hours
                  </h3>
                  <dl className="mt-4 space-y-2 text-sm">
                    {[
                      ["Mon – Fri", "07:00 – 17:30"],
                      ["Saturday", "08:00 – 13:00"],
                      ["Sundays & public holidays", "Emergency call-outs only"],
                    ].map(([days, hours]) => (
                      <div key={days} className="flex justify-between gap-4">
                        <dt className="text-zinc-500">{days}</dt>
                        <dd className="font-medium tabular-nums text-zinc-200">
                          {hours}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex items-start gap-3 rounded-2xl border border-volt/25 bg-volt/[0.05] p-5">
                  <Truck className="mt-0.5 h-5 w-5 shrink-0 text-volt" />
                  <p className="text-sm leading-relaxed text-zinc-300">
                    Need delivery? Orders confirmed before{" "}
                    <strong className="text-white">12:00</strong> qualify for
                    same-day drop-off anywhere within 40km of Wynberg.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Right column: stylized map + form */}
            <div className="space-y-6">
              <Reveal delay={0.12}>
                <div className="relative h-52 overflow-hidden rounded-2xl border border-line bg-[#04070c]">
                  <div className="grid-texture absolute inset-0" />
                  <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden>
                    <path d="M-20 130 C 120 90, 260 170, 420 110 S 700 60, 860 140" stroke="#0079f5" strokeWidth="2.5" fill="none" />
                    <path d="M60 -10 C 100 80, 220 140, 300 230" stroke="#38d45d" strokeWidth="1.5" fill="none" strokeDasharray="6 6" />
                    <path d="M480 -10 C 430 70, 500 160, 560 230" stroke="#cfe900" strokeWidth="1.5" fill="none" strokeDasharray="6 6" />
                  </svg>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="relative grid h-14 w-14 place-items-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/40" />
                      <MapPin className="relative h-8 w-8 text-brand drop-shadow-[0_0_12px_rgba(0,121,245,0.8)]" />
                    </span>
                  </div>
                  <div className="glass-panel absolute bottom-4 left-4 rounded-xl px-4 py-2.5">
                    <p className="text-xs font-semibold text-white">Dantol Hire Yard</p>
                    <p className="text-[11px] text-zinc-500">Wynberg · Sandton</p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="glass-panel rounded-3xl p-7 sm:p-9">
                  <ContactForm />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
