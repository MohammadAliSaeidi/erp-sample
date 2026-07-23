"use client";

import { editItemSchema } from "@/src/application/item/schema/edit.item.schema";
import { Button } from "@/src/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/src/presentation/components/ui/card";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/src/presentation/components/ui/field";
import { Input } from "@/src/presentation/components/ui/input";
import { Textarea } from "@/src/presentation/components/ui/textarea";
import { createApiClient } from "@/lib/api-client";
import { ClientRedirectHandler } from "@/lib/api-client/handlers/client-redirect-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useEditItemMutation } from "../../hooks/use-edit-item-mutation";
import { useGetItemByIdQuery } from "../../hooks/use-get-item-by-id-query";
import { useItemEditLock } from "../../hooks/use-item-edit-lock";
import LockStatusBanner from "../lock-status-banner/lock-status-banner";

type EditItemFormProps = {
  itemId: string;
};

export default function EditItemForm({ itemId }: EditItemFormProps) {
  const apiClient = createApiClient({
    redirectHandler: new ClientRedirectHandler(),
  });

  const { data: item, isLoading } = useGetItemByIdQuery(itemId, apiClient);
  const { lockState, canEdit } = useItemEditLock(itemId);

  const form = useForm<z.input<typeof editItemSchema>>({
    resolver: zodResolver(editItemSchema),
    values: item
      ? {
          id: item.id,
          name: item.name,
          number: item.number,
          description: item.description ?? "",
          price: item.price,
          categoryId: item.categoryId,
        }
      : undefined,
  });

  const { mutate: mutateEditItem, isPending } = useEditItemMutation(apiClient);

  const handleEditItem = (formData: z.input<typeof editItemSchema>) => {
    mutateEditItem(formData, {
      onSuccess: (updated) => {
        toast.success(`Item "${updated.name}" has been updated successfully`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  if (isLoading || !item) {
    return <div className="text-sm text-muted-foreground">Loading item...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <LockStatusBanner lockState={lockState} />
      <Card>
        <CardContent>
          <form
            id="store-edit-item-form"
            onSubmit={form.handleSubmit(handleEditItem)}
            className="flex flex-col items-end gap-4"
          >
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    {...field}
                    disabled={!canEdit}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="number"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Number</FieldLabel>
                  <Input
                    {...field}
                    disabled={!canEdit}
                    aria-invalid={fieldState.invalid}
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
                    disabled={!canEdit}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Price</FieldLabel>
                  <Input
                    {...field}
                    disabled={!canEdit}
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    type="number"
                    autoComplete="off"
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
          <Button
            type="submit"
            form="store-edit-item-form"
            loading={isPending}
            disabled={!canEdit}
          >
            Save Item
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
