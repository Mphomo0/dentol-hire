import { store, nextId } from "@/lib/store";
import { quoteRequestSchema } from "@/lib/validation";
import type { QuoteRequest } from "@/lib/types";

export async function GET() {
  return Response.json(store.quoteRequests);
}

export async function POST(request: Request) {
  const raw = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!raw) {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof raw.durationDays === "string") {
    raw.durationDays = Number(raw.durationDays);
  }

  const parsed = quoteRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const record: QuoteRequest = {
    id: nextId("qr"),
    createdAt: new Date().toISOString(),
    name: data.name,
    company: data.company || "",
    email: data.email,
    phone: data.phone,
    interests: data.interests,
    itemNotes: data.itemNotes,
    startDate: new Date(data.startDate).toISOString(),
    durationDays: data.durationDays,
    message: data.message || "",
    status: "new",
  };

  store.quoteRequests.unshift(record);
  return Response.json(record, { status: 201 });
}
