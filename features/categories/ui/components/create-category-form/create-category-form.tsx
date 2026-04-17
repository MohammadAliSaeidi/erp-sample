"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createCategoryBody } from "@/features/categories/domain/schemas/create-category-body.schema";
import { CreateCategoryBody } from "@/features/categories/domain/types/create-category-body.type";
import { createApiClient } from "@/features/shared/lib/api-client";
import { ClientRedirectHandler } from "@/features/shared/lib/api-client/handlers/client-redirect-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateCategoryMutation } from "../../hooks/use-create-item-mutation";

function CreateCategoryForm() {
  const form = useForm<CreateCategoryBody>({
    resolver: zodResolver(createCategoryBody),
    defaultValues: {
      name: "",
    },
  });

  const {
    mutate: mutateCreateCategory,
    isPending: isMutateCreateCategoryPending,
  } = useCreateCategoryMutation(
    createApiClient({ redirectHandler: new ClientRedirectHandler() }),
  );

  const handleCreateCategory = (formData: CreateCategoryBody) => {
    mutateCreateCategory(formData, {
      onSuccess: () => {
        toast.success(`Category "${formData.name}" has been successfully`);
        form.reset();
      },
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleCreateCategory)}
      className="flex flex-nowrap items-end gap-4"
    >
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
              {...field}
              id="create-category-field--name"
              aria-invalid={fieldState.invalid}
              placeholder="Ex: Phones, Cars, ELectronics, etc."
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" loading={isMutateCreateCategoryPending}>
        Create
      </Button>
    </form>
  );
}

export default CreateCategoryForm;
