import { SpecificationId } from "../specification/specification-id";
import { SpecificationValueId } from "../specification/specification-value-id";
import { ItemId } from "./item-id";

export type ItemSpecificationValue = {
  itemId: ItemId;
  specificationId: SpecificationId;
  specificationValueId: SpecificationValueId;
};
