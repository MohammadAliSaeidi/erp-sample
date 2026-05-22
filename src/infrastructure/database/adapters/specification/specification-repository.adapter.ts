import { PrismaClient } from "@/src/infrastructure/database/orm/prisma/generated/client";
import { ISpecificationRepositoryPort } from "@/src/domain/specification/specification-repository.port";
import {
  createSpecification,
  Specification,
} from "@/src/domain/specification/specification.aggregate";
import { mapToPrismaType } from "./mappers/specification.mapper";
import prisma from "@/lib/prisma";
import {
  mapToDomainSpecification,
  PrismaSpecificationWithValues,
} from "./mappers/map-to-domain-specification.mapper";
import { CategoryId } from "@/src/domain/category/category-id";

export interface ISpecificationRepositoryAdapterBuilder {
  (prisma: PrismaClient): ISpecificationRepositoryPort;
}

export const buildSpecificationRepositoryAdapter: ISpecificationRepositoryAdapterBuilder =
  (prisma: PrismaClient): ISpecificationRepositoryPort => ({
    create: async (input: Specification) => {
      const createdSpecification: PrismaSpecificationWithValues | null =
        await prisma.$transaction(async (tx) => {
          const spec = await tx.specification.create({
            data: {
              id: input.id,
              storeId: input.storeId,
              isRequired: input.isRequired,
              isActive: input.isActive,
              isPrimary: input.isPrimary,
              name: input.name,
              categoryId: input.categoryId ?? undefined,
              type: mapToPrismaType(input.type),
            },
          });

          await tx.specificationValue.createMany({
            data: input.specificationValues.map((v) => ({
              id: v.id,
              specificationId: spec.id,
              value: String(v.value),
            })),
          });

          return tx.specification.findUnique({
            where: { id: spec.id },
            include: { specificationValues: true },
          });
        });

      if (!createdSpecification) {
        throw new Error("Failed to create specification");
      }

      return createSpecification(
        mapToDomainSpecification(createdSpecification),
      );
    },

    getList: async (categoryId: CategoryId): Promise<Specification[]> => {
      const prismaSpecifications: PrismaSpecificationWithValues[] =
        await prisma.specification.findMany({
          where: {
            categoryId: categoryId,
            isActive: true,
          },
          include: {
            specificationValues: true,
          },
        });

      return prismaSpecifications.map(mapToDomainSpecification);
    },
  });

export const specificationRepositoryAdapter =
  buildSpecificationRepositoryAdapter(prisma);
