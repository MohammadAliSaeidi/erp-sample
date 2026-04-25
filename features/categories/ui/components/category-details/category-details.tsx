"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { TypographyH3 } from "@/components/ui/typography/typography-h3";
import { Label } from "@/components/ui/label";
import { TypographyMuted } from "@/components/ui/typography/typography-muted";
import { TypographyP } from "@/components/ui/typography/typography-p";
import { Textarea } from "@/components/ui/textarea";

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
          <Card>
            <CardHeader>
              <CardTitle id="overview-tab">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Name section with proper heading hierarchy */}
              <section aria-labelledby="category-name-heading">
                <h2 id="category-name-heading" className="sr-only">
                  Category Name
                </h2>

                <div className="flex flex-col gap-2">
                  <Label
                    aria-label="Name"
                    className="text-sm text-muted-foreground"
                    htmlFor="category-name"
                  >
                    Name
                  </Label>

                  <EditableInput
                    onSave={() => {
                      console.log("save");
                    }}
                    renderEditInput={() => (
                      <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Input
                              {...field}
                              id="category-name"
                              type="text"
                              aria-label="Edit category name"
                              aria-describedby={
                                fieldState.invalid
                                  ? "category-name-error"
                                  : undefined
                              }
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                              <div id="category-name-error" role="alert">
                                <FieldError errors={[fieldState.error]} />
                              </div>
                            )}
                          </Field>
                        )}
                      />
                    )}
                    renderViewInput={() => (
                      <div aria-label="Current category name">
                        <TypographyH3>{category.name}</TypographyH3>
                      </div>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    aria-label="Description"
                    className="text-sm text-muted-foreground"
                    htmlFor="category-description"
                  >
                    Description
                  </Label>

                  <EditableInput
                    editLayout="vertical"
                    viewLayout="horizontal"
                    className="w-full"
                    onSave={() => {
                      console.log("save");
                    }}
                    renderEditInput={() => (
                      <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Textarea
                              {...field}
                              id="category-description"
                              className="resize-y min-h-16 max-h-40 min-w-100"
                              aria-label="Edit category description"
                              aria-describedby={
                                fieldState.invalid
                                  ? "category-description-error"
                                  : undefined
                              }
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                              <div id="category-description-error" role="alert">
                                <FieldError errors={[fieldState.error]} />
                              </div>
                            )}
                          </Field>
                        )}
                      />
                    )}
                    renderViewInput={() => (
                      <div aria-label="Current category name">
                        {category.description &&<TypographyP>{category.description }</TypographyP>}
                        {!category.description && <TypographyMuted><span className="text-sm">No description</span></TypographyMuted>}
                      </div>
                    )}
                  />
                </div>

                {isFetching && (
                  <div aria-live="polite" aria-busy={isFetching}>
                    <Skeleton className="w-1/2" />
                    <span className="sr-only">Loading category details...</span>
                  </div>
                )}
              </section>
            </CardContent>
          </Card>
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
