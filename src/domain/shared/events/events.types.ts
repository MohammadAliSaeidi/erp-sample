import { z } from "zod";
import { EventRegistry } from "./event-registry";

export type EventType = keyof typeof EventRegistry;

export type EventPayload<T extends EventType> = z.infer<
  (typeof EventRegistry)[T]["payloadSchema"]
>;

export type DomainEvent<
  TEventType extends EventType,
  TEventMeta extends object | undefined = undefined,
> = {
  type: TEventType;
  version: (typeof EventRegistry)[TEventType]["version"];
  payload: EventPayload<TEventType>;
  meta: TEventMeta;
};
