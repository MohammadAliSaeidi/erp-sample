import { ForbiddenError } from "@/features/auth/domain/errors/forbidden.error";
import { UnauthenticatedError } from "@/features/auth/domain/errors/unauthenticated.error";
import { UnauthorizedError } from "@/features/auth/domain/errors/unauthorized.error";
import { JSONBodyValidationError } from "@/features/shared/errors/json-body-validation.error";
import { NextResponse } from "next/server";
import z from "zod";
import {
	UseCaseBadRequestError,
	UseCaseConflictError,
	UseCaseForbiddenError,
	UseCaseNotFoundError,
	UseCaseUnauthorizedError,
	UseCaseValidationError,
} from "@/application/errors/use-case-errors";

export function mapUsecaseErrorToResponse(error: unknown): NextResponse {
	if (error instanceof UseCaseValidationError) {
		return NextResponse.json(
			{
				error: error.message,
				fields: z.treeifyError(error.zodError),
			},
			{ status: 400 },
		);
	}

	if (error instanceof UseCaseBadRequestError) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}

	if (error instanceof UseCaseUnauthorizedError) {
		return NextResponse.json({ error: error.message }, { status: 401 });
	}

	if (error instanceof UseCaseForbiddenError) {
		return NextResponse.json({ error: error.message }, { status: 403 });
	}

	if (error instanceof UseCaseNotFoundError) {
		return NextResponse.json({ error: error.message }, { status: 404 });
	}

	if (error instanceof UseCaseConflictError) {
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
