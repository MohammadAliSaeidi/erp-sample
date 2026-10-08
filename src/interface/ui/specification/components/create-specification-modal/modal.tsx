import { getQueryClient } from "@/lib/get-query-client";
import { createSpecificationSchema } from "@/src/application/specification/schema/create-specification.schema";
import { CategoryId } from "@/src/domain/category/category-id";
import { SpecificationValueType } from "@/src/domain/specification/specification-value-type.enum";
import { createSpecificationAction } from "@/src/interface/actions/specification/create-specification.action";
import SwitchField from "@/src/interface/ui/components/field/switch";
import { Button } from "@/src/presentation/shared/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/src/presentation/shared/components/ui/dialog";
import {
	Field,
	FieldContent,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/src/presentation/shared/components/ui/field";
import { Input } from "@/src/presentation/shared/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/presentation/shared/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import {
	Controller,
	FormProvider,
	useFieldArray,
	useForm,
	useFormContext,
	useFormState,
	useWatch,
} from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { CATEGORY_SPECIFICATIONS_QUERY_KEYS } from "../../constants/query-keys";

type CreateSpecificationModalProps = {
	categoryId: string;
};

export default function CreateSpecificationModal(
	props: CreateSpecificationModalProps,
) {
	const { categoryId } = props;
	const [pending, startTransition] = useTransition();
	const [open, setOpen] = useState(false);
	const form = useForm<z.input<typeof createSpecificationSchema>>({
		resolver: zodResolver(createSpecificationSchema),
		defaultValues: {
			isPrimary: false,
			isRequired: false,
			categoryId: categoryId,
		},
	});

	const { setValue } = form;

	useEffect(() => {
		setValue("categoryId", categoryId as CategoryId);
	}, [categoryId, setValue]);

	const specType = useWatch({
		control: form.control,
		name: "type",
	});

	const query = getQueryClient();

	const onSubmit = form.handleSubmit((data) => {
		startTransition(async () => {
			console.log(data);
			const res = await createSpecificationAction({
				...data,
			});

			if (!res.ok) {
				toast.error(res.error?.message ?? "Something went wrong");
				return;
			}

			setOpen(false);
			toast.success("Specification created successfully");
			query.invalidateQueries({
				queryKey:
					CATEGORY_SPECIFICATIONS_QUERY_KEYS.list(categoryId),
			});
		});
	});

	return (
		<Dialog
			open={open}
			onOpenChange={(open: boolean) => {
				setOpen(open);
				if (!open) {
					form.reset();
				}
			}}
		>
			<DialogTrigger asChild>
				<Button size={"default"}>
					<PlusIcon />
					Create Specification
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Specification</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						console.log(form.formState.errors);
						onSubmit(e);
					}}
					id="create-specification-form"
				>
					<FormProvider {...form}>
						<FieldGroup>
							<Controller
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field
										data-invalid={
											fieldState.invalid
										}
									>
										<FieldLabel htmlFor="field-name">
											Name
										</FieldLabel>
										<Input
											{...field}
											id="field-name"
											aria-invalid={
												fieldState.invalid
											}
											placeholder="Specification name"
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError
												errors={[
													fieldState.error,
												]}
											/>
										)}
									</Field>
								)}
							/>
							<Controller
								name="type"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field
										orientation="responsive"
										data-invalid={
											fieldState.invalid
										}
									>
										<FieldContent>
											<FieldLabel htmlFor="form-rhf-select-language">
												Type
											</FieldLabel>
										</FieldContent>
										<Select
											name={field.name}
											value={field.value}
											onValueChange={
												field.onChange
											}
										>
											<SelectTrigger
												id="field-type"
												aria-invalid={
													fieldState.invalid
												}
												className="min-w-[120px]"
											>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent position="item-aligned">
												<SelectItem
													value={
														SpecificationValueType.STRING
													}
												>
													String
												</SelectItem>
												<SelectItem
													value={
														SpecificationValueType.NUMBER
													}
												>
													Number
												</SelectItem>
												<SelectItem
													value={
														SpecificationValueType.BOOLEAN
													}
												>
													Boolean
												</SelectItem>
											</SelectContent>
										</Select>
										{fieldState.invalid && (
											<FieldError
												errors={[
													fieldState.error,
												]}
											/>
										)}
									</Field>
								)}
							/>
							<SwitchField<
								z.input<
									typeof createSpecificationSchema
								>
							>
								label={"Primary"}
								name="isPrimary"
								switchProps={{ id: "field-is-primary" }}
							/>
							<SwitchField<
								z.input<
									typeof createSpecificationSchema
								>
							>
								label={"Required"}
								name="isRequired"
								switchProps={{
									id: "field-is-required",
								}}
							/>
							<SpecValuesSection specType={specType} />
						</FieldGroup>
					</FormProvider>
				</form>
				<DialogFooter>
					<Button
						className="w-full"
						type="submit"
						form="create-specification-form"
						loading={pending}
					>
						Create
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

