import { Brand } from "@/lib/brand";
import { z, ZodObject, ZodRawShape } from "zod";

export type EventRoom = Brand<string, "EventRoom">;

type EventRegistryEntry<TSchema extends ZodObject<ZodRawShape>> = {
  version: number;
  payloadSchema: TSchema;
  room: (payload: Partial<z.infer<TSchema>>) => EventRoom;
};

type RegistryEntry = EventRegistryEntry<ZodObject<ZodRawShape>>;

const defineRegistry = <const T extends Record<string, RegistryEntry>>(r: T) =>
  r;

export const EventRegistry = defineRegistry({
  "item.locked": {
    version: 1,
    payloadSchema: z.object({
      storeId: z.string(),
      itemId: z.string(),
      lockedBy: z.string(),
      expiresAt: z.string(),
      token: z.string(),
    }),
    room: (payload) =>
      `store:${payload.storeId}:item:${payload.itemId}` as EventRoom,
  },

  "item.unlocked": {
    version: 1,
    payloadSchema: z.object({
      storeId: z.string(),
      itemId: z.string(),
      unlockedBy: z.string().brand("AdminId"),
    }),
    room: (payload) =>
      `store:${payload.storeId}:item:${payload.itemId}` as EventRoom,
  },

  "item.updated": {
    version: 1,
    payloadSchema: z.object({
      storeId: z.string(),
      itemId: z.string(),
      name: z.string(),
      price: z.number(),
    }),
    room: (payload) =>
      `store:${payload.storeId}:item:${payload.itemId}` as EventRoom,
  },

  "item.lock.denied": {
    version: 1,
    payloadSchema: z.object({
      storeId: z.string(),
      itemId: z.string(),
      requestedBy: z.string(),
      lockedBy: z.string(),
      expiresAt: z.string(),
    }),
    room: (payload) =>
      `store:${payload.storeId}:item:${payload.itemId}` as EventRoom,
  },

  "item.unlock.denied": {
    version: 1,
    payloadSchema: z.object({
      storeId: z.string(),
      itemId: z.string(),
    }),
    room: (payload) =>
      `store:${payload.storeId}:item:${payload.itemId}` as EventRoom,
  },
});

export type EventName = keyof typeof EventRegistry;
