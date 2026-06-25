import {
  BadRequestError as ApplicationBadRequestError,
  ForbiddenError as ApplicationForbiddenError,
  NotFoundError as ApplicationNotFoundError,
  UnauthorizedError as ApplicationUnauthorizedError,
} from "@/src/application/core/errors/application.error";
import { InputValidationError } from "@/src/application/core/errors/input-validation.error";
import { ForbiddenError } from "@/features/auth/domain/errors/forbidden.error";
import { UnauthenticatedError } from "@/features/auth/domain/errors/unauthenticated.error";
import { UnauthorizedError } from "@/features/auth/domain/errors/unauthorized.error";
import z from "zod";
import {
  UseCaseBadRequestError,
  UseCaseConflictError,
  UseCaseForbiddenError,
  UseCaseNotFoundError,
  UseCaseUnauthorizedError,
  UseCaseValidationError,
} from "@/src/application/shared/errors/use-case-errors";

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

export const actionSuccess = <TData>(
  data: TData,
): ActionSuccessResult<TData> => ({
  ok: true,
  data,
});

export function mapUsecaseErrorToActionResult(
  error: unknown,
): ActionFailureResult {
  if (error instanceof ApplicationBadRequestError) {
    return {
      ok: false,
      error: { code: "bad_request", message: error.message },
    };
  }

  if (error instanceof InputValidationError) {
    return {
      ok: false,
      error: {
        code: "validation",
        message: error.message,
        fields: error.fieldErrors,
      },
    };
  }

  if (error instanceof ApplicationUnauthorizedError) {
    return {
      ok: false,
      error: { code: "unauthorized", message: error.message },
    };
  }

  if (error instanceof ApplicationForbiddenError) {
    return {
      ok: false,
      error: { code: "forbidden", message: error.message },
    };
  }

  if (error instanceof ApplicationNotFoundError) {
    return {
      ok: false,
      error: { code: "not_found", message: error.message },
    };
  }

  if (error instanceof UseCaseValidationError) {
    return {
      ok: false,
      error: {
        code: "validation",
        message: error.message,
        fields: z.treeifyError(error.zodError),
      },
    };
  }

  if (error instanceof UseCaseBadRequestError) {
    return {
      ok: false,
      error: { code: "bad_request", message: error.message },
    };
  }

  if (
    error instanceof UseCaseUnauthorizedError ||
    error instanceof UnauthorizedError ||
    error instanceof UnauthenticatedError
  ) {
    return {
      ok: false,
      error: { code: "unauthorized", message: error.message },
    };
  }

  if (
    error instanceof UseCaseForbiddenError ||
    error instanceof ForbiddenError
  ) {
    return {
      ok: false,
      error: { code: "forbidden", message: error.message },
    };
  }

  if (error instanceof UseCaseNotFoundError) {
    return {
      ok: false,
      error: { code: "not_found", message: error.message },
    };
  }

  if (error instanceof UseCaseConflictError) {
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
