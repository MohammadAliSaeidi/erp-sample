import { PrismaClient } from "@/app/generated/prisma/client";
import { CategoryNotFoundForStoreError } from "@/domain/category/errors/category-not-found-for-store.error";
import { ICategoryRepositoryPort } from "@/domain/category/category-repository.port";
import { Category } from "@/domain/category/category.entity";
import { mapToDomainCategory } from "./mappers/map-to-domain-category";
import prisma from "@/lib/prisma";

export interface ICategoryRepositoryAdapterBuilder {
  (prismaDB: PrismaClient): ICategoryRepositoryPort;
}

export const buildCategoryRepositoryAdapter: ICategoryRepositoryAdapterBuilder =
  (prismaDB: PrismaClient) => {
    return {
      getById: async (
        itemId: string,
        storeId: string,
      ): Promise<Category | null> => {
        const category = await prismaDB.category.findFirst({
          where: {
            id: itemId,
            storeId: storeId,
          },
        });

        if (!category) return null;

        return mapToDomainCategory(category);
      },

      getList: async (storeId: string): Promise<Category[]> => {
        const categories = await prismaDB.category.findMany({
          where: { storeId },
          orderBy: { name: "asc" },
        });

        return categories.map((category) => mapToDomainCategory(category));
      },

      create: async (
        category: Category,
        storeId: string,
      ): Promise<Category> => {
        const createdCategory = await prismaDB.category.create({
          data: {
            name: category.name,
            description: category.description,
            storeId,
          },
        });

        return mapToDomainCategory(createdCategory);
      },

      update: async (
        category: Category,
        storeId: string,
      ): Promise<Category> => {
        const existingCategory = await prismaDB.category.findFirst({
          where: {
            id: category.id,
            storeId: storeId,
          },
        });

        if (!existingCategory)
          throw new CategoryNotFoundForStoreError(category.id);
        const updatedCategory = await prismaDB.category.update({
          data: {
            name: category.name,
            description: category.description,
          },
          where: {
            id: category.id,
          },
        });

        return mapToDomainCategory(updatedCategory);
      },
    };
  };

export const categoryRepositoryAdapter = buildCategoryRepositoryAdapter(prisma);
