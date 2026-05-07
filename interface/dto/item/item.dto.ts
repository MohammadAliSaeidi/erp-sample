import { Item } from "@/domain/item/item.entity";
import { ItemSpecificationAssignmentDTO } from "./item-specification-assignment.dto";

export type ItemDTO = Omit<
  Item,
  "id" | "categoryId" | "specificationAssignments"
> & {
  id: string;
  categoryId?: string;
  specificationAssignments: ItemSpecificationAssignmentDTO[];
};
