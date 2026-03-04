"use client";

import { SearchForm } from "@/app/store/[storeSlug]/_components/sidebar/search-form";
import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftIcon } from "lucide-react";

export function SiteHeader() {
	const { toggleSidebar } = useSidebar();

	return (
		<header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
			<div className="flex h-(--header-height) w-full items-center gap-2 px-4">
				<Button
					className="h-8 w-8"
					variant="ghost"
					size="icon"
					onClick={toggleSidebar}
				>
					<PanelLeftIcon />
				</Button>
				<Separator
					orientation="vertical"
					className="me-2 data-vertical:h-4 data-vertical:self-auto"
				/>
				<Breadcrumb className="hidden sm:block">
					<BreadcrumbList>
						{/* TODO: Implement dynamic Breadcrumb logic */}
					</BreadcrumbList>
				</Breadcrumb>
				<SearchForm className="w-full sm:ms-auto sm:w-auto" />
			</div>
		</header>
	);
}
