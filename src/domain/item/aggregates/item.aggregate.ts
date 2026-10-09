import {
	Aggregate as AggregateBase,
	AggregateId,
	createAggregateFactory,
} from "@/src/domain/core/entity";
import {
	DomainInvalidAmountError,
	DomainRequiredFieldError,
	DomainValidationCause,
	DomainValidationError,
} from "@/src/domain/core/errors/validation.error";
import { CategoryId } from "@/src/domain/category/category-id";
import { StoreId } from "@/src/domain/store/store-id";
import { SpecificationId } from "@/src/domain/specification/specification-id";
import { SpecificationValueId } from "@/src/domain/specification/specification-value-id";
import { VendorId } from "@/src/domain/vendor/vendor-id";

export namespace Item {
	export type SpecificationAssignment = Readonly<{
		specificationId: SpecificationId;
		specificationValueId: SpecificationValueId;
	}>;
	export type SpecValue = Readonly<
		{ specificationId: SpecificationId } & (
			| { type: "OPTION"; optionId: SpecificationValueId }
			| { type: "STRING"; value: string }
			| { type: "NUMBER"; value: number }
			| { type: "BOOLEAN"; value: boolean }
		)
	>;
	export type VendorLink = Readonly<{
		vendorId: VendorId;
		vendorSku: string | null;
		costPrice: number | null;
		leadTimeDays: number | null;
		isPreferred: boolean;
	}>;
	export type Data = Readonly<{
		storeId: StoreId | null;
		categoryId: CategoryId | null;
		number: string;
		sku: string | null;
		barcode: string | null;
		name: string;
		description: string | null;
		unit: string;
		price: number;
		cost: number | null;
		isActive: boolean;
		specValues: readonly SpecValue[];
		vendors: readonly VendorLink[];
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
		specificationAssignments?: readonly SpecificationAssignment[];
		isDeleted?: boolean;
	}>;
	export type Tag = "Item";
	export type Aggregate = AggregateBase<Data, Tag>;
	export type Id = AggregateId<Tag>;

	export const factory = createAggregateFactory<Data, Aggregate, Tag>({
		tag: "Item",
		validate: (p) => {
			const i: DomainValidationCause[] = [];
			if (!p.name.trim()) i.push(new DomainRequiredFieldError("name"));
			if (!p.number.trim())
				i.push(new DomainRequiredFieldError("number"));
			if (!Number.isFinite(p.price) || p.price < 0)
				i.push(
					new DomainInvalidAmountError(
						"price",
						"price must be zero or positive",
					),
				);
			if (p.cost !== null && (!Number.isFinite(p.cost) || p.cost < 0))
				i.push(
					new DomainInvalidAmountError(
						"cost",
						"cost must be zero or positive",
					),
				);
			if (
				new Set(p.specValues.map((x) => String(x.specificationId)))
					.size !== p.specValues.length
			)
				i.push(
					new DomainInvalidAmountError(
						"specValues",
						"duplicate specification",
					),
				);
			if (
				new Set(p.vendors.map((x) => String(x.vendorId))).size !==
				p.vendors.length
			)
				i.push(
					new DomainInvalidAmountError(
						"vendors",
						"duplicate vendor",
					),
				);
			if (p.vendors.filter((x) => x.isPreferred).length > 1)
				i.push(
					new DomainInvalidAmountError(
						"vendors",
						"only one preferred vendor allowed",
					),
				);
			return i;
		},
		build: (id, p) => ({
			...p,
			id,
			name: p.name.trim(),
			number: p.number.trim(),
			specValues: [...p.specValues],
			vendors: [...p.vendors],
			specificationAssignments:
				p.specificationAssignments ??
				p.specValues
					.filter((x) => x.type === "OPTION")
					.map(
						(x) =>
							({
								specificationId: x.specificationId,
								specificationValueId: x.optionId,
							}) as SpecificationAssignment,
					),
			isDeleted: p.isDeleted ?? p.deletedAt !== null,
		}),
	});

