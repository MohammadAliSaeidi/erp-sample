"use client";

import { URLS } from "@/constants/urls";
import { useStoreUrlSlug } from "@/hooks/use-store-url-slug";
import {
	BookOpenIcon,
	BotIcon,
	Settings2Icon,
	WarehouseIcon,
} from "lucide-react";
import { NavMainItem } from "./nav-main";

export const useSidebarData = (): NavMainItem[] => {
	const storeSlug = useStoreUrlSlug();

	return {
		navMain: [
			{
				title: "Inventory",
				url: storeSlug ? URLS.STORE.INVENTORY.INDEX(storeSlug) : "#",
				icon: <WarehouseIcon />,
				isActive: true,
				items: [
					{
						title: "Items",
						url: URLS.STORE.INVENTORY.ITEMS,
						icon: <WarehouseIcon />,
					},
				],
			},
		],
	};
};
