import { store } from "@/lib/store";
import type { QuoteRequestStatus } from "@/lib/types";

const ALLOWED: QuoteRequestStatus[] = [
  "new",
  "reviewed",
  "converted",
  "archived",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const record = store.quoteRequests.find((r) => r.id === id);
  if (!record) {
    return Response.json({ error: "Quote request not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as {
    status?: string;
  } | null;

  if (!body || !body.status || !ALLOWED.includes(body.status as QuoteRequestStatus)) {
    return Response.json({ error: "Invalid status" }, { status: 422 });
  }

  record.status = body.status as QuoteRequestStatus;
  return Response.json(record);
}
