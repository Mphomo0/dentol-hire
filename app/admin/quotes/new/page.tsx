import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/admin/ui";
import { seedEquipment } from "@/lib/data/equipment";
import { store } from "@/lib/store";

const DocumentBuilder = dynamic(() =>
  import("@/components/admin/document-builder").then((m) => m.DocumentBuilder)
);

export const metadata: Metadata = { title: "New Quote" };

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const str = (k: string) => {
    const v = sp[k];
    return typeof v === "string" ? decodeURIComponent(v) : "";
  };

  return (
    <>
      <PageHeader
        title="New quote"
        subtitle="Build an itemised quote — catalog items auto-fill rates."
      />
      <DocumentBuilder
        mode="quote"
        equipment={seedEquipment}
        initialCustomer={{
          name: str("name"),
          company: str("company"),
          email: str("email"),
          phone: str("phone"),
        }}
        vat={{ enabled: store.settings.vatEnabled, rate: store.settings.vatRate }}
      />
    </>
  );
}
