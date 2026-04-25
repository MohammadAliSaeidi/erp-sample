"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createApiClient } from "@/features/shared/lib/api-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetCategoryByIdQueryOptions } from "../../hooks/use-get-category-by-id-query";
import { ClientRedirectHandler } from "@/features/shared/lib/api-client/handlers/client-redirect-handler";
import Breadcrumb from "./breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryOverview from "./category-overview";

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

  return (
    <>
      {/* Breadcrumb navigation landmark */}
      <nav aria-label="Breadcrumb navigation">
        <Breadcrumb categoryName={category?.name} />
      </nav>

      <Tabs defaultValue="overview">
        <TabsList aria-label="Category sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger disabled value="specifications">
            Specifications
          </TabsTrigger>
          <TabsTrigger disabled value="items">
            Items
          </TabsTrigger>
          <TabsTrigger disabled value="documents">
            Documents
          </TabsTrigger>
          <TabsTrigger disabled value="photos">
            Photos
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          role="tabpanel"
          aria-labelledby="overview-tab"
        >
          <CategoryOverview categoryId={categoryId} />
        </TabsContent>

        <TabsContent
          value="documents"
          role="tabpanel"
          aria-labelledby="documents-tab"
        >
          <Card>
            <CardHeader>
              <CardTitle id="documents-tab">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Documents goes here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
