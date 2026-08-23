import {
  seedEquipment,
} from "./data/equipment";
import {
  seedInvoices,
  seedQuoteRequests,
  seedQuotes,
  seedRentals,
} from "./data/seed";
import { seedSettings } from "./data/settings";
import type {
  BusinessSettings,
  ContactMessage,
  Invoice,
  Quote,
  QuoteRequest,
  Rental,
} from "./types";

interface StoreShape {
  equipment: typeof seedEquipment;
  rentals: Rental[];
  quoteRequests: QuoteRequest[];
  quotes: Quote[];
  invoices: Invoice[];
  contactMessages: ContactMessage[];
  settings: BusinessSettings;
}

const globalForStore = globalThis as unknown as {
  __dantolStore?: StoreShape;
};

function createStore(): StoreShape {
  return {
    equipment: [...seedEquipment],
    rentals: [...seedRentals],
    quoteRequests: [...seedQuoteRequests],
    quotes: [...seedQuotes],
    invoices: [...seedInvoices],
    contactMessages: [],
    settings: { ...seedSettings },
  };
}

export const store: StoreShape =
  globalForStore.__dantolStore ?? (globalForStore.__dantolStore = createStore());

export const nextId = (prefix: string): string =>
  `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export const nextNumber = (
  existing: { number: string }[],
  prefix: string
): string => {
  const year = new Date().getFullYear();
  const max = existing.reduce((m, d) => {
    const n = Number(d.number.split("-").pop());
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `${prefix}-${year}-${String(max + 1).padStart(3, "0")}`;
};

export const nextRentalReference = (
  existing: { reference: string }[]
): string => {
  const now = new Date();
  const yymm = `${String(now.getFullYear()).slice(-2)}${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  const max = existing.reduce((m, r) => {
    const n = Number(r.reference.split("-").pop());
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `DH-${yymm}-${String(max + 1).padStart(3, "0")}`;
};
