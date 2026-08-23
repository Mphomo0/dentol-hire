export type Category = "tools" | "equipment" | "machinery" | "trailers";

export const CATEGORY_LABELS: Record<Category, string> = {
  tools: "Power Tools",
  equipment: "Site Equipment",
  machinery: "Heavy Machinery",
  trailers: "Trailers",
};

export interface EquipmentSpec {
  label: string;
  value: string;
}

export interface Equipment {
  id: string;
  slug: string;
  name: string;
  category: Category;
  tagline: string;
  description: string;
  specs: EquipmentSpec[];
  dayRate: number;
  weekRate: number;
  deposit: number;
  unitsTotal: number;
  unitsAvailable: number;
  featured: boolean;
  image?: string;
}

export type RateType = "day" | "week";

export interface RentalLine {
  equipmentId: string;
  name: string;
  qty: number;
  rateType: RateType;
  rate: number;
}

export type RentalStatus = "active" | "due-soon" | "overdue" | "returned";

export interface RentalCustomer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

export interface Rental {
  id: string;
  reference: string;
  invoiceId: string | null;
  customer: RentalCustomer;
  items: RentalLine[];
  startDate: string;
  dueDate: string;
  returnedDate: string | null;
  notes?: string;
}

export type QuoteRequestStatus = "new" | "reviewed" | "converted" | "archived";

export interface QuoteRequest {
  id: string;
  createdAt: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  interests: Category[];
  itemNotes: string;
  startDate: string;
  durationDays: number;
  message: string;
  status: QuoteRequestStatus;
}

export interface DocumentLine {
  id: string;
  equipmentId: string | null;
  description: string;
  qty: number;
  rateType: RateType;
  rate: number;
}

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined";

export interface Quote {
  id: string;
  number: string;
  requestId: string | null;
  customer: RentalCustomer;
  items: DocumentLine[];
  issueDate: string;
  validUntil: string;
  status: QuoteStatus;
  notes: string;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface ContactMessage {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  handled: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  quoteId: string | null;
  customer: RentalCustomer;
  items: DocumentLine[];
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  notes: string;
}

export interface BusinessSettings {
  address: string;
  phone: string;
  emails: string[];
  vatEnabled: boolean;
  vatRate: number;
  vatNumber: string;
}
