import { Item } from "@/domain/item/item.entity";
import { ItemSpecificationAssignmentDTO } from "./item-specification-assignment.dto";
import { Prettify } from "@/features/shared/types/prettify.type";

export type ItemDTO = Prettify<
  Omit<Item, "id" | "categoryId" | "specificationAssignments"> & {
    id: string;
    categoryId?: string;
    isDeleted: boolean;
    categoryName?: string;
    specificationAssignments: ItemSpecificationAssignmentDTO[];
  }
>;
