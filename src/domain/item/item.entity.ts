import { Item as ItemAggregate } from "./aggregates/item.aggregate";
import { ItemId } from "./item-id";
import { CategoryId } from "../category/category-id";
import { SpecificationId } from "../specification/specification-id";
import { SpecificationValueId } from "../specification/specification-value-id";

/** @deprecated Use `Item.Aggregate` from `./aggregates/item.aggregate` */
export type ItemSpecificationAssignment =
  ItemAggregate.ItemSpecificationAssignment;

/** @deprecated Use `Item.Aggregate` from `./aggregates/item.aggregate` */
export type Item = ItemAggregate.Aggregate;

export const createItem = (input: {
  id: ItemId;
  name: string;
  number: string;
  description?: string;
  price: number;
  categoryId?: CategoryId;
  specificationAssignments: ItemSpecificationAssignment[];
  isDeleted: boolean;
}): Item =>
  ItemAggregate.rehydrate({
    id: input.id as ItemAggregate.Id,
    name: input.name,
    number: input.number,
    description: input.description ?? null,
    price: input.price,
    categoryId: input.categoryId as CategoryId,
    specificationAssignments: input.specificationAssignments.map(
      (assignment) => ({
        specificationId: assignment.specificationId as SpecificationId,
        specificationValueId:
          assignment.specificationValueId as SpecificationValueId,
      }),
    ),
    isDeleted: input.isDeleted,
  });
