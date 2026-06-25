"use client";

import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { createItemSchema } from "@/src/application/item/schema/create-item.schema";
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
import { Combobox } from "@/src/interface/ui/components/combobox/combobox";
import { ComboboxList } from "@/src/interface/ui/components/combobox/combobox-list";
import { ComboboxTrigger } from "@/src/interface/ui/components/combobox/combobox.trigger";
import { createApiClient } from "@/lib/api-client";
import { ClientRedirectHandler } from "@/lib/api-client/handlers/client-redirect-handler";
import { brand } from "@/lib/brand";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useCreateItemMutation } from "../../hooks/use-create-item-mutation";
import { uuid7GeneratorAdapter } from "@/lib/id-generator/uuid-generator.adapter";

export default function CreateItemForm() {
  const categories: CategoryDTO[] = [
    {
      id: brand(uuid7GeneratorAdapter.generate()),
      name: "asdasd",
    } as CategoryDTO,
    {
      id: brand(uuid7GeneratorAdapter.generate()),
      name: "asdasd2",
    } as CategoryDTO,
  ];

  const form = useForm<z.input<typeof createItemSchema>>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      specificationAssignments: [],
    },
  });

  const { mutate: mutateCreateItem, isPending: isMutateCreateItemPending } =
    useCreateItemMutation(
      createApiClient({ redirectHandler: new ClientRedirectHandler() }),
    );

  const handleCreateItem = (formData: z.input<typeof createItemSchema>) => {
    console.log(formData);
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
                <FieldLabel>Name</FieldLabel>
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
            name="number"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Number</FieldLabel>
                <Input
                  {...field}
                  id="create-item-field--number"
                  aria-invalid={fieldState.invalid}
                  placeholder="et-61q-123"
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
            render={({ field }) => (
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Combobox<CategoryDTO>
                  className="w-full"
                  items={categories}
                  valueKey="id"
                  labelKey="name"
                  value={field.value}
                  onChange={(value) => {
                    console.log(value);
                    if (value) field.onChange(value);
                    else field.onChange(undefined);
                  }}
                  placeholder="Select A Category"
                  menu={<ComboboxList />}
                >
                  <ComboboxTrigger className="w-full" />
                </Combobox>
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
                  id="create-item-field--description"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Price</FieldLabel>
                <Input
                  {...field}
                  id="create-item-field--price"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="100,000$"
                  autoComplete="off"
                  type="number"
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
          onClick={() => console.log(form.formState.errors)}
          loading={isMutateCreateItemPending}
        >
          Create Item
        </Button>
      </CardFooter>
    </Card>
  );
}
