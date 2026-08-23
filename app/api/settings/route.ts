import { z } from "zod";
import { store } from "@/lib/store";

const settingsSchema = z.object({
  address: z.string().min(1).max(300),
  phone: z.string().min(1).max(60),
  emails: z.array(z.email()).min(1).max(10),
  vatEnabled: z.boolean(),
  vatRate: z.coerce.number().min(0).max(100),
  vatNumber: z.string().max(60),
});

export async function GET() {
  return Response.json(store.settings);
}

export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  store.settings = parsed.data;
  return Response.json(store.settings);
}
