import { EventRegistry } from "./event-registry";
import type { DomainEvent, EventType, EventPayload } from "./events.types";

export function buildEvent<
  const TEventType extends EventType,
  const TEventMeta extends object | undefined,
>(
  type: TEventType,
  payload: EventPayload<TEventType>,
  meta: TEventMeta,
): DomainEvent<TEventType, TEventMeta> {
  return {
    type,
    version: EventRegistry[type].version,
    payload,
    meta: {
      occurredAt: new Date().toISOString(),
      ...meta,
    },
  };
}
