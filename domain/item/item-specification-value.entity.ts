import { ItemId, SpecificationId, SpecificationValueId } from "@/features/shared/domain/ids"

export type ItemSpecificationValue = {
  itemId: ItemId
  specificationId: SpecificationId
  specificationValueId: SpecificationValueId
};