import { DomainError } from "./domain.error";

export type ValidationPath = readonly string[];

export type ValidationCauseInput = {
	readonly code: string;
	readonly field?: string;
	readonly path?: ValidationPath;
	readonly message: string;
	readonly meta?: Readonly<Record<string, unknown>>;
};

export class DomainValidationCause extends DomainError {
	readonly code: string;
	readonly field?: string;
	readonly path?: ValidationPath;
	readonly meta?: Readonly<Record<string, unknown>>;

	constructor(input: ValidationCauseInput) {
		super(input.message);

		this.code = input.code;
		this.field = input.field;
		this.path = input.path;
		this.meta = input.meta;
	}
}

export class DomainValidationError extends DomainError {
	readonly code = "validation_error";

	constructor(
		public readonly errors: readonly DomainValidationCause[],
		message = "Validation failed",
	) {
		super(message);
	}
}

export class DomainRequiredFieldError extends DomainValidationCause {
	constructor(field: string) {
		super({
			code: "required_field",
			field,
			path: [field],
			message: `${field} is required`,
		});
	}
}

export class DomainInvalidAmountError extends DomainValidationCause {
	constructor(field: string, message: string) {
		super({
			code: "invalid_amount",
			field,
			path: [field],
			message,
		});
	}
}
