import { LockServicePort } from "@/src/application/shared/lock-service/lock-service.port";
import {
  LockKey,
  LockResult,
  LockResultFailure,
  LockResultOk,
} from "@/src/application/shared/lock-service/lock-service.types";
import { IEventPublisherPort } from "@/src/application/shared/ports/event-publisher.port";
import {
  DomainEvent,
  EventType,
} from "@/src/domain/shared/events/events.types";
import { StoreId } from "@/src/domain/store/store-id";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import {
  AuthenticatedUsecaseDefinition,
  buildAuthenticatedUsecase,
} from "@/features/shared/application/use-case";
import { brand, Brand } from "@/lib/brand";
import { z, ZodType } from "zod";

export type AcquireLockDeps<
  TSchema extends ZodType,
  TResult,
  TEntityBrand extends string,
  TInput extends { entityId: TEntityBrand; ttlMs: number },
  TLockedEvent extends EventType,
  TDeniedEvent extends EventType,
  TAuth = AuthContext,
> = {
  lockService: LockServicePort;
  buildLockKey: (storeId: StoreId, entityId: TEntityBrand) => LockKey;
  eventPublisher?: IEventPublisherPort;
  /**
   * True by default
   */
  emitEvents?: boolean;
  eventFactory?: {
    buildLockedEvent: (
      ctx: TAuth,
      input: TInput,
      result: LockResultOk,
    ) => DomainEvent<TLockedEvent>;

    buildDeniedEvent: (
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
  TEntityBrand extends string,
  TInput extends { entityId: TEntityBrand; ttlMs: number },
  TLockedEvent extends EventType,
  TDeniedEvent extends EventType,
  TAuth = AuthContext,
>(
  deps: AcquireLockDeps<
    TSchema,
    TResult,
    TEntityBrand,
    TInput,
    TLockedEvent,
    TDeniedEvent,
    TAuth
  >,
) =>
  buildAuthenticatedUsecase({
    key: deps.key,
    auth: "required",
    requiredPermissions: deps.requiredPermissions,
    inputSchema,
    execute: async ({ input, authContext }): Promise<LockResult> => {
      const key: LockKey = deps.buildLockKey(
        authContext.storeId,
        brand<string, TEntityBrand>(input.entityId),
      );

      const result: LockResult = await deps.lockService.acquire(
        key,
        authContext.adminId,
        input.ttlMs,
      );

      const shouldEmit = deps.emitEvents ?? true;

      if (shouldEmit && deps.eventPublisher && deps.eventFactory) {
        if (result.ok) {
          const event: DomainEvent<TLockedEvent> =
            deps.eventFactory.buildLockedEvent(
              authContext as TAuth,
              input as TInput,
              result as LockResultOk,
            );

          await deps.eventPublisher.publish<EventType>(event);
        } else {
          const event: DomainEvent<TDeniedEvent> =
            deps.eventFactory.buildDeniedEvent(
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
