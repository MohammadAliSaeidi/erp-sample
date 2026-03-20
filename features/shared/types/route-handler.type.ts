import { NextRequest, NextResponse } from "next/server";

export type RouteHandler<TContext = unknown> = (
	request: NextRequest,
	context: TContext,
) => Promise<Response | NextResponse> | Response | NextResponse;