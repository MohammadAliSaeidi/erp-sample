import { Prisma } from "@/app/generated/prisma/client";
import { z } from "zod";

import { defineQuery } from "@/application/shared/query/factories/query-definition.factory";
import {
  booleanFilterSchema,
  numberFilterSchema,
  stringFilterSchema,
} from "@/application/shared/query/schema/filter.schemas";
import { paginationSchema } from "@/application/shared/query/schema/pagination.schema";

const filterSchema = z.object({
  price: numberFilterSchema.optional(),
  categoryId: stringFilterSchema.optional(),
  isDeleted: booleanFilterSchema.optional(),
});

type ItemFilterShape = z.infer<typeof filterSchema>;
type ItemFilterSpecShape = {
  [K in keyof ItemFilterShape]-?: Exclude<ItemFilterShape[K], undefined>;
};

export const itemListQuery = defineQuery<
  ItemFilterSpecShape,
  Prisma.ItemWhereInput
>()({
  filterSchema,
  filterSpec: {
    price: {
      type: "number",
      dbField: 'price'
    },

    categoryId: {
      type: "string",
      dbField: "categoryId",
    },

    isDeleted: {
      type: "boolean",

      toWhere: (input) => {
        if (input.eq === true) {
          return {
            deletedAt: {
              not: null,
            },
          };
        }

        return {
          deletedAt: null,
        };
      },
    },
  },
});

export const itemListQueryInputSchema = z.object({
  filter: itemListQuery.filterSchema.optional(),
  pagination: paginationSchema.optional(),
});

export type ItemListQueryInput = z.output<typeof itemListQueryInputSchema>;
