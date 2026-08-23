import { SettingsClient } from "@/components/admin/settings-client";
import { store } from "@/lib/store";

export default function SettingsPage() {
  return <SettingsClient initialSettings={store.settings} />;
}
