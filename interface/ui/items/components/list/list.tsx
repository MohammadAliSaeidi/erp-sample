"use client";

import { AgGridReact } from "ag-grid-react";
import { useGetItemsListQuery } from "../../hooks/use-get-items-list-query";
import { createApiClient } from "@/lib/api-client";
import { ClientRedirectHandler } from "@/lib/api-client/handlers/client-redirect-handler";

export default function List() {
  const { isFetching, data } = useGetItemsListQuery(
    createApiClient({
      redirectHandler: new ClientRedirectHandler(),
    }),
  );

  return (
    <AgGridReact
      columnDefs={[
        {
          field: "name",
        },
        { field: "number" },
        {
          field: "price",
        },
        {
          field: "description",
        },
      ]}
      rowData={data ?? []}
      loading={isFetching}
    />
  );
}
