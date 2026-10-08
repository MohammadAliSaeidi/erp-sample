"use client";

import { URLS } from "@/constants/urls";
import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
	Breadcrumb as BreadcrumbUIComponent,
} from "@/src/presentation/shared/components/ui/breadcrumb";
import { useStoreUrlSlug } from "@/src/presentation/shared/hooks/use-store-url-slug";
import Link from "next/link";
export default function Breadcrumb() {
	const storeSlug = useStoreUrlSlug();

	return (
		<BreadcrumbUIComponent>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link
							href={
								storeSlug
									? URLS.STORE.ADMIN.DASHBOARD(storeSlug)
									: "#"
							}
						>
							Dashboard
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link
							href={
								storeSlug
									? URLS.STORE.ADMIN.INVENTORY.INDEX(
											storeSlug,
										)
									: "#"
							}
						>
							Inventory
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link
							href={
								storeSlug
									? URLS.STORE.ADMIN.INVENTORY.CATEGORIES.LIST(
											storeSlug,
										)
									: "#"
							}
						>
							Categories
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<span className="text-primary">Create Category</span>
					</BreadcrumbLink>
				</BreadcrumbItem>
			</BreadcrumbList>
		</BreadcrumbUIComponent>
	);
}
