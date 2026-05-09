import { Prisma } from "@/app/generated/prisma/client";
import { ItemListFilterInput } from "@/application/item/schema/item-list-query.schema";
import { defineFilterSpec } from "@/application/shared/query/define-filter-spec";

export const itemFilterSpec =
  defineFilterSpec<ItemListFilterInput, Prisma.ItemWhereInput>()({
    price: { type: "number", dbField: "price" },
    categoryId: { type: "string", dbField: "categoryId" },
    isDeleted: {
      type: "boolean",
      toWhere: (input) => {
        if (input.eq === true) return { deletedAt: { not: null } };
        if (input.eq === false) return { deletedAt: null };
        return {};
      },
    },
  });