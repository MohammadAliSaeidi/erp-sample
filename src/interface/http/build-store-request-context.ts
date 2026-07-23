import type { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";

export function buildStoreRequestContext<TContext extends BaseContext>(
  authContext: AuthContext,
  overrides: Partial<TContext> = {},
): BaseContext {
  return {
    requestId: overrides.requestId ?? crypto.randomUUID(),
    timestamp: overrides.timestamp ?? new Date(),
    metadata: {
      storeId: authContext.storeId,
      adminId: authContext.adminId,
      permissions: authContext.permissions ?? [],
      grantsAll: authContext.grantsAll,
      ...overrides.metadata,
    },
    ...overrides,
  };
}
