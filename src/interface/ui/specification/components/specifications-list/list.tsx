"use client";

import { useGetCategorySpecificationsQuery } from "../../hooks/use-get-category-specifications";
import SpecificationListItem from "./item";
import { createApiClient } from "@/lib/api-client";
import { ClientRedirectHandler } from "@/lib/api-client/handlers/client-redirect-handler";

type SpecificationsListProps = {
  categoryId: string;
};

export default function SpecificationsList(props: SpecificationsListProps) {
  const { categoryId } = props;

  const apiClient = createApiClient({
    redirectHandler: new ClientRedirectHandler(),
  });

  const { data: specifications } = useGetCategorySpecificationsQuery(
    categoryId,
    apiClient,
  );

  return (
    <>
      {specifications?.map((specification) => (
        <SpecificationListItem key={specification.id} {...specification} />
      ))}
    </>
  );
}
