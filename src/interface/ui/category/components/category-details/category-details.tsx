"use client";

import { createApiClient } from "@/lib/api-client";
import { ClientRedirectHandler } from "@/lib/api-client/handlers/client-redirect-handler";
import { useTabManager } from "@/lib/tabs/use-tab-manager";
import { ShadcnTabNavigation } from "@/src/presentation/shared/components/ui/tab-navigation";
import {
	Tabs,
	TabsContent,
} from "@/src/presentation/shared/components/ui/tabs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetCategoryByIdQueryOptions } from "../../hooks/use-get-category-by-id-query";
import Breadcrumb from "./breadcrumb";
import {
	CategoryTab,
	CategoryTabProps,
	categoryTabsConfig,
} from "./tab-config";

type CategoryDetailsProps = {
	categoryId: string;
};

export default function CategoryDetails(props: CategoryDetailsProps) {
	const { categoryId } = props;

	const { data: category } = useSuspenseQuery(
		useGetCategoryByIdQueryOptions(
			categoryId,
			createApiClient({
				redirectHandler: new ClientRedirectHandler(),
			}),
		),
	);

	const tabProps: CategoryTabProps = {
		categoryId,
		categoryName: category?.name ?? "",
	};

	const { activeTab, availableTabs, changeTab, ActiveComponent } =
		useTabManager(
			{
				tabs: categoryTabsConfig,
				defaultTab: CategoryTab.Overview,
			},
			tabProps,
		);

	return (
		<>
			<nav aria-label="Breadcrumb navigation">
				<Breadcrumb categoryName={category?.name} />
			</nav>

			<Tabs
				value={activeTab}
				onValueChange={(val) => changeTab(val as CategoryTab)}
			>
				<ShadcnTabNavigation
					tabs={availableTabs}
					activeTab={activeTab}
					onTabChange={changeTab}
					ariaLabel="Category sections"
				/>
				{ActiveComponent && (
					<TabsContent
						value={activeTab}
						forceMount
						className="mt-4"
					>
						<ActiveComponent {...tabProps} />
					</TabsContent>
				)}
			</Tabs>
		</>
	);
}
