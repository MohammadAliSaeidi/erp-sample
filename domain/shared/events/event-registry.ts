import { z } from "zod";

export const EventRegistry = {
  "item.locked": {
    version: 1,
    schema: z.object({
      storeId: z.string(),
      itemId: z.string(),
      lockedBy: z.string(),
      expiresAt: z.string(),
    }),
    room: (payload: { storeId: string; itemId: string }) =>
      `store:${payload.storeId}:item:${payload.itemId}`,
  },

  "item.unlocked": {
    version: 1,
    schema: z.object({
      storeId: z.string(),
      itemId: z.string(),
      unlockedBy: z.string(),
    }),
    room: (payload: { storeId: string; itemId: string }) =>
      `store:${payload.storeId}:item:${payload.itemId}`,
  },

  "item.updated": {
    version: 1,
    schema: z.object({
      storeId: z.string(),
      itemId: z.string(),
      name: z.string(),
      price: z.number(),
    }),
    room: (payload: { storeId: string; itemId: string }) =>
      `store:${payload.storeId}:item:${payload.itemId}`,
  },

  "item.lock.denied": {
    version: 1,
    schema: z.object({
      storeId: z.string(),
      itemId: z.string(),
      requestedBy: z.string(),
      lockedBy: z.string(),
      expiresAt: z.string(),
    }),
    room: (payload: { storeId: string; itemId: string }) =>
      `store:${payload.storeId}:item:${payload.itemId}`,
  },
} as const;
