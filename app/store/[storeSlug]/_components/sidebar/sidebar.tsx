"use client";

import * as React from "react";

import { NavMain } from "@/app/store/[storeSlug]/_components/sidebar/nav-main";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { useSidebarData } from "./use-sidebar-data";

export default function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const sidebarData = useSidebarData();

	return (
		<Sidebar
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
			{...props}
		>
			<SidebarContent>
				<NavMain items={sidebarData.navMain} />
			</SidebarContent>
		</Sidebar>
	);
}
