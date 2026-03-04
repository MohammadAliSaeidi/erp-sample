import { SiteHeader } from "@/app/store/[storeSlug]/_components/header";
import AppSidebar from "@/app/store/[storeSlug]/_components/sidebar/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";

export default function AdminDashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="px-4 py-3">{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
