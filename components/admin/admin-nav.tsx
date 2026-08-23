"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  FileText,
  Inbox,
  LayoutDashboard,
  Menu,
  PackageOpen,
  Settings,
  ExternalLink,
  X,
} from "lucide-react";
import { Logo } from "@/components/marketing/logo";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/rentals", label: "Rentals", icon: PackageOpen },
  { href: "/admin/quote-requests", label: "Quote Requests", icon: Inbox },
  { href: "/admin/quotes", label: "Quotes", icon: FileText },
  { href: "/admin/invoices", label: "Invoices", icon: Banknote },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-[#04070c] lg:flex">
      <div className="border-b border-line px-6 py-5">
        <Logo />
        <p className="mt-2 text-[11px] font-medium uppercase tracking-widest text-zinc-600">
          Staff portal
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-brand/12 text-white ring-1 ring-inset ring-brand/30"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${active ? "text-brand" : ""}`} />
              {label}
              {label === "Quote Requests" && (
                <span className="ml-auto rounded-full bg-volt/15 px-2 py-0.5 text-[10px] font-bold text-volt">
                  3
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-200"
        >
          <ExternalLink className="h-4 w-4" />
          View website
        </Link>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const current = NAV.find(({ href, exact }) =>
    exact ? pathname === href : pathname.startsWith(href)
  );

  return (
    <div className="no-print sticky top-0 z-40 border-b border-line bg-background/95 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
          {current && <current.icon className="h-4.5 w-4.5 text-brand" />}
          {current?.label ?? "Menu"}
        </div>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-zinc-300 transition-colors hover:text-white"
        >
          {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </div>

      {open && (
        <nav className="space-y-1 border-t border-line px-3 pb-4 pt-3">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-brand/12 text-white ring-1 ring-inset ring-brand/30"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${active ? "text-brand" : ""}`} />
                {label}
                {label === "Quote Requests" && (
                  <span className="ml-auto rounded-full bg-volt/15 px-2 py-0.5 text-[10px] font-bold text-volt">
                    3
                  </span>
                )}
              </Link>
            );
          })}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl border-t border-line px-4 pb-1 pt-3.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-200"
          >
            <ExternalLink className="h-4 w-4" />
            View website
          </Link>
        </nav>
      )}
    </div>
  );
}
