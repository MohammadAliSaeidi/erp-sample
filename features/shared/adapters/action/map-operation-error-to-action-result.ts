import { ForbiddenError } from "@/features/auth/domain/errors/forbidden.error";
import { UnauthenticatedError } from "@/features/auth/domain/errors/unauthenticated.error";
import { UnauthorizedError } from "@/features/auth/domain/errors/unauthorized.error";
import z from "zod";
import {
	OperationBadRequestError,
	OperationConflictError,
	OperationForbiddenError,
	OperationNotFoundError,
	OperationUnauthorizedError,
	OperationValidationError,
} from "@/features/shared/application/errors/operation-errors";

export type ActionErrorCode =
	| "validation"
	| "bad_request"
	| "unauthorized"
	| "forbidden"
	| "not_found"
	| "conflict"
	| "internal";

export interface ActionFailureResult {
	ok: false;
	error: {
		code: ActionErrorCode;
		message: string;
		fields?: unknown;
	};
}

export interface ActionSuccessResult<TData> {
	ok: true;
	data: TData;
}

export type ActionResult<TData> =
	| ActionSuccessResult<TData>
	| ActionFailureResult;

export const actionSuccess = <TData>(data: TData): ActionSuccessResult<TData> => ({
	ok: true,
	data,
});

export function mapOperationErrorToActionResult(
	error: unknown,
): ActionFailureResult {
	if (error instanceof OperationValidationError) {
		return {
			ok: false,
			error: {
				code: "validation",
				message: error.message,
				fields: z.treeifyError(error.zodError),
			},
		};
	}

	if (error instanceof OperationBadRequestError) {
		return {
			ok: false,
			error: { code: "bad_request", message: error.message },
		};
	}

	if (
		error instanceof OperationUnauthorizedError ||
		error instanceof UnauthorizedError ||
		error instanceof UnauthenticatedError
	) {
		return {
			ok: false,
			error: { code: "unauthorized", message: error.message },
		};
	}

	if (error instanceof OperationForbiddenError || error instanceof ForbiddenError) {
		return {
			ok: false,
			error: { code: "forbidden", message: error.message },
		};
	}

	if (error instanceof OperationNotFoundError) {
		return {
			ok: false,
			error: { code: "not_found", message: error.message },
		};
	}

	if (error instanceof OperationConflictError) {
		return {
			ok: false,
			error: { code: "conflict", message: error.message },
		};
	}

	if (error instanceof z.ZodError) {
		return {
			ok: false,
			error: {
				code: "validation",
				message: "Validation failed",
				fields: z.treeifyError(error),
			},
		};
	}

	return {
		ok: false,
		error: { code: "internal", message: "Internal Server Error" },
	};
}
