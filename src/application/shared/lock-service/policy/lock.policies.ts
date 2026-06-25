import { createValidateInputPolicy } from "@/src/application/core/usecase/policies/common-policies";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";
import { acquireLockInputSchema } from "../schema/acquire-lock.schema";
import { refreshLockInputSchema } from "../schema/refresh-lock.schema";
import { releaseLockInputSchema } from "../schema/release-lock.schema";

export const validateAcquireLockInput = createValidateInputPolicy<
  BaseContext,
  typeof acquireLockInputSchema
>("ValidateAcquireLockInput", acquireLockInputSchema);

export const validateRefreshLockInput = createValidateInputPolicy<
  BaseContext,
  typeof refreshLockInputSchema
>("ValidateRefreshLockInput", refreshLockInputSchema);

export const validateReleaseLockInput = createValidateInputPolicy<
  BaseContext,
  typeof releaseLockInputSchema
>("ValidateReleaseLockInput", releaseLockInputSchema);
