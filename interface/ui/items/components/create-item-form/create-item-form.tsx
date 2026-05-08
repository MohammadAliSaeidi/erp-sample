"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { createItemSchema } from "@/interface/schema/item/create-item.schema";
import { createApiClient } from "@/lib/api-client";
import { ClientRedirectHandler } from "@/lib/api-client/handlers/client-redirect-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useCreateItemMutation } from "../../hooks/use-create-item-mutation";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/interface/ui/components/combobox/combobox";
import { ComboboxList } from "@/interface/ui/components/combobox/combobox-list";
import { ComboboxTrigger } from "@/interface/ui/components/combobox/combobox.trigger";
import { CategoryDTO } from "@/interface/dto/category/category.dto";
import { brand } from "@/lib/brand";

export default function CreateItemForm() {
  const form = useForm<z.input<typeof createItemSchema>>({
    resolver: zodResolver(createItemSchema),
  });

  const { mutate: mutateCreateItem, isPending: isMutateCreateItemPending } =
    useCreateItemMutation(
      createApiClient({ redirectHandler: new ClientRedirectHandler() }),
    );

  const handleCreateItem = (formData: z.input<typeof createItemSchema>) => {
    mutateCreateItem(formData, {
      onSuccess: () => {
        toast.success(`Item "${formData.name}" has been created successfully`);
        form.reset();
      },
    });
  };

  return (
    <Card>
      <CardContent>
        <form
          id="store-create-item-form"
          onSubmit={form.handleSubmit(handleCreateItem)}
          className="flex flex-col items-end gap-4"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <div className="flex items-center gap-2">
                  <FieldLabel>Name</FieldLabel>
                </div>
                <Input
                  {...field}
                  id="create-item-field--name"
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
            control={form.control}
            name="categoryId"
            render={({ fieldState }) => (
              <Combobox<CategoryDTO>
                items={[
                  { id: brand("1"), name: "asdasd" },
                  { id: brand("2"), name: "asdasd2" },
                ]}
                onChange={(v) => console.log(v)}
                placeholder="Select A Category"
                renderItem={(item, state) => <div>asdasd</div>}
                menu={<ComboboxList />}
              >
                <ComboboxTrigger />
              </Combobox>
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
                  id="create-item-field--description"
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
        <Button
          type="submit"
          form="store-create-item-form"
          loading={isMutateCreateItemPending}
        >
          Create Item
        </Button>
      </CardFooter>
    </Card>
  );
}
