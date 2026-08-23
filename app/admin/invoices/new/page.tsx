import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { DocumentBuilder } from "@/components/admin/document-builder";
import { seedEquipment } from "@/lib/data/equipment";
import { store } from "@/lib/store";

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
