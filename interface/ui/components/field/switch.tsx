import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switcher";
import { ComponentProps } from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

export type SwitchFieldProps<TForm extends FieldValues> = {
  name: Path<TForm>;
  label: ComponentProps<typeof FieldLabel>["children"];
  labelProps?: Omit<ComponentProps<typeof FieldLabel>, "children" | "htmlFor">;
  fieldProps?: ComponentProps<typeof Field>;
  fieldContentProps?: ComponentProps<typeof FieldContent>;
  switchProps?: Omit<ComponentProps<typeof Switch>, "name" | "checked" | "onCheckedChange">;
  errorProps?: ComponentProps<typeof FieldError>;
  hideError?: boolean;
};

export default function SwitchField<TForm extends FieldValues>({
  name,
  label,
  labelProps,
  fieldProps,
  fieldContentProps,
  switchProps,
  errorProps,
  hideError = false,
}: SwitchFieldProps<TForm>) {
  const form = useFormContext<TForm>();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field
          orientation="horizontal"
          {...fieldProps}
          data-invalid={fieldState.invalid}
        >
          <FieldContent {...fieldContentProps}>
            <FieldLabel htmlFor={switchProps?.id} {...labelProps}>
              {label}
            </FieldLabel>
            {!hideError && fieldState.invalid && (
              <FieldError errors={[fieldState.error]} {...errorProps} />
            )}
          </FieldContent>
          <Switch
            {...switchProps}
            name={field.name}
            checked={field.value}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
          />
        </Field>
      )}
    />
  );
}
