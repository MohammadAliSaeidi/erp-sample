import { PrismaClient } from "@/app/generated/prisma/client";
import { SpecificationValueCreateManyInput } from "@/app/generated/prisma/models";
import { ISpecificationRepositoryPort } from "@/features/specifications/domain/specification/specification-repository.port";
import {
  createSpecification,
  Specification,
} from "@/features/specifications/domain/specification/specification.aggregate";
import { mapToDomainType, mapToPrismaType } from "./specification.mapper";
import prisma from "@/lib/prisma";

export interface ISpecificationRepositoryAdapterBuilder {
  (prisma: PrismaClient): ISpecificationRepositoryPort;
}

export const buildSpecificationRepositoryAdapter: ISpecificationRepositoryAdapterBuilder =
  (prisma: PrismaClient): ISpecificationRepositoryPort => ({
    create: async (input: Specification, storeId: string) => {
      const createdSpecification = await prisma.specification.create({
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
        select: {
          categoryId: true,
          id: true,
          storeId: true,
          isActive: true,
          isPrimary: true,
          specificationValues: {
            select: {
              id: true,
              value: true,
            },
          },
          name: true,
          type: true,
          isRequired: true,
        },
      });

      return createSpecification({
        categoryId: createdSpecification.categoryId,
        id: createdSpecification.id,
        isActive: createdSpecification.isActive,
        isPrimary: createdSpecification.isPrimary,
        isRequired: createdSpecification.isRequired,
        name: createdSpecification.name,
        specificationValues: createdSpecification.specificationValues,
        type: mapToDomainType(createdSpecification.type),
        storeId: createdSpecification.storeId,
      });
    },
  });

export const specificationRepositoryAdapter =
  buildSpecificationRepositoryAdapter(prisma);
