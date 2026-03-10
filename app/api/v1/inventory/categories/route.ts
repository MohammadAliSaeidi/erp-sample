import { withValidatedBody } from "@/app/api/_middlewares/validate-body";
import prisma from "@/lib/prisma";
import { createCategorySchema } from "@/lib/schema/category";

export const POST = withValidatedBody(
	createCategorySchema,
	async (req, _, body) => {
		prisma.$transaction(async (tx) => {
			tx.category.create({
				data: {
					name: body.name,
                         storeId
				},
			});
		});
	},
);
