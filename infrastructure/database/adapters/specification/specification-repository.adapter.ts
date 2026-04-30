import { PrismaClient } from "@/app/generated/prisma/client";
import { SpecificationValueCreateManyInput } from "@/app/generated/prisma/models";
import { ISpecificationRepositoryPort } from "@/domain/specification/specification-repository.port";
import {
  createSpecification,
  Specification,
} from "@/domain/specification/specification.aggregate";
import { mapToPrismaType } from "./mappers/specification.mapper";
import prisma from "@/lib/prisma";
import { CategoryId } from "@/features/shared/domain/ids";
import {
  mapToDomainSpecification,
  PrismaSpecificationWithValues,
} from "./mappers/map-to-domain-specification.mapper";
import { mapToDomainType } from "./mappers/map-to-domain-type.mapper";

export interface ISpecificationRepositoryAdapterBuilder {
  (prisma: PrismaClient): ISpecificationRepositoryPort;
}

export const buildSpecificationRepositoryAdapter: ISpecificationRepositoryAdapterBuilder =
  (prisma: PrismaClient): ISpecificationRepositoryPort => ({
    create: async (input: Specification, storeId: string) => {
      const createdSpecification: PrismaSpecificationWithValues =
        await prisma.specification.create({
          data: {
            id: input.id,
            storeId,
            type: mapToPrismaType(input.type),
            categoryId: input.categoryId ?? undefined,
            isRequired: input.isRequired,
            isActive: input.isActive,
            isPrimary: input.isPrimary,
            name: input.name,
            specificationValues: {
              createMany: {
                data: input.specificationValues.map(
                  (specValue): SpecificationValueCreateManyInput => ({
                    id: specValue.id,
                    specificationId: input.id,
                    value: String(specValue.value),
                  }),
                ),
              },
            },
          },
          include: { specificationValues: true },
        });

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
