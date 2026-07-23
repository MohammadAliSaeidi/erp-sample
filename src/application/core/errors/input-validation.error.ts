import z, { type ZodError } from "zod";
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
    const { fieldErrors } = z.flattenError(error);
    return new InputValidationError(fieldErrors);
  }
}
