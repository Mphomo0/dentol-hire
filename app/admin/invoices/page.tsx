import { InvoicesClient } from "@/components/admin/invoices-client";
import { store } from "@/lib/store";

export default function InvoicesPage() {
  const { settings, invoices, rentals } = store;
  return (
    <InvoicesClient
      initialInvoices={invoices}
      initialRentals={rentals}
      vat={{ enabled: settings.vatEnabled, rate: settings.vatRate }}
    />
  );
}
