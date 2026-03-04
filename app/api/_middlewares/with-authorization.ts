import { NextRequest, NextResponse } from "next/server";

type ApiHandler<TContext = unknown> = (
	req: NextRequest,
	ctx: TContext,
	body: unknown,
) => Promise<Response> | Response;

export function withAuthorization<TContext = unknown>(handler: ApiHandler) {
	return async (
		req: NextRequest,
		ctx: TContext,
		body: unknown,
	): Promise<Response> => {
		return handler(req, ctx, body);
	};
}
