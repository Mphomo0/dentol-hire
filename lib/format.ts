import type { Rental, RentalStatus } from "./types";

const zar = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const zarPrecise = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  minimumFractionDigits: 2,
});

export const formatMoney = (v: number): string => zar.format(v);
export const formatMoneyPrecise = (v: number): string => zarPrecise.format(v);

export const formatDate = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatDateTime = (isoDate: string): string =>
  new Date(isoDate).toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export const daysBetween = (a: string | Date, b: string | Date): number =>
  Math.round(
    (new Date(a).getTime() - new Date(b).getTime()) / 86_400_000
  );

export function rentalStatus(rental: Rental): RentalStatus {
  if (rental.returnedDate) return "returned";
  const days = daysBetween(rental.dueDate, new Date());
  if (days < 0) return "overdue";
  if (days <= 2) return "due-soon";
  return "active";
}

export const RENTAL_STATUS_META: Record<
  RentalStatus,
  { label: string; className: string }
> = {
  active: {
    label: "On hire",
    className:
      "bg-brand/10 text-brand-soft border-brand/25 ring-1 ring-inset ring-brand/20",
  },
  "due-soon": {
    label: "Due soon",
    className:
      "bg-volt/10 text-volt border-volt/25 ring-1 ring-inset ring-volt/20",
  },
  overdue: {
    label: "Overdue",
    className:
      "bg-red-500/10 text-red-400 border-red-500/25 ring-1 ring-inset ring-red-500/20",
  },
  returned: {
    label: "Returned",
    className:
      "bg-signal/10 text-signal border-signal/25 ring-1 ring-inset ring-signal/20",
  },
};

export const lineTotal = (
  qty: number,
  rateType: "day" | "week",
  rate: number,
  refDate?: string
): number => {
  const units =
    rateType === "week"
      ? Math.max(1, Math.ceil(daysBetween(refDate ?? new Date().toISOString(), new Date(0)) / 7))
      : 1;
  return qty * rate * units;
};

export interface DocumentTotals {
  subtotal: number;
  vat: number;
  total: number;
}

export interface VatConfig {
  enabled: boolean;
  rate: number;
}

export const DEFAULT_VAT: VatConfig = { enabled: true, rate: 15 };

export const documentTotals = (
  items: { qty: number; rate: number }[],
  vat: VatConfig = DEFAULT_VAT
): DocumentTotals => {
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.rate, 0);
  const vatAmount = vat.enabled
    ? Math.round(subtotal * (vat.rate / 100) * 100) / 100
    : 0;
  return { subtotal, vat: vatAmount, total: subtotal + vatAmount };
};
