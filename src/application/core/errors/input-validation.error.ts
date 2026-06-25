import type { ZodError } from "zod";
import { ApplicationError } from "./application.error";

export type InputFieldErrors = Readonly<Record<string, readonly string[]>>;

export class InputValidationError extends ApplicationError {
  readonly code = "input_validation_error";

  constructor(
    public readonly fieldErrors: InputFieldErrors,
    message = "Input validation failed",
  ) {
    super(message);
  }

  static fromZod(error: ZodError): InputValidationError {
    const flattened = error.flatten().fieldErrors;
    const fieldErrors: Record<string, readonly string[]> = {};

    for (const [field, messages] of Object.entries(flattened)) {
      if (messages?.length) {
        fieldErrors[field] = messages;
      }
    }

    return new InputValidationError(fieldErrors);
  }
}
