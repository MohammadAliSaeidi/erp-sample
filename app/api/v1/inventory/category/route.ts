import { withAuthorization } from "@/features/auth/auth";
import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { createCategoryController } from "@/features/categories/domain/controller/create-category-controller";
import { getCategoriesController } from "@/features/categories/domain/controller/get-category-controller";
import { createCategoryBody } from "@/features/categories/domain/schemas/create-category-body.schema";
import { compose } from "@/features/shared/middlewares/compose";
import { bodyValidator } from "@/features/shared/middlewares/validate-body";
import { RouteHandler } from "@/features/shared/types/route-handler.type";

export const GET: RouteHandler = withAuthorization([
	PERMISSIONS.CATEGORIES.READ,
])(getCategoriesController);

const createCategoryMiddlewares = compose(
	withAuthorization([PERMISSIONS.CATEGORIES.CREATE]),
	bodyValidator(createCategoryBody),
);

export const POST = createCategoryMiddlewares(createCategoryController);
