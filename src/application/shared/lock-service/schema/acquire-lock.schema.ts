import { z } from "zod";

export const acquireLockInputSchema = z.object({
  entityId: z.string().min(1),
  ttlMs: z
    .number()
    .min(1000)
    .max(10 * 60 * 1000),
});

export type AcquireLockInput = z.output<typeof acquireLockInputSchema>;