	type CreateProps = Partial<
		Pick<
			Data,
			| "storeId"
			| "sku"
			| "barcode"
			| "unit"
			| "cost"
			| "isActive"
			| "isDeleted"
			| "vendors"
		>
	> & {
		name: string;
		number: string;
		description?: string | null;
		price: number;
		categoryId?: CategoryId | null;
		specValues?: readonly SpecValue[];
		specificationAssignments?: readonly SpecificationAssignment[];
	};
	const normalize = (p: CreateProps): Omit<Data, "id"> => ({
		storeId: p.storeId ?? null,
		categoryId: p.categoryId ?? null,
		number: p.number,
		sku: p.sku ?? null,
		barcode: p.barcode ?? null,
		name: p.name,
		description: p.description ?? null,
		unit: p.unit ?? "pcs",
		price: p.price,
		cost: p.cost ?? null,
		isActive: p.isActive ?? true,
		specValues:
			p.specValues ??
			[...new Map((p.specificationAssignments ?? []).map((x) => [String(x.specificationId), x])).values()].map((x) => ({
				specificationId: x.specificationId,
				type: "OPTION" as const,
				optionId: x.specificationValueId,
			})),
		vendors: p.vendors ?? [],
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: p.isDeleted ? new Date() : null,
		isDeleted: p.isDeleted ?? true,
	});

	export function create(props: CreateProps): Aggregate {
		return factory.create(normalize(props));
	}

	export const createNew = create;

	export function rehydrate(props: Data & { id: Id }): Aggregate {
		return factory.fromPersistence(props);
	}
	export function restore(
		props: CreateProps & {
			id: Id;
			createdAt?: Date;
			updatedAt?: Date;
			deletedAt?: Date | null;
		},
	): Aggregate {
		const d = normalize(props);
		return factory.fromPersistence({
			...d,
			...props,
			createdAt: props.createdAt ?? d.createdAt,
			updatedAt: props.updatedAt ?? d.updatedAt,
			id: props.id,
		});
	}
	export const update = restore;
	
	export function withChanges(
		entity: Aggregate,
		patch: Partial<Data>,
	): Aggregate {
		const { id, ...current } = entity;
		const updated = {
			...current,
			...patch,
			updatedAt: patch.updatedAt ?? new Date(),
		};
		const issues = factory.validate(updated);
		if (issues.length) throw new DomainValidationError(issues);
		return factory.fromPersistence({ id, ...updated });
	}
	export const changePrice = (
		entity: Aggregate,
		price: number,
		now = new Date(),
	) => withChanges(entity, { price, updatedAt: now });
	export const deactivate = (entity: Aggregate, now = new Date()) =>
		withChanges(entity, { isActive: false, updatedAt: now });
	export const softDelete = (entity: Aggregate, now = new Date()) =>
		withChanges(entity, {
			deletedAt: now,
			isActive: false,
			updatedAt: now,
		});
	export function assignSpecValue(
		entity: Aggregate,
		value: SpecValue,
		now = new Date(),
	): Aggregate {
		return withChanges(entity, {
			specValues: [
				...entity.specValues.filter(
					(x) => x.specificationId !== value.specificationId,
				),
				value,
			],
			updatedAt: now,
		});
	}
	export function removeSpecValue(
		entity: Aggregate,
		specificationId: SpecificationId,
		now = new Date(),
	): Aggregate {
		return withChanges(entity, {
			specValues: entity.specValues.filter(
				(x) => x.specificationId !== specificationId,
			),
			updatedAt: now,
		});
	}
	export function setVendor(
		entity: Aggregate,
		link: VendorLink,
		now = new Date(),
	): Aggregate {
		const vendors = [
			...entity.vendors
				.filter((x) => x.vendorId !== link.vendorId)
				.map((x) =>
					link.isPreferred ? { ...x, isPreferred: false } : x,
				),
			link,
		];
		return withChanges(entity, { vendors, updatedAt: now });
	}
	export function removeVendor(
		entity: Aggregate,
		vendorId: VendorId,
		now = new Date(),
	): Aggregate {
		return withChanges(entity, {
			vendors: entity.vendors.filter((x) => x.vendorId !== vendorId),
			updatedAt: now,
		});
	}
}
