import AdminDashboardLayout from "@/src/presentation/shared/components/layouts/admin-dashboard-layout";
import { PropsWithChildren } from "react";
import InventoryRealtimeLayout from "./realtime-layout";

export default function layout({ children }: PropsWithChildren) {
	return (
		<AdminDashboardLayout>
			<InventoryRealtimeLayout>{children}</InventoryRealtimeLayout>
		</AdminDashboardLayout>
	);
}
