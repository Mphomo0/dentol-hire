import { store } from "@/lib/store";
import type { InvoiceStatus } from "@/lib/types";

const ALLOWED: InvoiceStatus[] = ["draft", "sent", "paid", "overdue"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const invoice = store.invoices.find((i) => i.id === id);
  if (!invoice) {
    return Response.json({ error: "Invoice not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as {
    status?: string;
  } | null;

  if (
    !body ||
    !body.status ||
    !ALLOWED.includes(body.status as InvoiceStatus)
  ) {
    return Response.json({ error: "Invalid status" }, { status: 422 });
  }

  invoice.status = body.status as InvoiceStatus;
  return Response.json(invoice);
}
