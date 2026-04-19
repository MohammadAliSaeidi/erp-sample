"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyLead } from "@/components/ui/typography/typography-lead";
import { createApiClient } from "@/features/shared/lib/api-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetCategoryByIdQueryOptions } from "../../hooks/use-get-category-by-id-query";
import { ClientRedirectHandler } from "@/features/shared/lib/api-client/handlers/client-redirect-handler";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import {
  editCategoryBody,
  EditCategoryBody,
} from "@/features/categories/domain/schemas/edit-category-body.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError } from "@/components/ui/field";
import EditableInput from "@/components/editable-input";
import Breadcrumb from "./breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CategoryDetailsProps = {
  categoryId: string;
};

export default function CategoryDetails(props: CategoryDetailsProps) {
  const { categoryId } = props;

  const { data: category, isFetching } = useSuspenseQuery(
    useGetCategoryByIdQueryOptions(
      categoryId,
      createApiClient({
        redirectHandler: new ClientRedirectHandler(),
      }),
    ),
  );

  const form = useForm<EditCategoryBody>({
    resolver: zodResolver(editCategoryBody),
    defaultValues: {
      id: category?.id,
      name: category?.name ?? "",
    },
  });

  useEffect(() => {
    if (!category) return;
    form.setValue("name", category.name);
  }, [category, categoryId, form]);

  return (
    <>
      <Breadcrumb categoryName={category?.name} />
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger disabled value="documents">
            Documents
          </TabsTrigger>
          <TabsTrigger disabled value="specifications">
            Specifications
          </TabsTrigger>
          <TabsTrigger disabled value="photos">
            Photos
          </TabsTrigger>
          <TabsTrigger disabled value="items">
            Items
          </TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <EditableInput
                value="test"
                onSave={() => {
                  console.log("save");
                }}
                // loading
                renderEditInput={({ ref }) => (
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Input
                          {...field}
                          ref={ref}
                          type="text"
                          aria-label="Name"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                )}
                renderViewInput={() => (
                  <TypographyLead>{category.name}</TypographyLead>
                )}
              />
              <EditableInput
                value="test"
                onSave={() => {
                  console.log("save");
                }}
                // loading
                renderEditInput={({ ref }) => (
                  <Controller
                    name=""
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <Input
                          {...field}
                          ref={ref}
                          type="text"
                          aria-label="Name"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                )}
                renderViewInput={() => (
                  <TypographyLead>{category.name}</TypographyLead>
                )}
              />
              {isFetching && <Skeleton className="w-1/2" />}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">Documents goes here</TabsContent>
      </Tabs>
    </>
  );
}
