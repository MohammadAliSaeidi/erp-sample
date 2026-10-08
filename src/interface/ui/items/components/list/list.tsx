"use client";

import { createApiClient } from "@/lib/api-client";
import { ClientRedirectHandler } from "@/lib/api-client/handlers/client-redirect-handler";
import { ItemDTO } from "@/src/application/item/dto/item.dto";
import { Button } from "@/src/presentation/shared/components/ui/button";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { useGetItemsListQuery } from "../../hooks/use-get-items-list-query";

const columns: ColDef<ItemDTO>[] = [
	{
		sortable: false,
		resizable: false,
		width: 57,
		cellRenderer: (params: ICellRendererParams<ItemDTO>) => (
			<Button size="icon-xs" variant="ghost" disabled={!params.data}>
				<Link href={params.data ? `${params.data.id}/edit` : "#"}>
					<EyeIcon />
				</Link>
			</Button>
		),
	},
	{ field: "name" },
	{ field: "number" },
	{ field: "price" },
	{ field: "description" },
];

export default function List() {
	const { isFetching, data } = useGetItemsListQuery(
		createApiClient({
			redirectHandler: new ClientRedirectHandler(),
		}),
	);

	return (
		<AgGridReact
			columnDefs={columns}
			rowData={data ?? []}
			loading={isFetching}
		/>
	);
}
