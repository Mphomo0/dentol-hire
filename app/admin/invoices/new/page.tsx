import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/admin/ui";
import { seedEquipment } from "@/lib/data/equipment";
import { store } from "@/lib/store";

const DocumentBuilder = dynamic(() =>
  import("@/components/admin/document-builder").then((m) => m.DocumentBuilder)
);

export const metadata: Metadata = { title: "New Invoice" };

export default function NewInvoicePage() {
  return (
    <>
      <PageHeader
        title="New invoice"
        subtitle="Bill a customer — convert accepted quotes or start fresh."
      />
      <DocumentBuilder
        mode="invoice"
        equipment={seedEquipment}
        vat={{ enabled: store.settings.vatEnabled, rate: store.settings.vatRate }}
      />
    </>
  );
}
