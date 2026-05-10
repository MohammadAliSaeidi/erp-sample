import { z } from "zod";
import { EventRegistry } from "./event-registry";

export type EventType = keyof typeof EventRegistry;

export type EventPayload<T extends EventType> = z.infer<
  (typeof EventRegistry)[T]["schema"]
>;

export type DomainEvent<T extends EventType> = {
  type: T;
  version: (typeof EventRegistry)[T]["version"];
  payload: EventPayload<T>;
  meta: {
    actorId: string;
    occurredAt: string;
  };
};
