import { z } from "zod";
import { nextId, nextNumber, store } from "@/lib/store";
import type { Invoice } from "@/lib/types";

const lineSchema = z.object({
  id: z.string().optional(),
  equipmentId: z.string().nullable().optional(),
  description: z.string().min(1).max(200),
  qty: z.coerce.number().int().min(1).max(99),
  rateType: z.enum(["day", "week"]),
  rate: z.coerce.number().min(0).max(1_000_000),
});

const createInvoiceSchema = z.object({
  customer: z.object({
    id: z.string(),
    name: z.string().min(2),
    company: z.string(),
    email: z.email(),
    phone: z.string().min(6),
  }),
  items: z.array(lineSchema).min(1, "Add at least one line item"),
  dueDays: z.coerce.number().int().min(1).max(120).default(15),
  quoteId: z.string().nullable().optional(),
  notes: z.string().max(600).optional(),
});

export async function GET() {
  return Response.json(store.invoices);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const invoice: Invoice = {
    id: nextId("inv"),
    number: nextNumber(store.invoices, "INV"),
    quoteId: data.quoteId ?? null,
    customer: { ...data.customer, id: data.customer.id || nextId("cus") },
    items: data.items.map((line, i) => ({
      id: line.id ?? `ili-${Date.now()}-${i}`,
      equipmentId: line.equipmentId ?? null,
      description: line.description,
      qty: line.qty,
      rateType: line.rateType,
      rate: line.rate,
    })),
    issueDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + data.dueDays * 86_400_000).toISOString(),
    status: "draft",
    notes: data.notes || "",
  };

  store.invoices.unshift(invoice);
  return Response.json(invoice, { status: 201 });
}
