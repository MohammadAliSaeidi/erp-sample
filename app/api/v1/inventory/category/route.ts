import { withAuthorization } from "@/features/auth/auth";
import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { buildCategoryRepository } from "@/features/categories/domain/repositories/categories.repository";
import { createCategoryBody } from "@/features/categories/domain/schemas/create-category-body.schema";
import { CreateCategoryBody } from "@/features/categories/domain/types/create-category-body.type";
import prisma from "@/features/shared/lib/prisma";
import { compose } from "@/features/shared/middlewares/compose";
import { bodyValidator } from "@/features/shared/middlewares/validate-body";
import { WithAuthContext } from "@/features/shared/types/next-request-with-auth-context.type";
import { WithValidatedBody } from "@/features/shared/types/next-request-with-validated-body";
import { RouteHandler } from "@/features/shared/types/route-handler.type";
import { NextRequest, NextResponse } from "next/server";

async function getCategoriesHandler(request: NextRequest) {
	const { authContext } = request as WithAuthContext;
	const categoryRepository = buildCategoryRepository(prisma);
	const categories = categoryRepository.getList(authContext.storeId);
	return NextResponse.json(categories);
}

export const GET: RouteHandler = withAuthorization([
	PERMISSIONS.CATEGORIES.READ,
])(getCategoriesHandler);

async function createCategoryHandler(request: NextRequest) {
	const { validatedBody: body, authContext } = request as WithAuthContext<
		WithValidatedBody<CreateCategoryBody>
	>;

	try {
		const category = await prisma.category.create({
			data: { name: body.name, storeId: authContext.storeId },
		});

		return NextResponse.json({ category }, { status: 201 });
	} catch {
		return NextResponse.json(
			{ error: "Could not create category" },
			{ status: 400 },
		);
	}
}

const createCategoryMiddlewares = compose(
	withAuthorization([PERMISSIONS.CATEGORIES.CREATE]),
	bodyValidator(createCategoryBody),
);

export const POST = createCategoryMiddlewares(createCategoryHandler);
