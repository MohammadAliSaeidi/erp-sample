import { ZodError } from "zod";

export type OperationErrorCode =
	| "validation"
	| "unauthorized"
	| "forbidden"
	| "not_found"
	| "conflict"
	| "bad_request";

export class OperationError extends Error {
	constructor(
		public readonly code: OperationErrorCode,
		message: string,
	) {
		super(message);
	}
}

export class OperationValidationError extends OperationError {
	constructor(
		public readonly zodError: ZodError,
		message: string = "Validation failed",
	) {
		super("validation", message);
	}
}

export class OperationUnauthorizedError extends OperationError {
	constructor(message: string = "Unauthorized") {
		super("unauthorized", message);
	}
}

export class OperationForbiddenError extends OperationError {
	constructor(message: string = "Forbidden") {
		super("forbidden", message);
	}
}

export class OperationNotFoundError extends OperationError {
	constructor(message: string = "Not found") {
		super("not_found", message);
	}
}

export class OperationConflictError extends OperationError {
	constructor(message: string = "Conflict") {
		super("conflict", message);
	}
}

export class OperationBadRequestError extends OperationError {
	constructor(message: string = "Bad request") {
		super("bad_request", message);
	}
}
