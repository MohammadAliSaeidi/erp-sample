"use client";

import { URLS } from "@/constants/urls";
import { useStoreUrlSlug } from "@/hooks/use-store-url-slug";
import { BoxesIcon, BoxIcon, WarehouseIcon } from "lucide-react";
import { NavMainItem } from "./nav-main";

export const useSidebarData = (): NavMainItem[] => {
	const storeSlug = useStoreUrlSlug();

	return [
		{
			title: "Inventory",
			url: storeSlug ? URLS.STORE.INVENTORY.INDEX(storeSlug) : "#",
			icon: <WarehouseIcon />,
			isActive: true,
			items: [
				{
					title: "Items",
					url: storeSlug ? URLS.STORE.INVENTORY.ITEMS.LIST(storeSlug) : "#",
					icon: <BoxIcon />,
				},
				{
					title: "Categories",
					url: storeSlug ? URLS.STORE.INVENTORY.CATEGORIES.LIST(storeSlug) : "#",
					icon: <BoxesIcon />
				}
			],
		},
	];
};
