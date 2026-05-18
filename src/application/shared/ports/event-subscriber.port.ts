import type {
  DomainEvent,
  EventType,
} from "@/src/domain/shared/events/events.types";

export interface IEventSubscriberPort {
  subscribe<T extends EventType>(
    onEvent: (event: DomainEvent<T>) => void,
  ): Promise<void>;
}
