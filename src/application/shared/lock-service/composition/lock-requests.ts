import { buildRunWithInputRequest } from "@/src/application/core/usecase/factories";
import { createRequirePermissionsPolicy } from "@/src/application/core/usecase/policies/common-policies";
import { createRequireStoreAuthPolicy } from "@/src/application/core/usecase/policies/common-policies";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";
import {
  validateAcquireLockInput,
  validateRefreshLockInput,
  validateReleaseLockInput,
} from "@/src/application/shared/lock-service/policy/lock.policies";
import {
  acquireLockUsecase,
  type AcquireLockUsecaseDeps,
} from "@/src/application/shared/lock-service/usecase/acquire-lock.usecase";
import {
  refreshLockUsecase,
  type RefreshLockUsecaseDeps,
} from "@/src/application/shared/lock-service/usecase/refresh-lock.usecase";
import {
  releaseLockUsecase,
  type ReleaseLockUsecaseDeps,
} from "@/src/application/shared/lock-service/usecase/release-lock.usecase";

const requireStoreAuth = createRequireStoreAuthPolicy();

export function buildAcquireLockRequest(
  input: unknown,
  context: BaseContext,
  deps: AcquireLockUsecaseDeps,
  permissions: readonly string[],
) {
  return buildRunWithInputRequest({
    usecase: acquireLockUsecase,
    input,
    context,
    deps,
    beforePolicies: [
      validateAcquireLockInput,
      requireStoreAuth,
      createRequirePermissionsPolicy(permissions),
    ] as const,
  });
}

export function buildRefreshLockRequest(
  input: unknown,
  context: BaseContext,
  deps: RefreshLockUsecaseDeps,
  permissions: readonly string[],
) {
  return buildRunWithInputRequest({
    usecase: refreshLockUsecase,
    input,
    context,
    deps,
    beforePolicies: [
      validateRefreshLockInput,
      requireStoreAuth,
      createRequirePermissionsPolicy(permissions),
    ] as const,
  });
}

export function buildReleaseLockRequest(
  input: unknown,
  context: BaseContext,
  deps: ReleaseLockUsecaseDeps,
  permissions: readonly string[],
) {
  return buildRunWithInputRequest({
    usecase: releaseLockUsecase,
    input,
    context,
    deps,
    beforePolicies: [
      validateReleaseLockInput,
      requireStoreAuth,
      createRequirePermissionsPolicy(permissions),
    ] as const,
  });
}
