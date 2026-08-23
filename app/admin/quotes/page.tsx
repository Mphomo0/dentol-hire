import { QuotesClient } from "@/components/admin/quotes-client";
import { store } from "@/lib/store";

export default function QuotesPage() {
  const { settings, quotes } = store;
  return (
    <QuotesClient
      initialQuotes={quotes}
      vat={{ enabled: settings.vatEnabled, rate: settings.vatRate }}
    />
  );
}
