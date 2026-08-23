import { RentalsClient } from "@/components/admin/rentals-client";
import { store } from "@/lib/store";

export default function RentalsPage() {
  return <RentalsClient initialRentals={store.rentals} />;
}
