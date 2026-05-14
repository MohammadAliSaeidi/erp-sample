import { z, ZodType } from "zod";
import {
  AuthenticatedUsecaseDefinition,
  authenticatedUsecaseFactory,
} from "@/features/shared/application/use-case";
import { LockServicePort } from "@/application/shared/lock-service/lock-service.port";
import { LockKey } from "@/application/shared/lock-service/lock-service.types";

export type ReleaseLockDeps<TSchema extends ZodType, TResult> = {
  lockService: LockServicePort;
  buildLockKey: (storeId: string, entityId: string) => LockKey;
} & Pick<
  AuthenticatedUsecaseDefinition<TSchema, TResult>,
  "key" | "requiredPermissions"
>;

const inputSchema = z.object({
  entityId: z.string().min(1),
  token: z.string().brand("Token"),
});

export const buildReleaseLockUsecase = <TSchema extends ZodType, TResult>(
  deps: ReleaseLockDeps<TSchema, TResult>,
) =>
  authenticatedUsecaseFactory({
    key: deps.key,
    auth: "required",
    requiredPermissions: deps.requiredPermissions,
    inputSchema,
    execute: async ({ input, authContext }) => {
      const { storeId } = authContext;
      const key = deps.buildLockKey(storeId, input.entityId);

      const ok = await deps.lockService.release(key, input.token);
      return { ok };
    },
  });
