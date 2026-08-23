import { z } from "zod";
import { nextId, nextNumber, store } from "@/lib/store";
import type { Quote } from "@/lib/types";

const lineSchema = z.object({
  id: z.string().optional(),
  equipmentId: z.string().nullable().optional(),
  description: z.string().min(1).max(200),
  qty: z.coerce.number().int().min(1).max(99),
  rateType: z.enum(["day", "week"]),
  rate: z.coerce.number().min(0).max(1_000_000),
});

const createQuoteSchema = z.object({
  customer: z.object({
    id: z.string(),
    name: z.string().min(2),
    company: z.string(),
    email: z.email(),
    phone: z.string().min(6),
  }),
  items: z.array(lineSchema).min(1, "Add at least one line item"),
  validDays: z.coerce.number().int().min(1).max(90).default(14),
  requestId: z.string().nullable().optional(),
  notes: z.string().max(600).optional(),
});

export async function GET() {
  return Response.json(store.quotes);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const quote: Quote = {
    id: nextId("quo"),
    number: nextNumber(store.quotes, "Q"),
    requestId: data.requestId ?? null,
    customer: {
      ...data.customer,
      id: data.customer.id || nextId("cus"),
    },
    items: data.items.map((line, i) => ({
      id: line.id ?? `qli-${Date.now()}-${i}`,
      equipmentId: line.equipmentId ?? null,
      description: line.description,
      qty: line.qty,
      rateType: line.rateType,
      rate: line.rate,
    })),
    issueDate: new Date().toISOString(),
    validUntil: new Date(
      Date.now() + data.validDays * 86_400_000
    ).toISOString(),
    status: "draft",
    notes: data.notes || "",
  };

  store.quotes.unshift(quote);

  if (quote.requestId) {
    const req = store.quoteRequests.find((r) => r.id === quote.requestId);
    if (req && req.status !== "converted") req.status = "converted";
  }

  return Response.json(quote, { status: 201 });
}
