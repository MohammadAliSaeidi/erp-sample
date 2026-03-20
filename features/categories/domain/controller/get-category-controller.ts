import { WithAuthContext } from "@/features/shared/types/next-request-with-auth-context.type";
import { NextRequest, NextResponse } from "next/server";
import { buildCategoryRepository } from "../repositories/categories.repository";
import prisma from "@/features/shared/lib/prisma";

export async function getCategoriesController(request: NextRequest) {
	const { authContext } = request as WithAuthContext;
	const categoryRepository = buildCategoryRepository(prisma);
	const categories = categoryRepository.getList(authContext.storeId);
	return NextResponse.json(categories);
}
