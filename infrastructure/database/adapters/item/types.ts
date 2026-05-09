import { Prisma } from "@/app/generated/prisma/client";

export const itemWithRelationsInclude = {
  category: {
    select: {
      id: true,
      name: true,
    },
  },

  itemSpecificationValues: {
    include: {
      specification: {
        select: {
          id: true,
          name: true,
          type: true,
          isPrimary: true,
          isRequired: true,
          isActive: true,
        },
      },

      specificationValue: true,
    },
  },
} satisfies Prisma.ItemInclude;

export type ItemWithRelations = Prisma.ItemGetPayload<{
  include: typeof itemWithRelationsInclude;
}>;
