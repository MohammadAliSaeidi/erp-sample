import { z } from "zod";
import {
  ForbiddenError,
  UnauthorizedError,
} from "@/src/application/core/errors/application.error";
import { InputValidationError } from "@/src/application/core/errors/input-validation.error";
import type { BaseContext } from "../types/context.types";
import type { StoreAuthContext } from "../types/context.types";
import {
  defineBeforePolicy,
  defineBeforePolicyWithoutInput,
} from "../factories";

export function createValidateInputPolicy<
  TInContext extends BaseContext,
  TSchema extends z.ZodType,
>(name: string, schema: TSchema) {
  type RawInput = z.input<TSchema>;
  type ValidInput = z.output<TSchema>;

  return defineBeforePolicy<TInContext, TInContext, RawInput, ValidInput>(
    name,
    async (input, context) => {
      const parsed = schema.safeParse(input);
      if (!parsed.success) {
        throw InputValidationError.fromZod(parsed.error);
      }

      return { context, input: parsed.data };
    },
  );
}

function resolveStoreAuthContext(context: BaseContext): StoreAuthContext {
  const storeId = context.metadata?.storeId;
  const adminId = context.metadata?.adminId;

  if (typeof storeId !== "string" || typeof adminId !== "string") {
    throw new UnauthorizedError("Authentication required");
  }

  const permissions = Array.isArray(context.metadata?.permissions)
    ? (context.metadata.permissions as string[])
    : [];
  const grantsAll = context.metadata?.grantsAll === true;

  return {
    ...context,
    storeId,
    adminId,
    permissions,
    grantsAll,
  };
}

export function createRequireStoreAuthPolicy<TInContext extends BaseContext>() {
  return defineBeforePolicy<TInContext, StoreAuthContext, unknown, unknown>(
    "RequireStoreAuth",
    async (input, context) => ({
      context: resolveStoreAuthContext(context),
      input,
    }),
  );
}

export function createRequireStoreAuthPolicyWithoutInput<
  TInContext extends BaseContext,
>() {
  return defineBeforePolicyWithoutInput<TInContext, StoreAuthContext>(
    "RequireStoreAuth",
    async (context) => ({
      context: resolveStoreAuthContext(context),
    }),
  );
}

function assertPermissions(
  context: StoreAuthContext,
  required: readonly string[],
): void {
  const hasRequired =
    context.grantsAll ||
    required.every((permission) => context.permissions.includes(permission));

  if (!hasRequired) {
    throw new ForbiddenError("Missing required permissions");
  }
}

export function createRequirePermissionsPolicy(required: readonly string[]) {
  return defineBeforePolicy<StoreAuthContext, StoreAuthContext, unknown, unknown>(
    "RequirePermissions",
    async (input, context) => {
      assertPermissions(context, required);

      return { context, input };
    },
  );
}

export function createRequirePermissionsPolicyWithoutInput(
  required: readonly string[],
) {
  return defineBeforePolicyWithoutInput<StoreAuthContext, StoreAuthContext>(
    "RequirePermissions",
    async (context) => {
      assertPermissions(context, required);

      return { context };
    },
  );
}
