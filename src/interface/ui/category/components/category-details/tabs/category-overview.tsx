import { EditCategoryInputDTO as EditCategoryForm } from "@/src/application/category/dto/edit-category-input.dto";
import { editCategorySchema } from "@/src/application/category/schema/edit-category.schema";
import EditableInput from "@/src/presentation/components/editable-input";
import { Card, CardContent } from "@/src/presentation/components/ui/card";
import { Field, FieldError } from "@/src/presentation/components/ui/field";
import { Input } from "@/src/presentation/components/ui/input";
import { Label } from "@/src/presentation/components/ui/label";
import { Separator } from "@/src/presentation/components/ui/separator";
import { Skeleton } from "@/src/presentation/components/ui/skeleton";
import { Textarea } from "@/src/presentation/components/ui/textarea";
import { TypographyH3 } from "@/src/presentation/components/ui/typography/typography-h3";
import { TypographyP } from "@/src/presentation/components/ui/typography/typography-p";
import { createApiClient } from "@/lib/api-client";
import { ClientRedirectHandler } from "@/lib/api-client/handlers/client-redirect-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useGetCategoryByIdQueryOptions } from "../../../hooks/use-get-category-by-id-query";

type CategoryOverviewProps = {
  categoryId: string;
};

export default function CategoryOverview(props: CategoryOverviewProps) {
  const { categoryId } = props;

  const { data: category, isFetching } = useSuspenseQuery(
    useGetCategoryByIdQueryOptions(
      categoryId,
      createApiClient({
        redirectHandler: new ClientRedirectHandler(),
      }),
    ),
  );

  const form = useForm<EditCategoryForm>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      id: category?.id,
      name: category?.name ?? "",
    },
  });

  useEffect(() => {
    if (!category) return;
    form.reset({
      name: category.name,
      description: category.description ?? undefined,
    });
  }, [category, categoryId, form]);

  return (
    <Card>
      <CardContent>
        {/* Name section with proper heading hierarchy */}
        <section
          aria-labelledby="category-name-heading"
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <h2 id="category-name-heading" className="sr-only">
              Category Name
            </h2>
            <Label
              aria-label="Name"
              className="text-sm text-muted-foreground"
              htmlFor="category-name"
            >
              Name
            </Label>

            <EditableInput
              editLayout="horizontal"
              viewLayout="horizontal"
              onSave={() => {
                toast.error("Save Name Has Not Been Implemented");
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
                          fieldState.invalid ? "category-name-error" : undefined
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

          <Separator />

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
                toast.error("Save Description Has Not Been Implemented");
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
                  {category.description && (
                    <TypographyP>{category.description}</TypographyP>
                  )}
                  {!category.description && (
                    <p className="text-sm text-gray-300">No description</p>
                  )}
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
  );
}
