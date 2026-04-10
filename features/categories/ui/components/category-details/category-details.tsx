"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyLead } from "@/components/ui/typography/typography-lead";
import { createApiClient } from "@/features/shared/lib/api-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetCategoryByIdQueryOptions } from "../../hooks/use-get-category-by-id-query";
import { ClientRedirectHandler } from "@/features/shared/lib/api-client/handlers/client-redirect-handler";

type CategoryDetailsProps = {
	categoryId: string;
};

export default function CategoryOverview(props: CategoryDetailsProps) {
	const { categoryId } = props;

	const { data: category, isFetching } = useSuspenseQuery(
		useGetCategoryByIdQueryOptions(
			categoryId,
			createApiClient({
				redirectHandler: new ClientRedirectHandler(),
			}),
		),
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Overview</CardTitle>
			</CardHeader>
			<CardContent>
				<TypographyLead>{category.name}</TypographyLead>
				{isFetching && <Skeleton className="w-1/2" />}
			</CardContent>
		</Card>
	);
}
