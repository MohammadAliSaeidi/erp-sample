import { z, ZodType } from "zod";
import {
  AuthenticatedUsecaseDefinition,
  authenticatedUsecaseFactory,
} from "@/features/shared/application/use-case";
import {
  LockResult,
  LockResultFailure,
  LockResultOk,
  LockServicePort,
} from "@/application/shared/lock-service/lock-service.port";
import { LockKey } from "@/application/shared/lock-service/lock-service.types";
import { IEventPublisherPort } from "@/application/shared/ports/event-publisher.port";
import { DomainEvent, EventType } from "@/domain/shared/events/events.types";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";

export type AcquireLockDeps<
  TSchema extends ZodType,
  TResult,
  TInput extends { entityId: string; ttlMs: number },
  TLockedEvent extends EventType,
  TDeniedEvent extends EventType,
  TAuth = AuthContext,
> = {
  lockService: LockServicePort;
  buildLockKey: (storeId: string, entityId: string) => LockKey;
  eventPublisher?: IEventPublisherPort;
  emitEvents?: boolean;
  eventFactory?: {
    locked: (
      ctx: TAuth,
      input: TInput,
      result: LockResultOk,
    ) => DomainEvent<TLockedEvent>;

    denied: (
      ctx: TAuth,
      input: TInput,
      result: LockResultFailure,
    ) => DomainEvent<TDeniedEvent>;
  };
} & Pick<
  AuthenticatedUsecaseDefinition<TSchema, TResult>,
  "key" | "requiredPermissions"
>;

const inputSchema = z.object({
  entityId: z.string().min(1),
  ttlMs: z
    .number()
    .min(1000)
    .max(10 * 60 * 1000),
});

export const buildAcquireLockUsecase = <
  TSchema extends ZodType,
  TResult extends { ok: false; lockedBy: string; expiresAt: number },
  TInput extends z.infer<typeof inputSchema>,
  TLockedEvent extends EventType,
  TDeniedEvent extends EventType,
  TAuth = AuthContext,
>(
  deps: AcquireLockDeps<
    TSchema,
    TResult,
    TInput,
    TLockedEvent,
    TDeniedEvent,
    TAuth
  >,
) =>
  authenticatedUsecaseFactory({
    key: deps.key,
    auth: "required",
    requiredPermissions: deps.requiredPermissions,
    inputSchema,
    execute: async ({ input, authContext }): Promise<LockResult> => {
      const key: LockKey = deps.buildLockKey(
        authContext.storeId,
        input.entityId,
      );
      const result: LockResult = await deps.lockService.acquire(
        key,
        authContext.adminId,
        input.ttlMs,
      );

      const shouldEmit = deps.emitEvents ?? true;
      if (shouldEmit && deps.eventPublisher && deps.eventFactory) {
        if (result.ok) {
          const event: DomainEvent<EventType> = deps.eventFactory.locked(
            authContext as TAuth,
            input as TInput,
            result as LockResultOk,
          );

          await deps.eventPublisher.publish<EventType>(event);
        } else {
          const event: DomainEvent<EventType> = deps.eventFactory.denied(
            authContext as TAuth,
            input as TInput,
            result as LockResultFailure,
          );

          await deps.eventPublisher.publish<EventType>(event);
        }
      }

      return result;
    },
  });
