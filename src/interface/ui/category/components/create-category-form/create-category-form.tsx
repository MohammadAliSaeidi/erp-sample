"use client";

import { createApiClient } from "@/lib/api-client";
import { ClientRedirectHandler } from "@/lib/api-client/handlers/client-redirect-handler";
import { CreateCategoryInputDTO } from "@/src/application/category/dto/create-category-input.dto";
import { createCategorySchema } from "@/src/application/category/schema/create-category.schema";
import { Button } from "@/src/presentation/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
} from "@/src/presentation/shared/components/ui/card";
import {
	Field,
	FieldError,
	FieldLabel,
} from "@/src/presentation/shared/components/ui/field";
import { Input } from "@/src/presentation/shared/components/ui/input";
import { Textarea } from "@/src/presentation/shared/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/src/presentation/shared/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateCategoryMutation } from "../../hooks/use-create-category-mutation";

function CreateCategoryForm() {
	const form = useForm<CreateCategoryInputDTO>({
		resolver: zodResolver(createCategorySchema),
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

	const handleCreateCategory = (formData: CreateCategoryInputDTO) => {
		mutateCreateCategory(formData, {
			onSuccess: () => {
				toast.success(
					`Category "${formData.name}" has been created successfully`,
				);
				form.reset();
			},
		});
	};

	return (
		<Card>
			<CardContent>
				<form
					id="store-create-category-form"
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
									<FieldError
										errors={[fieldState.error]}
									/>
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
									<FieldError
										errors={[fieldState.error]}
									/>
								)}
							</Field>
						)}
					/>
				</form>
			</CardContent>
			<CardFooter>
				<Button
					type="submit"
					form="store-create-category-form"
					loading={isMutateCreateCategoryPending}
				>
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
