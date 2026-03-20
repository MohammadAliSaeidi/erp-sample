import prisma from "@/features/shared/lib/prisma";
import { WithAuthContext } from "@/features/shared/types/next-request-with-auth-context.type";
import { WithValidatedBody } from "@/features/shared/types/next-request-with-validated-body";
import { NextRequest, NextResponse } from "next/server";
import { CreateCategoryBody } from "../types/create-category-body.type";

export async function createCategoryController(request: NextRequest) {
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
