import type { Redis } from "ioredis";
import type { IEventSubscriberPort } from "@/application/shared/ports/event-subscriber.port";
import type { DomainEvent } from "@/domain/shared/events/events.types";

const DOMAIN_EVENTS_CHANNEL = "domain-events";

export function buildRedisEventSubscriber(client: Redis): IEventSubscriberPort {
  return {
    async subscribe(onEvent) {
      await client.subscribe(DOMAIN_EVENTS_CHANNEL);

      client.on("message", (_channel, message) => {
        try {
          const event = JSON.parse(message) as DomainEvent<any>;
          onEvent(event);
        } catch (err) {
          console.error("[ws] failed to parse event", err);
        }
      });
    },
  };
}
