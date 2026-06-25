import { z } from "zod";

export const refreshLockInputSchema = z.object({
  entityId: z.string().min(1),
  ttlMs: z
    .number()
    .min(1000)
    .max(10 * 60 * 1000),
  token: z.string().min(1),
});

export type RefreshLockInput = z.output<typeof refreshLockInputSchema>;
