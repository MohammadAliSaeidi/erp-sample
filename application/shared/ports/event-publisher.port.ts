import type {
  DomainEvent,
  EventType,
} from "@/domain/shared/events/events.types";

export interface IEventPublisherPort {
  publish<T extends EventType>(event: DomainEvent<T>): Promise<void>;
}
