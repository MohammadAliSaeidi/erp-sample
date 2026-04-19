"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginInputSchema } from "@/features/auth/domain/schemas/login-body.schema";
import { useIsHydrated } from "@/features/shared/hooks/use-is-hydrated";
import { useParamBasedRedirect } from "@/features/shared/hooks/use-safe-redirect";
import { cn } from "@/features/shared/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import React, { useActionState, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActionResult } from "@/features/shared/adapters/action/map-operation-error-to-action-result";
import { loginAction } from "../../actions/login.action";
import type { LoginInput as LoginInputType } from "../../domain/types/login-body.type";
import { Prettify } from "@/features/shared/types/prettify.type";
import { startTransition } from "react";

export type LoginFormProps = React.ComponentProps<"div"> & {
  storeSlug: string;
};

export function LoginForm({ className, storeSlug, ...props }: LoginFormProps) {
  const isHydrated = useIsHydrated();

  const { handleSubmit, control, setValue } = useForm<LoginInputType>({
    defaultValues: {
      storeSlug: "",
      username: "",
      password: "",
    },
    resolver: zodResolver(loginInputSchema),
  });

  useEffect(() => {
    setValue("storeSlug", storeSlug);
  }, [setValue, storeSlug]);

  const safeRedirect = useParamBasedRedirect({
    paramKey: "redirect",
    defaultPath: `/store/${storeSlug}/admin/dashboard`,
  });

  const [state, formAction, isPending] = useActionState(
    async (
      previousState: ActionResult<null> | null,
      formData: LoginInputType,
    ) => {
      const result = await loginAction(formData);

      if (result.ok) {
        safeRedirect();
        return result;
      }

      return result;
    },
    null,
  );

  const onSubmit = handleSubmit(async (formValues: LoginInputType) => {
    startTransition(async () => {
      formAction(formValues);
    });
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="backdrop-blur-2xl bg-card/5 border-border/10 border backdrop-brightness-125">
        <CardHeader>
          <CardTitle className="text-white/90">Login</CardTitle>
          <CardDescription className="text-white/50">
            Enter your Username and Password below to login to your store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <Controller
                  control={control}
                  name="username"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Field data-invalid={invalid}>
                      <LoginFieldLabel htmlFor="login-username-field">
                        Username
                      </LoginFieldLabel>
                      <LoginInput
                        {...field}
                        id="login-username-field"
                        aria-invalid={invalid}
                        key={"login-username-field"}
                        placeholder="admin_1234"
                        autoComplete="username"
                        type="text"
                      />
                      {invalid && <FieldError errors={[error]} />}
                    </Field>
                  )}
                />
              </Field>
              <Field>
                <Controller
                  control={control}
                  name="password"
                  render={({ field, fieldState: { invalid, error } }) => (
                    <Field>
                      <LoginFieldLabel htmlFor="login-password-field">
                        Password
                      </LoginFieldLabel>
                      <LoginInput
                        {...field}
                        id="login-password-field"
                        key="login-password-field"
                        aria-invalid={invalid}
                        placeholder="1234"
                      />
                      {invalid && <FieldError errors={[error]} />}
                    </Field>
                  )}
                />
              </Field>
              <Field>
                <Button
                  loading={isPending || !isHydrated}
                  disabled={!isHydrated}
                  type="submit"
                >
                  Login
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function LoginInput(
  props: React.ComponentProps<typeof Input>,
) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const type = isPasswordVisible ? "text" : "password";
  const endIcon = isPasswordVisible ? (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
    >
      <EyeIcon />
    </Button>
  ) : (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
    >
      <EyeClosedIcon />
    </Button>
  );

  return (
    <Input
      {...props}
      type={type}
      endIcon={endIcon}
      className={cn(
        "bg-transparent text-white border-white/30 border placeholder-white/30",
        props.className,
      )}
    />
  );
}

function LoginFieldLabel(props: React.ComponentProps<typeof FieldLabel>) {
  return (
    <FieldLabel {...props} className={cn("text-white/70", props.className)} />
  );
}
