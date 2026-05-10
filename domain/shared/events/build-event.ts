import { EventRegistry } from "./event-registry";
import type { DomainEvent, EventType, EventPayload } from "./events.types";

export function buildEvent<const T extends EventType>(
  type: T,
  payload: EventPayload<T>,
  actorAdminId: string,
): DomainEvent<T> {
  return {
    type,
    version: EventRegistry[type].version,
    payload,
    meta: { actorAdminId, occurredAt: new Date().toISOString() },
  };
}
