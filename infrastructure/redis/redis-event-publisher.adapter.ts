import type { Redis } from "ioredis";
import type { IEventPublisherPort } from "@/application/shared/ports/event-publisher.port";
import type {
  DomainEvent,
  EventType,
} from "@/domain/shared/events/events.types";

const DOMAIN_EVENTS_CHANNEL = "domain-events";

export function buildRedisEventPublisher(client: Redis): IEventPublisherPort {
  return {
    async publish<T extends EventType>(event: DomainEvent<T>): Promise<void> {
      await client.publish(DOMAIN_EVENTS_CHANNEL, JSON.stringify(event));
    },
  };
}

// export redisEventPublisher
