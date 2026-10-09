import { brand } from "@/lib/brand";
import { CategoryId } from "@/src/domain/category/category-id";
import {
	Aggregate as AggregateBase,
	AggregateId,
	createAggregateFactory,
} from "@/src/domain/core/entity";
import { DomainRequiredFieldError } from "@/src/domain/core/errors/validation.error";
import { SpecificationValueId } from "@/src/domain/specification/specification-value-id";
import { SpecificationValueType } from "@/src/domain/specification/specification-value-type.enum";
import { StoreId } from "@/src/domain/store/store-id";

export namespace Specification {
	export type OptionId = SpecificationValueId;
	export type SpecificationValueData = Readonly<{
		id: SpecificationValueId;
		value: string | boolean | number;
	}>;

	export type Data = Readonly<{
		name: string;
		categoryId: CategoryId | null;
		storeId: StoreId;
		type: SpecificationValueType;
		isRequired: boolean;
		isPrimary: boolean;
		specificationValues: readonly SpecificationValueData[];
		isActive: boolean;
	}>;

	export type Tag = "Specification";
	export type Aggregate = AggregateBase<Data, Tag>;
	export type Id = AggregateId<Tag>;

	type ValueInput = Readonly<{
		value: string | boolean | number;
	}>;

	type CreateProps = {
		name: string;
		categoryId: CategoryId;
		storeId: StoreId;
		type: SpecificationValueType;
		isRequired: boolean;
		isPrimary: boolean;
		specificationValues: readonly ValueInput[];
		isActive?: boolean;
		generateValueId?: () => string;
	};

	type RehydrateProps = Omit<
		CreateProps,
		"generateValueId" | "categoryId"
	> & {
		id: Id;
		categoryId: CategoryId | null;
		specificationValues: readonly SpecificationValueData[];
	};

	export const factory = createAggregateFactory<Data, Aggregate, Tag>({
		tag: "Specification",
		validate: (props) => {
			const issues = [];
			if (!props.name.trim()) issues.push(new DomainRequiredFieldError("name"));
			if (new Set(props.specificationValues.map((v) => String(v.value))).size !== props.specificationValues.length) {
				issues.push(new DomainRequiredFieldError("specificationValues"));
			}
			return issues;
		},
		build: (id, props) => ({
			id,
			...props,
		}),
	});

	function assertValuesMatchType(
		type: SpecificationValueType,
		values: readonly SpecificationValueData[],
	): void {
		if (type === SpecificationValueType.BOOLEAN) {
			values.forEach((specValue) => {
				if (typeof specValue.value !== "boolean") {
					throw new Error(
						"All Spec Values must be boolean if the spec type is boolean",
					);
				}
			});
		}

		if (type === SpecificationValueType.NUMBER) {
			values.forEach((specValue) => {
				if (typeof specValue.value !== "number") {
					throw new Error(
						"All Spec Values must be number if the spec type is number",
					);
				}
			});
		}

		if (type === SpecificationValueType.STRING) {
			values.forEach((specValue) => {
				if (typeof specValue.value !== "string") {
					throw new Error(
						"All Spec Values must be string if the spec type is string",
					);
				}
			});
		}

	}

	export function create(props: CreateProps): Aggregate {
		if (!props.name?.trim()) {
			throw new DomainRequiredFieldError("name");
		}

		const generateValueId =
			props.generateValueId ?? (() => crypto.randomUUID());
		const specificationValues = props.specificationValues.map(
			(specValue) => ({
				id: brand<string, "SpecificationValueId">(
					generateValueId(),
				) as SpecificationValueId,
				value: specValue.value,
			}),
		);

		assertValuesMatchType(props.type, specificationValues);

		return factory.create({
			name: props.name.trim(),
			categoryId: props.categoryId,
			storeId: props.storeId,
			type: props.type,
			isRequired: props.isRequired,
			isPrimary: props.isPrimary,
			specificationValues,
			isActive: props.isActive ?? true,
		});
	}

	export function rehydrate(props: RehydrateProps): Aggregate {
		return factory.fromPersistence({
			id: props.id,
			name: props.name.trim(),
			categoryId: props.categoryId,
			storeId: props.storeId,
			type: props.type,
			isRequired: props.isRequired,
			isPrimary: props.isPrimary,
			specificationValues: props.specificationValues,
			isActive: props.isActive ?? true,
		});
	}
}
