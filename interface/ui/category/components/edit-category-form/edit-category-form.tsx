"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { editCategorySchema } from "@/interface/schema/category/edit-category.schema";
import { createApiClient } from "@/lib/api-client";
import { ClientRedirectHandler } from "@/lib/api-client/handlers/client-redirect-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";
import { useEditCategoryMutation } from "../../hooks/use-edit-category-mutation";
import { useGetCategoryByIdQuery } from "../../hooks/use-get-category-by-id-query";
import { EditCategoryInputDTO } from "@/interface/dto/category/edit-category-input.dto";

export type EditCategoryFormProps = {
  categoryId: string;
};

function EditCategoryForm(props: EditCategoryFormProps) {
  const { categoryId } = props;
  const apiClient = createApiClient({
    redirectHandler: new ClientRedirectHandler(),
  });

  const { data: category } = useGetCategoryByIdQuery(categoryId, apiClient);
  const { mutate: mutateEditCategory, isPending: isMutateEditCategoryPending } =
    useEditCategoryMutation(apiClient);

  const form = useForm<EditCategoryInputDTO>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      id: categoryId,
      name: "",
    },
  });

  useEffect(() => {
    if (!category) return;
    form.setValue("name", category.name);
  }, [category, form]);

  const handleEditCategory = (formData: EditCategoryInputDTO) => {
    mutateEditCategory(formData, {
      onSuccess: () =>
        toast.success(
          `Category "${formData.name}" has been updated successfully`,
        ),
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleEditCategory)}>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
              {...field}
              id="edit-category-field--name"
              aria-invalid={fieldState.invalid}
              placeholder="Ex: Phones, Cars, Electronics, etc."
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" loading={isMutateEditCategoryPending}>
        Save
      </Button>
    </form>
  );
}

export default EditCategoryForm;
