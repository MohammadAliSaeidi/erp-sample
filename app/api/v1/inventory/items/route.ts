import { NextResponse } from "next/server";

export const POST = () =>
	NextResponse.json(
		{ error: "Not Implemented" },
		{ status: 501, statusText: "Not Implemented" },
	);
