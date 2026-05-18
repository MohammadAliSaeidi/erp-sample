import AdminDashboardContentLayout from "@/src/presentation/components/layouts/admin-dashboard-content-layout";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
	return (
		<AdminDashboardContentLayout>{children}</AdminDashboardContentLayout>
	);
}
