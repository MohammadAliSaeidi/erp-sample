import { withValidatedBody } from "@/app/api/_middlewares/validate-body";
import prisma from "@/lib/prisma";
import { loginBodySchema } from "@/lib/schema/auth";
import { isHashMatch } from "@/lib/utils/hash/hash";
import { NextResponse } from "next/server";

export const POST = withValidatedBody(
	loginBodySchema,
	async (_req, _ctx, body) => {
		const storeUser = await prisma.storeUser.findFirst({
			where: {
				username: body.username,
			},
		});

		if (!storeUser || !isHashMatch(body.password, storeUser.password))
			return NextResponse.json(
				{},
				{
					status: 401,
					statusText: "incorrect Username or Password",
				},
			);

		return NextResponse.json(null, {
			status: 200,
			statusText: "logged in successfully",
		});
	},
);
