import { z } from "zod";
import { nextId, nextRentalReference, store } from "@/lib/store";
import type { Rental } from "@/lib/types";

const convertSchema = z
  .object({
    startDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    notes: z.string().max(600).optional(),
  })
  .refine((d) => d.dueDate > d.startDate, {
    message: "Due date must be after the start date",
    path: ["dueDate"],
  });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const invoice = store.invoices.find((i) => i.id === id);
  if (!invoice) {
    return Response.json({ error: "Invoice not found" }, { status: 404 });
  }

  if (invoice.status !== "paid") {
    return Response.json(
      { error: "Invoice must be paid before it can be converted to a rental." },
      { status: 422 }
    );
  }

  if (store.rentals.some((r) => r.invoiceId === invoice.id)) {
    return Response.json(
      { error: "This invoice has already been converted to a rental." },
      { status: 409 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = convertSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const equipmentLines = invoice.items.filter((line) => line.equipmentId);
  if (equipmentLines.length === 0) {
    return Response.json(
      {
        error:
          "This invoice has no equipment line items — there's nothing to hand out.",
      },
      { status: 422 }
    );
  }

  for (const line of equipmentLines) {
    const eq = store.equipment.find((e) => e.id === line.equipmentId);
    if (eq && line.qty > eq.unitsAvailable) {
      return Response.json(
        {
          error: `Not enough stock for "${eq.name}" — ${eq.unitsAvailable} available, ${line.qty} required.`,
        },
        { status: 409 }
      );
    }
  }

  for (const line of equipmentLines) {
    const eq = store.equipment.find((e) => e.id === line.equipmentId);
    if (eq) eq.unitsAvailable -= line.qty;
  }

  const data = parsed.data;
  const rental: Rental = {
    id: nextId("ren"),
    reference: nextRentalReference(store.rentals),
    invoiceId: invoice.id,
    customer: invoice.customer,
    items: equipmentLines.map((line) => ({
      equipmentId: line.equipmentId as string,
      name:
        store.equipment.find((e) => e.id === line.equipmentId)?.name ??
        line.description,
      qty: line.qty,
      rateType: line.rateType,
      rate: line.rate,
    })),
    startDate: data.startDate.toISOString(),
    dueDate: data.dueDate.toISOString(),
    returnedDate: null,
    notes: data.notes || "",
  };

  store.rentals.unshift(rental);

  return Response.json(rental, { status: 201 });
}
