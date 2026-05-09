import { Prisma } from "@/app/generated/prisma/client";

/**
 * Centralizes relation includes so the mapper type and query stay in sync:
 *
 * The mapper accepts `ItemWithRelations` -- if you add a relation to the include, TypeScript will enforce that the mapper handles it.
 */
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
