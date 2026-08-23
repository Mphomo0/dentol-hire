import { store } from "@/lib/store";
import type { QuoteStatus } from "@/lib/types";

const ALLOWED: QuoteStatus[] = ["draft", "sent", "accepted", "declined"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quote = store.quotes.find((q) => q.id === id);
  if (!quote) {
    return Response.json({ error: "Quote not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as {
    status?: string;
  } | null;

  if (!body || !body.status || !ALLOWED.includes(body.status as QuoteStatus)) {
    return Response.json({ error: "Invalid status" }, { status: 422 });
  }

  quote.status = body.status as QuoteStatus;
  return Response.json(quote);
}
