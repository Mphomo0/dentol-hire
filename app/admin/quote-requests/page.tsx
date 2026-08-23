import { QuoteRequestsClient } from "@/components/admin/quote-requests-client";
import { store } from "@/lib/store";

export default function QuoteRequestsPage() {
  return <QuoteRequestsClient initialRequests={store.quoteRequests} />;
}
