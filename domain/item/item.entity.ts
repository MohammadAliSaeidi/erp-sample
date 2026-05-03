import { CategoryId } from "../category/category-id";
import { ItemId } from "./item-id";
import { SpecificationId } from "../specification/specification-id";
import { SpecificationValueId } from "../specification/specification-value-id";

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
};

const uniq = <T>(arr: T[], key: (x: T) => string) => {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of arr) {
    const k = key(x);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(x);
  }
  return out;
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

  if (!input.categoryId) throw new Error("categoryId is required");

  // for each specification, there should be only one assignment
  const assignmentsClean = (input.specificationAssignments ?? []).map((a) => ({
    specificationId: a.specificationId,
    specificationValueId: a.specificationValueId,
  }));

  const uniqueBySpec = uniq(assignmentsClean, (a) => a.specificationId);

  return {
    ...input,
    name: input.name.trim(),
    number: input.number.trim(),
    specificationAssignments: uniqueBySpec,
  };
};
