import type {
  DomainEvent,
  EventType,
} from "@/src/domain/shared/events/events.types";

export interface IEventPublisherPort {
  publish<T extends EventType>(event: DomainEvent<T>): Promise<void>;
}
