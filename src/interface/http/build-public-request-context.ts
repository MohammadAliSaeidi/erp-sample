import type { BaseContext } from "@/src/application/core/usecase/types/context.types";

export function buildPublicRequestContext(
  overrides: Partial<BaseContext> = {},
): BaseContext {
  return {
    requestId: overrides.requestId ?? crypto.randomUUID(),
    timestamp: overrides.timestamp ?? new Date(),
    metadata: overrides.metadata,
    ...overrides,
  };
}
