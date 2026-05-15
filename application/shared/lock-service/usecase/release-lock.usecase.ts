import { z, ZodType } from "zod";
import {
  AuthenticatedUsecaseDefinition,
  authenticatedUsecaseFactory,
} from "@/features/shared/application/use-case";
import { LockServicePort } from "@/application/shared/lock-service/lock-service.port";
import { LockKey } from "@/application/shared/lock-service/lock-service.types";
import { IEventPublisherPort } from "@/application/shared/ports/event-publisher.port";
import { DomainEvent, EventType } from "@/domain/shared/events/events.types";
import { AuthContext } from "@/features/auth/domain/types/auth-context.type";
import { brand } from "@/lib/brand";

export type ReleaseLockDeps<
  TSchema extends ZodType,
  TResult,
  TReleasedEvent extends EventType,
  TReleaseDeniedEvent extends EventType,
  TAuth = AuthContext,
> = {
  lockService: LockServicePort;
  buildLockKey: (storeId: string, entityId: string) => LockKey;
  eventPublisher?: IEventPublisherPort;
  emitEvents?: boolean;
  eventFactory?: {
    released: (
      ctx: TAuth,
      input: z.infer<typeof inputSchema>,
      result: { ok: true },
    ) => DomainEvent<TReleasedEvent, undefined>;

    denied: (
      ctx: TAuth,
      input: z.infer<typeof inputSchema>,
      result: { ok: false },
    ) => DomainEvent<TReleaseDeniedEvent, undefined>;
  };
} & Pick<
  AuthenticatedUsecaseDefinition<TSchema, TResult>,
  "key" | "requiredPermissions"
>;

const inputSchema = z.object({
  entityId: z.string().min(1),
  lockToken: z.string(),
});

export const buildReleaseLockUsecase = <
  TSchema extends ZodType,
  TResult extends { ok: boolean },
  TReleasedEvent extends EventType,
  TReleaseDeniedEvent extends EventType,
  TAuth = AuthContext,
>(
  deps: ReleaseLockDeps<
    TSchema,
    TResult,
    TReleasedEvent,
    TReleaseDeniedEvent,
    TAuth
  >,
) =>
  authenticatedUsecaseFactory({
    key: deps.key,
    auth: "required",
    requiredPermissions: deps.requiredPermissions,
    inputSchema,
    execute: async ({ input, authContext }): Promise<{ ok: boolean }> => {
      const key: LockKey = deps.buildLockKey(
        authContext.storeId,
        input.entityId,
      );

      const result = await deps.lockService.release(
        key,
        brand(input.lockToken)
      );

      const shouldEmit = deps.emitEvents ?? true;

      if (shouldEmit && deps.eventPublisher && deps.eventFactory) {
        if (result.ok) {
          const event: DomainEvent<EventType, undefined> =
            deps.eventFactory.released(authContext as TAuth, input, {
              ok: true,
            });
          await deps.eventPublisher.publish<EventType>(event);
        } else {
          const event: DomainEvent<EventType, undefined> =
            deps.eventFactory.denied(authContext as TAuth, input, {
              ok: false,
            });
          await deps.eventPublisher.publish<EventType>(event);
        }
      }

      return result;
    },
  });
