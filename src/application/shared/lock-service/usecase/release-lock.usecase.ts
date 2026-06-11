import { brand } from "@/lib/brand";
import { defineUsecase } from "@/src/application/core/usecase/factories";
import type { StoreAuthContext } from "@/src/application/core/usecase/types/context.types";
import { LockServicePort } from "@/src/application/shared/lock-service/lock-service.port";
import {
  LockKey,
  LockToken,
  UnlockResult,
} from "@/src/application/shared/lock-service/lock-service.types";
import type { ReleaseLockInput } from "@/src/application/shared/lock-service/schema/release-lock.schema";
import { IEventPublisherPort } from "@/src/application/shared/ports/event-publisher.port";
import {
  DomainEvent,
  EventType,
} from "@/src/domain/shared/events/events.types";
import { StoreId } from "@/src/domain/store/store-id";

export type ReleaseLockEventFactory<
  TReleasedEvent extends EventType,
  TDeniedEvent extends EventType,
> = {
  released: (
    context: StoreAuthContext,
    input: ReleaseLockInput,
    result: { ok: true },
  ) => DomainEvent<TReleasedEvent>;

  denied: (
    context: StoreAuthContext,
    input: ReleaseLockInput,
    result: { ok: false },
  ) => DomainEvent<TDeniedEvent>;
};

export type ReleaseLockUsecaseDeps<
  TReleasedEvent extends EventType = EventType,
  TDeniedEvent extends EventType = EventType,
> = {
  lockService: LockServicePort;
  buildLockKey: (storeId: StoreId, entityId: string) => LockKey;
  eventPublisher?: IEventPublisherPort;
  emitEvents?: boolean;
  eventFactory?: ReleaseLockEventFactory<TReleasedEvent, TDeniedEvent>;
};

export const releaseLockUsecase = defineUsecase<
  ReleaseLockInput,
  UnlockResult,
  StoreAuthContext,
  ReleaseLockUsecaseDeps
>(async (input, context, deps) => {
  const key = deps.buildLockKey(
    brand<string, StoreId>(context.storeId) as StoreId,
    input.entityId,
  );

  const result = await deps.lockService.release(
    key,
    brand<string, LockToken>(input.lockToken) as LockToken,
  );

  const shouldEmit = deps.emitEvents ?? true;

  if (shouldEmit && deps.eventPublisher && deps.eventFactory) {
    if (result.ok) {
      await deps.eventPublisher.publish(
        deps.eventFactory.released(context, input, { ok: true }),
      );
    } else {
      await deps.eventPublisher.publish(
        deps.eventFactory.denied(context, input, { ok: false }),
      );
    }
  }

  return result;
});
