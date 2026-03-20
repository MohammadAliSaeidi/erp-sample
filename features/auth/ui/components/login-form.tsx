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
import { SpinnerCustom } from "@/components/ui/spinner";
import { loginBodySchema } from "@/features/auth/domain/schemas/login-body.schema";
import { useIsHydrated } from "@/features/shared/hooks/use-is-hydrated";
import { useParamBasedRedirect } from "@/features/shared/hooks/use-safe-redirect";
import { cn } from "@/features/shared/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoginBody } from "../../domain/types/login-body.type";
import { useLoginMutation } from "../hooks/use-log-in-mutation";
import {
	clientApiClient,
	createApiClient,
} from "@/features/shared/lib/api-client";
import { ClientRedirectHandler } from "@/features/shared/lib/api-client/handlers/client-redirect-handler";

export type LoginFormProps = React.ComponentProps<"div"> & {
	storeSlug: string;
};

export function LoginForm({ className, storeSlug, ...props }: LoginFormProps) {
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	const isHydrated = useIsHydrated();

	const { handleSubmit, control } = useForm<LoginBody>({
		defaultValues: {
			username: "",
			password: "",
		},
		resolver: zodResolver(loginBodySchema),
	});

	const { mutate: login } = useLoginMutation(
		createApiClient({ redirectHandler: new ClientRedirectHandler() }),
	);
	const safeRedirect = useParamBasedRedirect({
		paramKey: "redirect",
		defaultPath: `/store/${storeSlug}/dashboard`,
	});

	const onSubmit = handleSubmit(async (formValues: LoginBody) => {
		login(formValues, { onSuccess: () => safeRedirect() });
	});

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="backdrop-blur-2xl bg-card/5 border-border/10 border backdrop-brightness-125">
				<CardHeader>
					<CardTitle className="text-white/90">Login</CardTitle>
					<CardDescription className="text-white/50">
						Enter your Username and Password below to login to
						your store.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit}>
						<FieldGroup>
							<Field>
								<Controller
									control={control}
									name="username"
									render={({
										field,
										fieldState: {
											invalid,
											error,
										},
									}) => (
										<Field data-invalid={invalid}>
											<LoginFieldLabel htmlFor="login-username-field">
												Username
											</LoginFieldLabel>
											<LoginInput
												{...field}
												id="login-username-field"
												aria-invalid={
													invalid
												}
												key={
													"login-username-field"
												}
												placeholder="admin_1234"
												autoComplete="username"
												type="text"
											/>
											{invalid && (
												<FieldError
													errors={[
														error,
													]}
												/>
											)}
										</Field>
									)}
								/>
							</Field>
							<Field>
								<Controller
									control={control}
									name="password"
									render={({
										field,
										fieldState: {
											invalid,
											error,
										},
									}) => (
										<Field>
											<LoginFieldLabel htmlFor="login-password-field">
												Password
											</LoginFieldLabel>
											<LoginInput
												{...field}
												id="login-password-field"
												key="login-password-field"
												type={
													isPasswordVisible
														? "text"
														: "password"
												}
												aria-invalid={
													invalid
												}
												placeholder="1234"
												endIcon={
													isPasswordVisible ? (
														<EyeIcon />
													) : (
														<EyeClosedIcon />
													)
												}
											/>
											{invalid && (
												<FieldError
													errors={[
														error,
													]}
												/>
											)}
										</Field>
									)}
								/>
							</Field>
							<Field>
								<Button
									disabled={!isHydrated}
									type="submit"
								>
									{isHydrated ? (
										"Login"
									) : (
										<SpinnerCustom />
									)}
								</Button>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

function LoginInput(props: React.ComponentProps<typeof Input>) {
	return (
		<Input
			{...props}
			className={cn(
				"bg-transparent text-white border-white/30 border placeholder-white/30",
				props.className,
			)}
		/>
	);
}

function LoginFieldLabel(props: React.ComponentProps<typeof FieldLabel>) {
	return (
		<FieldLabel
			{...props}
			className={cn("text-white/70", props.className)}
		/>
	);
}
