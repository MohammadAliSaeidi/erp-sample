import { brand } from "@/lib/brand";
import { defineUsecase } from "@/src/application/core/usecase/factories";
import type { StoreAuthContext } from "@/src/application/core/usecase/types/context.types";
import { LockServicePort } from "@/src/application/shared/lock-service/lock-service.port";
import {
  LockKey,
  LockResult,
  LockResultFailure,
  LockResultOk,
} from "@/src/application/shared/lock-service/lock-service.types";
import type { AcquireLockInput } from "@/src/application/shared/lock-service/schema/acquire-lock.schema";
import { IEventPublisherPort } from "@/src/application/shared/ports/event-publisher.port";
import {
  DomainEvent,
  EventType,
} from "@/src/domain/shared/events/events.types";
import { StoreAdminId } from "@/src/domain/store-admin/store-admin-id";
import { StoreId } from "@/src/domain/store/store-id";

export type AcquireLockEventFactory<
  TLockedEvent extends EventType,
  TDeniedEvent extends EventType,
> = {
  buildLockedEvent: (
    context: StoreAuthContext,
    input: AcquireLockInput,
    result: LockResultOk,
  ) => DomainEvent<TLockedEvent>;

  buildDeniedEvent: (
    context: StoreAuthContext,
    input: AcquireLockInput,
    result: LockResultFailure,
  ) => DomainEvent<TDeniedEvent>;
};

export type AcquireLockUsecaseDeps<
  TLockedEvent extends EventType = EventType,
  TDeniedEvent extends EventType = EventType,
> = {
  lockService: LockServicePort;
  buildLockKey: (storeId: StoreId, entityId: string) => LockKey;
  eventPublisher?: IEventPublisherPort;
  emitEvents?: boolean;
  eventFactory?: AcquireLockEventFactory<TLockedEvent, TDeniedEvent>;
};

export const acquireLockUsecase = defineUsecase<
  AcquireLockInput,
  LockResult,
  StoreAuthContext,
  AcquireLockUsecaseDeps
>(async (input, context, deps) => {
  const key = deps.buildLockKey(
    brand<string, StoreId>(context.storeId) as StoreId,
    input.entityId,
  );

  const result = await deps.lockService.acquire(
    key,
    brand<string, StoreAdminId>(context.adminId) as StoreAdminId,
    input.ttlMs,
  );

  const shouldEmit = deps.emitEvents ?? true;

  if (shouldEmit && deps.eventPublisher && deps.eventFactory) {
    if (result.ok) {
      await deps.eventPublisher.publish(
        deps.eventFactory.buildLockedEvent(context, input, result),
      );
    } else {
      await deps.eventPublisher.publish(
        deps.eventFactory.buildDeniedEvent(context, input, result),
      );
    }
  }

  return result;
});