type SpecValuesSectionProps = {
	specType?: SpecificationValueType;
};

function SpecValuesSection(props: SpecValuesSectionProps) {
	const { specType } = props;
	const form = useFormContext<z.input<typeof createSpecificationSchema>>();

	const { errors } = useFormState({
		control: form.control,
		name: "specificationValues",
	});

	// array-level vs item-level errors
	const specificationValuesErrors = errors?.specificationValues;

	const arrayError = !Array.isArray(specificationValuesErrors)
		? (specificationValuesErrors?.root?.message ??
			specificationValuesErrors?.message)
		: undefined;

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "specificationValues",
	});

	if (!specType) return null;

	if (specType === SpecificationValueType.BOOLEAN) {
		return (
			<FieldGroup>
				<div className="text-sm text-muted-foreground">
					Boolean specifications accept true/false values
					automatically.
				</div>
			</FieldGroup>
		);
	}

	return (
		<FieldGroup>
			<div className="max-h-56 overflow-y-auto space-y-2 pr-1">
				{arrayError && (
					<FieldError errors={[{ message: arrayError }]} />
				)}

				{fields.map((field, index) => (
					<div
						key={field.id}
						className="flex items-center gap-2"
					>
						<Controller
							name={`specificationValues.${index}.value`}
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<Input
										{...field}
										value={normalizeValue(
											field.value,
											specType,
										)}
										type={inputType(specType)}
										placeholder={placeholderText(
											specType,
										)}
										onChange={(e) =>
											field.onChange(
												parseValue(
													e.target.value,
													specType,
												),
											)
										}
										aria-invalid={
											fieldState.invalid
										}
									/>
									<FieldError
										errors={[fieldState.error]}
									/>
								</Field>
							)}
						/>
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => remove(index)}
						>
							<TrashIcon className="w-4 h-4" />
						</Button>
					</div>
				))}
			</div>

			<Button
				type="button"
				variant="outline"
				onClick={() => append({ value: defaultValue(specType) })}
			>
				<PlusIcon className="w-4 h-4 mr-2" />
				Add value
			</Button>
		</FieldGroup>
	);
}

function inputType(type: SpecificationValueType) {
	return type === SpecificationValueType.NUMBER ? "number" : "text";
}

function placeholderText(type: SpecificationValueType) {
	return type === SpecificationValueType.NUMBER ? "Numeric value" : "Value";
}

function defaultValue(type: SpecificationValueType) {
	return type === SpecificationValueType.NUMBER ? 0 : "";
}

function normalizeValue(
	value: string | number | boolean | undefined,
	type: SpecificationValueType,
) {
	if (typeof value === "boolean") return "";
	return type === SpecificationValueType.NUMBER
		? Number(value)
		: String(value);
}

function parseValue(raw: string, type: SpecificationValueType) {
	return type === SpecificationValueType.NUMBER ? Number(raw) : raw;
}
