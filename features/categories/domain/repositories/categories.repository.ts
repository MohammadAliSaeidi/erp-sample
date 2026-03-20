import { Category, PrismaClient } from "@/app/generated/prisma/client";
import z from "zod";
import { CategoryNotFoundForStoreError } from "../errors/category-not-found-for-store.error";
import { createCategoryBody } from "../schemas/create-category-body.schema";
import { editCategoryBody } from "../schemas/edit-category-body.schema";

export interface ICategoryRepository {
	getList: (storeId: string) => Promise<Category[]>;
	getById: (categoryId: string, storeId: string) => Promise<Category | null>;
	create: (
		category: z.infer<typeof createCategoryBody>,
		storeId: string,
	) => Promise<Category>;
	update: (
		category: z.infer<typeof editCategoryBody>,
		storeId: string,
	) => Promise<Category>;
}

export interface ICategoryRepositoryBuilder {
	(prismaDB: PrismaClient): ICategoryRepository;
}

export const buildCategoryRepository: ICategoryRepositoryBuilder = (
	prismaDB: PrismaClient,
) => {
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

			return category;
		},

		getList: async (storeId: string): Promise<Category[]> => {
			return await prismaDB.category.findMany({
				where: { storeId },
				orderBy: { name: "asc" },
			});
		},

		create: async (
			category: z.infer<typeof createCategoryBody>,
			storeId: string,
		): Promise<Category> => {
			return await prismaDB.category.create({
				data: { name: category.name, storeId },
			});
		},

		update: async (
			category: z.infer<typeof editCategoryBody>,
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

			return prismaDB.category.update({
				data: {
					name: category.name,
				},
				where: {
					id: category.id,
				},
			});
		},
	};
};
