import { SpecificationId } from "../specification/specification-id";
import { SpecificationValueId } from "../specification/specification-value-id";
import { ItemId } from "./item-id";

export type ItemSpecificationValue = Readonly<{
  itemId: ItemId;
  specificationId: SpecificationId;
  optionId: SpecificationValueId | null;
  valueString: string | null;
  valueNumber: number | null;
  valueBoolean: boolean | null;
}>;

export const createItemSpecificationValue = (input: ItemSpecificationValue): ItemSpecificationValue => {
  const set = [input.optionId !== null, input.valueString !== null, input.valueNumber !== null, input.valueBoolean !== null].filter(Boolean).length;
  if (set !== 1) throw new Error("exactly one specification value must be set");
  return Object.freeze({ ...input });
};
