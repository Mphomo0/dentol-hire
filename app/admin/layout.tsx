import type { Metadata } from "next";
import { AdminSidebar, AdminMobileNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = {
  title: {
    default: "Staff Portal",
    template: "%s | Dantol Hire Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-background">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileNav />
        <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
