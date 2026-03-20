"use client";

import { Category } from "@/app/generated/prisma/client";
import AgGridReact from "@/components/ag-grid-react";
import { Button } from "@/components/ui/button";
import { createApiClient } from "@/features/shared/lib/api-client";
import { ClientRedirectHandler } from "@/features/shared/lib/api-client/handlers/client-redirect-handler";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { EyeIcon } from "lucide-react";
import Link from "next/link";
import { buildGetCategoriesQueryOptions } from "../../hooks/use-get-category-query";

const columns: ColDef<Category>[] = [
  {
    sortable: false,
    resizable: false,
    width: 57,
    cellRenderer: (params: ICellRendererParams<Category>) => (
      <Button size="icon-xs" variant={"ghost"} disabled={!params.data}>
        <Link href={params.data ? `categories/${params.data?.id}` : "#"}>
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
  const { data, isFetching } = useSuspenseQuery(
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
