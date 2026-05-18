import { IWsServerPort } from "@/src/infrastructure/ws/ws-server.port";
import { IEventPublisherPort } from "@/src/application/shared/ports/event-publisher.port";
import {
  DomainEvent,
  EventType,
} from "@/src/domain/shared/events/events.types";

type StoreScopedPayload = { storeId?: string };

export const buildWsEventPublisher = (
  ws: IWsServerPort,
): IEventPublisherPort => {
  return {
    async publish<T extends EventType>(event: DomainEvent<T>): Promise<void> {
      const json = JSON.stringify(event);
      const storeId = (event.payload as StoreScopedPayload).storeId;

      if (storeId) {
        return ws.broadcastToRoom(`store:${storeId}`, json);
      }

      return ws.broadcast(json);
    },
  };
};
