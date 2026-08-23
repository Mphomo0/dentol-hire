import { nextId, store } from "@/lib/store";
import { contactSchema } from "@/lib/validation";
import type { ContactMessage } from "@/lib/types";

export async function GET() {
  return Response.json(store.contactMessages);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const record: ContactMessage = {
    id: nextId("msg"),
    createdAt: new Date().toISOString(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
    handled: false,
  };

  store.contactMessages.unshift(record);
  return Response.json(record, { status: 201 });
}
