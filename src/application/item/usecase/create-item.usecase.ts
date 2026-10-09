import { brand } from "@/lib/brand";
import { defineUsecase } from "@/src/application/core/usecase/factories";
import type { StoreAuthContext } from "@/src/application/core/usecase/types/context.types";
import { Item } from "@/src/domain/item/aggregates/item.aggregate";
import type { ItemRepositoryPort } from "@/src/domain/item/item-repository.port";
import { StoreId } from "@/src/domain/store/store-id";
import { SpecificationId } from "@/src/domain/specification/specification-id";
import { SpecificationValueId } from "@/src/domain/specification/specification-value-id";
import type { IItemQueryPort } from "../port/item.query.port";
import { ItemDTO } from "../dto/item.dto";
import { CategoryRepositoryPort } from "@/src/domain/category/category-repository.port";
import { NotFoundError } from "../../core/errors/application.error";

export type CreateItemInputDTO = {
	name: string;
	number: string;
	description?: string;
	price: number;
	categoryId?: string;
	specificationAssignments: ReadonlyArray<{
		specificationId: string;
		specificationValueId: string;
	}>;
};

export type CreateItemUsecaseDeps = {
	itemRepository: Pick<ItemRepositoryPort, "create">;
	itemQuery: Pick<IItemQueryPort, "getItemDTOById">;
	categoryRepository: CategoryRepositoryPort;
};

export const createItemUsecase = defineUsecase<
	CreateItemInputDTO,
	ItemDTO,
	StoreAuthContext,
	CreateItemUsecaseDeps
>(async (input, context, deps) => {
	const storeId = brand<string, "StoreId">(context.storeId) as StoreId;

	const existingCategory = input.categoryId
		? await deps.categoryRepository.getById(
				brand(input.categoryId),
				brand(context.storeId),
			)
		: null;

	if (!existingCategory)
		throw new NotFoundError(`Category ${input.categoryId} was not found`);

	const item = Item.createNew({
		name: input.name,
		number: input.number,
		description: input.description ?? null,
		price: input.price,
		categoryId: input.categoryId ? brand(input.categoryId) : undefined,
		specificationAssignments: input.specificationAssignments.map(
			(assignment) => ({
				specificationId: brand<string, SpecificationId>(
					assignment.specificationId,
				) as SpecificationId,
				specificationValueId: brand<string, SpecificationValueId>(
					assignment.specificationValueId,
				) as SpecificationValueId,
			}),
		),
	});

	const createdItem = await deps.itemRepository.create(item, storeId);

	const resultCategory: {
		name: string;
		description?: string;
		id: string;
	} = input.categoryId
		? {
				id: String(existingCategory.id),
				name: existingCategory.name,
				description: existingCategory.description ?? undefined,
			}
		: undefined;

	const result: ItemDTO = {
		description: createdItem.description,
		name: createdItem.name,
		number: createdItem.number,
		price: createdItem.price,
		isDeleted: createdItem.isDeleted,
		id: createdItem.id,
		category: resultCategory,
		specificationAssignments: createdItem.specificationAssignments.map(
			(assignment) => ({
				specificationId: assignment.specificationId,
				specificationValueId: assignment.specificationValueId,
			}),
		),
	};

	return result;
});
