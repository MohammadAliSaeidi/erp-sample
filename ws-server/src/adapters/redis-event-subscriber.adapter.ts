import type { Redis } from "ioredis";

const DOMAIN_EVENTS_CHANNEL = "domain-events";

type WsDomainEvent = {
  type: string;
  version: number;
  payload: unknown;
  meta: {
    actorAdminId: string;
    occurredAt: string;
  };
};

function isWsDomainEvent(value: unknown): value is WsDomainEvent {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const event = value as Partial<WsDomainEvent>;
  return (
    typeof event.type === "string" &&
    typeof event.version === "number" &&
    typeof event.meta === "object" &&
    event.meta !== null &&
    typeof event.meta.actorAdminId === "string" &&
    typeof event.meta.occurredAt === "string"
  );
}

export function buildRedisEventSubscriber(client: Redis) {
  return {
    async subscribe(onEvent: (event: WsDomainEvent) => void): Promise<void> {
      await client.subscribe(DOMAIN_EVENTS_CHANNEL);

      client.on("message", (channel, message) => {
        if (channel !== DOMAIN_EVENTS_CHANNEL) return;

        try {
          const parsed = JSON.parse(message);
          if (!isWsDomainEvent(parsed)) {
            console.error("[ws] invalid domain event payload shape");
            return;
          }
          onEvent(parsed);
        } catch (err) {
          console.error("[ws] failed to parse event", err);
        }
      });
    },
  };
}
