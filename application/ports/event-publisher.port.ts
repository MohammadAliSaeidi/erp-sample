/** Event envelope shape used across the application. */
export type DomainEvent<TPayload = unknown> = {
  /** Event type: e.g. "item.updated" */
  type: string;
  /** Business payload */
  payload: TPayload;
  /** Optional metadata (actor, time, etc.) */
  meta?: {
    actorId?: string;
    occurredAt?: string;
    [k: string]: unknown;
  };
};

/** Port: publish domain events to any infrastructure (WS, queue, log, etc.) */
export interface EventPublisherPort {
  /**
   * Publish a domain event.
   * @param event Domain event to publish.
   */
  publish<TPayload>(event: DomainEvent<TPayload>): Promise<void>;
}
