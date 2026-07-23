import { Item } from "@/src/domain/item/aggregates/item.aggregate";
import { ItemSpecificationAssignmentDTO } from "./item-specification-assignment.dto";
import { Prettify } from "@/features/shared/types/prettify.type";

export type ItemDTO = Prettify<
  Omit<Item.Data, "categoryId" | "specificationAssignments"> & {
    id: string;
    categoryId?: string;
    isDeleted: boolean;
    categoryName?: string;
    specificationAssignments: ItemSpecificationAssignmentDTO[];
  }
>;
