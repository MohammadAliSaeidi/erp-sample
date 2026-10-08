"use client";

import { createApiClient } from "@/lib/api-client";
import { ClientRedirectHandler } from "@/lib/api-client/handlers/client-redirect-handler";
import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import AgGridReact from "@/src/presentation/shared/components/ag-grid-react";
import { Button } from "@/src/presentation/shared/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { buildGetCategoriesQueryOptions } from "../../hooks/use-get-category-query";

const columns: ColDef<CategoryDTO>[] = [
	{
		sortable: false,
		resizable: false,
		width: 57,
		cellRenderer: (params: ICellRendererParams<CategoryDTO>) => (
			<Button size="icon-xs" variant={"ghost"} disabled={!params.data}>
				<Link
					href={
						params.data
							? `categories/${params.data?.id}`
							: "#"
					}
				>
					<EyeIcon />
				</Link>
			</Button>
		),
	},
	{
		field: "name",
		minWidth: 100,
	},
];

function CategoriesList() {
	const { data, isFetching } = useQuery(
		buildGetCategoriesQueryOptions(
			createApiClient({
				redirectHandler: new ClientRedirectHandler(),
			}),
		),
	);

	const categories = data ?? [];

	return (
		<AgGridReact
			loading={isFetching}
			columnDefs={columns}
			rowData={categories}
			domLayout="normal"
		/>
	);
}

export default CategoriesList;
