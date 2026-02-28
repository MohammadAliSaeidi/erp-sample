import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
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
					<form>
						<FieldGroup>
							<Field>
								<LoginFieldLabel
									htmlFor="Username"
									className="text-white/70"
								>
									Email
								</LoginFieldLabel>
								<LoginInput
									id="email"
									type="email"
									placeholder="m@example.com"
									required
								/>
							</Field>
							<Field>
								<div className="flex items-center">
									<LoginFieldLabel
										htmlFor="password"
										className="text-white/70"
									>
										Password
									</LoginFieldLabel>
								</div>
								<LoginInput
									id="password"
									type="password"
									required
								/>
							</Field>
							<Field>
								<Button type="submit">Login</Button>
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