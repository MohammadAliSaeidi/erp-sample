import { ForbiddenError } from "@/features/auth/domain/errors/forbidden.error";
import { UnauthenticatedError } from "@/features/auth/domain/errors/unauthenticated.error";
import { UnauthorizedError } from "@/features/auth/domain/errors/unauthorized.error";
import { JSONBodyValidationError } from "@/features/shared/errors/json-body-validation.error";
import { NextResponse } from "next/server";
import z from "zod";
import {
	OperationBadRequestError,
	OperationConflictError,
	OperationForbiddenError,
	OperationNotFoundError,
	OperationUnauthorizedError,
	OperationValidationError,
} from "@/features/shared/application/errors/operation-errors";

export function mapOperationErrorToResponse(error: unknown): NextResponse {
	if (error instanceof OperationValidationError) {
		return NextResponse.json(
			{
				error: error.message,
				fields: z.treeifyError(error.zodError),
			},
			{ status: 400 },
		);
	}

	if (error instanceof OperationBadRequestError) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}

	if (error instanceof OperationUnauthorizedError) {
		return NextResponse.json({ error: error.message }, { status: 401 });
	}

	if (error instanceof OperationForbiddenError) {
		return NextResponse.json({ error: error.message }, { status: 403 });
	}

	if (error instanceof OperationNotFoundError) {
		return NextResponse.json({ error: error.message }, { status: 404 });
	}

	if (error instanceof OperationConflictError) {
		return NextResponse.json({ error: error.message }, { status: 409 });
	}

	if (
		error instanceof UnauthorizedError ||
		error instanceof UnauthenticatedError
	) {
		return NextResponse.json(
			{ error: "Unauthorized", message: error.message },
			{ status: 401 },
		);
	}

	if (error instanceof ForbiddenError) {
		return NextResponse.json(
			{ error: "Forbidden", message: error.message },
			{ status: 403 },
		);
	}

	if (error instanceof JSONBodyValidationError) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}

	if (error instanceof z.ZodError) {
		return NextResponse.json(
			{
				error: "Validation failed",
				fields: z.treeifyError(error),
			},
			{ status: 400 },
		);
	}

	return NextResponse.json(
		{ error: "Internal Server Error" },
		{ status: 500 },
	);
}
