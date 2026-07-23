import { PrismaClient } from "@/src/infrastructure/database/orm/prisma/generated/client";
import { CategoryNotFoundForStoreError } from "@/src/domain/category/errors/category-not-found-for-store.error";
import { CategoryRepositoryPort } from "@/src/domain/category/category-repository.port";
import { Category } from "@/src/domain/category/category.entity";
import { mapToDomainCategory } from "./mappers/map-to-domain-category";
import prisma from "@/lib/prisma";
import { CategoryId } from "@/src/domain/category/category-id";
import { StoreId } from "@/src/domain/store/store-id";

export interface ICategoryRepositoryAdapterBuilder {
  (prismaDB: PrismaClient): CategoryRepositoryPort;
}

export const buildCategoryRepositoryAdapter: ICategoryRepositoryAdapterBuilder =
  (prismaDB: PrismaClient) => {
    return {
      getById: async (
        categoryId: CategoryId,
        storeId: StoreId,
      ): Promise<Category | null> => {
        const category = await prismaDB.category.findFirst({
          where: {
            id: String(categoryId),
            storeId: String(storeId),
          },
        });

        if (!category) return null;

        return mapToDomainCategory(category);
      },

      getList: async (storeId: StoreId): Promise<Category[]> => {
        const categories = await prismaDB.category.findMany({
          where: { storeId },
          orderBy: { name: "asc" },
        });

        return categories.map((category) => mapToDomainCategory(category));
      },

      create: async (
        category: Category,
        storeId: StoreId,
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
        storeId: StoreId,
      ): Promise<Category> => {
        const existingCategory = await prismaDB.category.findFirst({
          where: {
            id: category.id,
            storeId: String(storeId),
          },
        });

        if (!existingCategory)
          throw new CategoryNotFoundForStoreError(category.id, storeId);

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
