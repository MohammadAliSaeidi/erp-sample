import { uniq } from "@/lib/uniq/uniq";
import { CategoryId } from "../category/category-id";
import { SpecificationId } from "../specification/specification-id";
import { SpecificationValueId } from "../specification/specification-value-id";
import { ItemId } from "./item-id";

export type ItemSpecificationAssignment = {
  specificationId: SpecificationId;
  specificationValueId: SpecificationValueId;
};

export type Item = {
  id: ItemId;
  name: string;
  number: string;
  description?: string;
  price: number;
  categoryId?: CategoryId;
  specificationAssignments: ItemSpecificationAssignment[];
  isDeleted: boolean;
};

export const createItem = (input: Item): Item => {
  if (input.name.trim().length === 0) throw new Error("Item name is required");

  if (input.number.trim().length === 0)
    throw new Error("Item number is required");

  if (
    input.price === undefined ||
    Number.isNaN(input.price) ||
    input.price < 0
  ) {
    throw new Error("Invalid price");
  }

  // if (!input.categoryId) throw new Error("categoryId is required");

  // If no categoryId, do not check specValues, return empty specificationAssignments
  let processedSpecificationAssignments: ItemSpecificationAssignment[];
  if (!input.categoryId) {
    processedSpecificationAssignments = [];
  } else {
    // for each specification, there should be only one assignment
    const assignmentsClean = (input.specificationAssignments ?? []).map((a) => ({
      specificationId: a.specificationId,
      specificationValueId: a.specificationValueId,
    }));

    processedSpecificationAssignments = uniq(assignmentsClean, (a) => a.specificationId);
  }

  return {
    ...input,
    name: input.name.trim(),
    number: input.number.trim(),
    specificationAssignments: processedSpecificationAssignments,
  };
};
