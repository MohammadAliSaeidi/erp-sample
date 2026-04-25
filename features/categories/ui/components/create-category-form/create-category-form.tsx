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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function CreateCategoryForm() {
  const form = useForm<CreateCategoryBody>({
    resolver: zodResolver(createCategoryBody),
    defaultValues: {
      name: "",
      description: "",
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
    <Card>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(handleCreateCategory)}
          className="flex flex-col items-end gap-4"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <div className="flex items-center gap-2">
                  <FieldLabel>Name</FieldLabel>
                  <UniqueCategoryNameTooltip />
                </div>
                <Input
                  {...field}
                  id="create-category-field--name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Must Be Unique. Ex: Phones, Cars, ELectronics, etc."
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  {...field}
                  id="create-category-field--description"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" loading={isMutateCreateCategoryPending}>
          Create Category
        </Button>
      </CardFooter>
    </Card>
  );
}

function UniqueCategoryNameTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <InfoIcon className="w-4 h-4 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        <p>Name Must Be Unique</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default CreateCategoryForm;
