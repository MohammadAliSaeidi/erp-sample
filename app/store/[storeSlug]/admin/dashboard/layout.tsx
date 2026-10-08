import AdminDashboardLayout from "@/src/presentation/shared/components/layouts/admin-dashboard-layout";
import { PropsWithChildren } from "react";

export default function layout({ children }: PropsWithChildren) {
	return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
