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
  },
  "item.unlocked": {
    version: 1,
    schema: z.object({
      storeId: z.string(),
      itemId: z.string(),
      unlockedBy: z.string(),
    }),
  },
  "item.updated": {
    version: 1,
    schema: z.object({
      storeId: z.string(),
      itemId: z.string(),
      name: z.string(),
      price: z.number(),
    }),
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
  },
} as const;
