import { createApiClient } from "@/features/shared/lib/api-client";
import { ServerRedirectHandler } from "@/features/shared/lib/api-client/handlers/server-redirect-handler";
import { useGetCategoryByIdQuery } from "../../hooks/use-get-category-by-id-query";

type CategoryDetailsProps = {
  categoryId: string;
};

export default function CategoryDetails(props: CategoryDetailsProps) {
  const { categoryId } = props;

  const {} = useGetCategoryByIdQuery(
    categoryId,
    createApiClient({ redirectHandler: new ServerRedirectHandler() }),
  );

  return <div></div>;
}
