export const config = {
  port: Number(process.env.PORT ?? 3001),
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  domainEventsChannel: process.env.DOMAIN_EVENTS_CHANNEL ?? "domain-events",
};
