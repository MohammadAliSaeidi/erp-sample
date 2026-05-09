import { Prisma } from "@/app/generated/prisma/client";
import { z } from "zod";

import { defineQueryFromFields } from "@/application/shared/query/factories/query-definition.factory";
import { paginationSchema } from "@/application/shared/query/schema/pagination.schema";

export const categoryListQuery = defineQueryFromFields<Prisma.ItemWhereInput>()(
  {
    price: {
      type: "number",
      dbField: "price",
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
);

export const categoryListQueryInputSchema = z.object({
  filter: categoryListQuery.filterSchema.optional(),
  pagination: paginationSchema.optional(),
});

export type CategoryListQueryInput =
  z.output<typeof categoryListQueryInputSchema>;