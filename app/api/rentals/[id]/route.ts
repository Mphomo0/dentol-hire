import { store } from "@/lib/store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rental = store.rentals.find((r) => r.id === id);
  if (!rental) {
    return Response.json({ error: "Rental not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as {
    action?: string;
  } | null;

  if (body?.action !== "mark-returned") {
    return Response.json(
      { error: "Unsupported action. Use { action: 'mark-returned' }." },
      { status: 422 }
    );
  }
  if (rental.returnedDate) {
    return Response.json({ error: "Already returned" }, { status: 409 });
  }

  rental.returnedDate = new Date().toISOString();

  for (const line of rental.items) {
    const eq = store.equipment.find((e) => e.id === line.equipmentId);
    if (eq && eq.unitsAvailable < eq.unitsTotal) {
      eq.unitsAvailable += line.qty;
    }
  }

  return Response.json(rental);
}
