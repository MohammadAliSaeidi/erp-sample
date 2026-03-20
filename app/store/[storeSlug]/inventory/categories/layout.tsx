import AdminDashboardContentLayout from "@/components/layouts/admin-dashboard-content-layout";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<AdminDashboardContentLayout>{children}</AdminDashboardContentLayout>
	);
}
