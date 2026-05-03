import { ZodError } from "zod";

export type UseCaseErrorCode =
	| "validation"
	| "unauthorized"
	| "forbidden"
	| "not_found"
	| "conflict"
	| "bad_request";

export class UseCaseError extends Error {
	constructor(
		public readonly code: UseCaseErrorCode,
		message: string,
	) {
		super(message);
	}
}

export class UseCaseValidationError extends UseCaseError {
	constructor(
		public readonly zodError: ZodError,
		message: string = "Validation failed",
	) {
		super("validation", message);
	}
}

export class UseCaseUnauthorizedError extends UseCaseError {
	constructor(message: string = "Unauthorized") {
		super("unauthorized", message);
	}
}

export class UseCaseForbiddenError extends UseCaseError {
	constructor(message: string = "Forbidden") {
		super("forbidden", message);
	}
}

export class UseCaseNotFoundError extends UseCaseError {
	constructor(message: string = "Not found") {
		super("not_found", message);
	}
}

export class UseCaseConflictError extends UseCaseError {
	constructor(message: string = "Conflict") {
		super("conflict", message);
	}
}

export class UseCaseBadRequestError extends UseCaseError {
	constructor(message: string = "Bad request") {
		super("bad_request", message);
	}
}
