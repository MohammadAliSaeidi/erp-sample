import { Prisma } from "@/app/generated/prisma/client";
import { z } from "zod";

import { defineQueryFromFields } from "@/src/application/shared/query/factories/query-definition.factory";
import { paginationSchema } from "@/src/application/shared/query/schema/pagination.schema";

export const itemListQuery = defineQueryFromFields<Prisma.ItemWhereInput>()({
  price: {
    type: "number",
    dbField: "price",
  },
  categoryId: {
    type: "string",
    // one another problem is that here when I start type dbField: "categ", the typescript compiler won't show me the categoryId in the auto complete behavior when I click on crtl+space
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
});

export const itemListQueryInputSchema = z.object({
  filter: itemListQuery.filterSchema.optional(),
  pagination: paginationSchema.optional(),
});

export type ItemListQueryInput = z.output<typeof itemListQueryInputSchema>;
